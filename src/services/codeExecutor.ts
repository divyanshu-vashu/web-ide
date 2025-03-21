import { loadPyodide, type PyodideInterface } from "pyodide";
import type { Terminal } from 'xterm';
import { ExecutionResult } from '../types';
import { GopherJSService } from './gopherjs';

// Define the Python libraries we want to support
export interface PythonLibrary {
  name: string;
  displayName: string;
  alias: string;
  aliases?: string[];
  submodule?: string;
}

// Define the Python libraries we want to support
export const PYTHON_LIBRARIES: PythonLibrary[] = [
  { name: 'numpy', displayName: 'NumPy', alias: 'np', aliases: ['np'] },
  { name: 'pandas', displayName: 'Pandas', alias: 'pd', aliases: ['pd'] },
  { name: 'matplotlib', displayName: 'Matplotlib', alias: 'plt', aliases: ['plt'], submodule: 'pyplot' },
  { name: 'scikit-learn', displayName: 'Scikit-learn', alias: 'sklearn', aliases: ['sklearn'] },
  { name: 'scipy', displayName: 'SciPy', alias: 'sp', aliases: ['sp'] },
];

export class CodeExecutor {
  private terminal: Terminal;
  private pyodide: any = null;
  private isInitializing: boolean = false;
  private gopherJSService: GopherJSService;
  private loadedLibraries: Set<string> = new Set();
  private isLibraryLoading: boolean = false;

  constructor(terminal: Terminal) {
    this.terminal = terminal;
    this.gopherJSService = GopherJSService.getInstance();
  }

  private writeSuccess(text: string): void {
    this.terminal.writeln(`\x1b[32m${text}\x1b[0m`);
  }

  private writeError(text: string): void {
    this.terminal.writeln(`\x1b[31m${text}\x1b[0m`);
  }

  private writeInfo(text: string): void {
    this.terminal.writeln(`\x1b[36m${text}\x1b[0m`);
  }

  private writeWarning(text: string): void {
    this.terminal.writeln(`\x1b[33m${text}\x1b[0m`);
  }

  // Initialize the Python environment using Pyodide
  async initializePython(): Promise<void> {
    if (this.isInitializing) {
      this.writeInfo('Python environment initialization is already in progress...');
      return;
    }
    if (this.pyodide) {
      this.writeInfo('Python environment is already initialized.');
      return;
    }

    try {
      this.isInitializing = true;
      this.writeInfo('Initializing Python environment...');
      
      this.pyodide = await loadPyodide({
        stdout: (text: string) => this.terminal.writeln(text),
        stderr: (text: string) => this.writeError(text),
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.3/full/"
      });

      this.writeSuccess('Python environment is ready!');
      
      // Preload matplotlib-related setup to make it work in browser
      await this.setupMatplotlib();
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      this.writeError(`Failed to initialize Python environment: ${errMsg}`);
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

  // Setup matplotlib to work in browser environment
  private async setupMatplotlib(): Promise<void> {
    if (!this.pyodide) return;
    
    try {
      // Run setup code for matplotlib to use the 'agg' backend which works in browser
      await this.pyodide.runPythonAsync(`
        import sys
        import io
        import base64
        from js import document

        # Function to display matplotlib plots in browser
        def show_plot():
            import matplotlib.pyplot as plt
            plt.tight_layout()
            buf = io.BytesIO()
            plt.savefig(buf, format='png')
            buf.seek(0)
            img_str = 'data:image/png;base64,' + base64.b64encode(buf.read()).decode('UTF-8')
            
            # Create an img element and set its src
            img = document.createElement('img')
            img.setAttribute('src', img_str)
            img.setAttribute('style', 'max-width: 100%;')
            
            # Create a div for the output
            output_div = document.createElement('div')
            output_div.appendChild(img)
            
            # Add to the terminal output container (assuming the terminal container has an ID)
            term_container = document.getElementById('terminal-container')
            if term_container:
                term_container.appendChild(output_div)
            
            plt.close()
      `);
      
      this.writeSuccess('Matplotlib support configured for browser environment');
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      this.writeWarning(`Note: Matplotlib setup incomplete: ${errMsg}`);
    }
  }

  // Check and load required libraries based on code analysis
  private async detectAndLoadLibraries(code: string): Promise<void> {
    // Skip if we're already loading libraries
    if (this.isLibraryLoading) {
      this.terminal.writeln('⏳ Library loading already in progress, please wait...');
      return;
    }

    try {
      // Check for import statements
      const importMatches = Array.from(code.matchAll(/import\s+([\w,\s*]+)(?:\s+as\s+[\w]+)?(?:\s+from\s+([\w.]+))?/g));
      
      if (importMatches.length === 0) return;
      
      // Start processing imports
      const librariesToLoad: string[] = [];
      
      for (const match of importMatches) {
        const fromModule = match[2]; // from X import Y
        const importNames = match[1].split(',').map(name => name.trim());
        
        // If it's a 'from X import Y' statement
        if (fromModule) {
          // Check if the base module is one of our supported libraries
          for (const lib of PYTHON_LIBRARIES) {
            if (fromModule === lib.name || (lib.aliases && lib.aliases.includes(fromModule))) {
              librariesToLoad.push(lib.name);
              break;
            }
          }
        } else {
          // Direct import: 'import X'
          for (const importName of importNames) {
            // Remove 'as X' if present
            const baseName = importName.split(' as ')[0].trim();
            
            // Check against our supported libraries
            for (const lib of PYTHON_LIBRARIES) {
              if (baseName === lib.name || (lib.aliases && lib.aliases.includes(baseName))) {
                librariesToLoad.push(lib.name);
                break;
              }
            }
          }
        }
      }
      
      // Load the detected libraries
      if (librariesToLoad.length > 0) {
        this.terminal.writeln(`📚 Detected libraries: ${librariesToLoad.join(', ')}`);
        for (const lib of librariesToLoad) {
          if (!this.loadedLibraries.has(lib)) {
            await this.loadPythonLibrary(lib);
          }
        }
      }
    } catch (error) {
      this.terminal.writeln(`❌ Error detecting libraries: ${String(error)}`);
    }
  }
  
  // Load a specific Python library
  private async loadPythonLibrary(libraryName: string): Promise<void> {
    if (this.loadedLibraries.has(libraryName) || !this.pyodide) {
      return;
    }
    
    this.isLibraryLoading = true;
    
    try {
      const library = PYTHON_LIBRARIES.find(lib => lib.name === libraryName);
      if (!library) {
        throw new Error(`Library ${libraryName} is not supported`);
      }
      
      this.terminal.writeln(`📦 Loading ${library.displayName}... This may take a moment.`);
      
      await this.pyodide.loadPackage(libraryName, (msg: string) => {
        this.terminal.writeln(`   ${msg}`);
      });
      
      // For matplotlib, we need additional setup
      if (libraryName === 'matplotlib') {
        await this.setupMatplotlib();
      }
      
      this.loadedLibraries.add(libraryName);
      this.terminal.writeln(`✅ Successfully loaded ${library.displayName}`);
    } catch (error) {
      this.terminal.writeln(`❌ Failed to load ${libraryName}: ${String(error)}`);
      throw error;
    } finally {
      this.isLibraryLoading = false;
    }
  }

  // Execute Python code
  public async executePython(code: string): Promise<void> {
    try {
      // Initialize Python if not already done
      if (!this.pyodide) {
        this.terminal.writeln('🚀 Initializing Python environment...');
        await this.initializePython();
      }

      // Detect and load necessary libraries before execution
      await this.detectAndLoadLibraries(code);
      
      // Execute the code
      this.terminal.writeln('🔍 Executing Python code...\r\n');

      try {
        const result = await this.pyodide.runPythonAsync(code);
        if (result !== undefined && result !== null && typeof result.toString === 'function') {
          this.terminal.writeln(`\r\n🔹 Result: ${result.toString()}`);
        }
      } catch (error) {
        this.terminal.writeln(`\r\n❌ Error: ${(error as any).message || String(error)}\r\n`);
        // If we have traceback info, display it nicely
        if ((error as any).traceback) {
          this.terminal.writeln('Traceback:');
          this.terminal.writeln((error as any).traceback);
        }
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        this.terminal.writeln(`\r\n❌ System Error: ${error.message}`);
      } else {
        this.terminal.writeln(`\r\n❌ Unknown Error: ${String(error)}`);
      }
      throw error;
    }
  }

  // Execute Go code using GopherJS
  async executeGo(code: string): Promise<ExecutionResult> {
    this.writeInfo('Transpiling and executing Go code...');
    
    try {
      // First, check if the code looks valid
      if (!code.includes('package main') || !code.includes('func main()')) {
        this.writeWarning('Warning: Go code should contain a "package main" declaration and a "func main()" function');
      }
      
      // Compile Go code to JavaScript using GopherJS
      this.writeInfo('Transpiling Go code to JavaScript...');
      const compileResult = await this.gopherJSService.compile(code);
      
      if (!compileResult.success || !compileResult.js) {
        throw new Error(compileResult.error || 'Compilation failed with no error message');
      }
      
      // Execute the compiled JavaScript
      this.writeInfo('Executing compiled JavaScript...');
      const output = await this.gopherJSService.execute(compileResult.js);
      
      // Output the results
      this.writeSuccess('Go code executed successfully:');
      
      if (output) {
        output.split('\n').forEach(line => {
          this.terminal.writeln(line);
        });
      } else {
        this.terminal.writeln('(No output)');
      }
      
      return {
        success: true,
        output: output
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      this.writeError(`Error executing Go code: ${errorMessage}`);
      return {
        success: false,
        error: errorMessage
      };
    }
  }
}
