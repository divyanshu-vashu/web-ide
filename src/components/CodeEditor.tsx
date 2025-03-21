import React, { useRef, useEffect, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import { FileItem } from '../types';
import { Package } from 'lucide-react';
import { PYTHON_LIBRARIES, PythonLibrary } from '../services/codeExecutor';

// Configure Monaco editor with Go language support
const configureMonaco = () => {
  // This is needed only once
  if ((window as any).monacoConfigured) return;
  
  loader.init().then(monaco => {
    // Register Go language if not already registered
    if (!monaco.languages.getLanguages().some(lang => lang.id === 'go')) {
      // Basic Go language configuration
      monaco.languages.register({ id: 'go' });
      
      // Go language syntax highlighting
      monaco.languages.setMonarchTokensProvider('go', {
        defaultToken: 'invalid',
        tokenPostfix: '.go',
        
        keywords: [
          'break', 'case', 'chan', 'const', 'continue', 'default', 'defer', 
          'else', 'fallthrough', 'for', 'func', 'go', 'goto', 'if', 
          'import', 'interface', 'map', 'package', 'range', 'return', 
          'select', 'struct', 'switch', 'type', 'var'
        ],
        
        operators: [
          '+', '-', '*', '/', '%', '&', '|', '^', '<<', '>>', '&^',
          '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<=', '>>=', '&^=',
          '&&', '||', '<-', '++', '--', '==', '<', '>', '=', '!', '!=', '<=', '>=', ':=', '...',
          '(', ')', '{ }', '[', ']'
        ],
        
        // Symbols and punctuation
        symbols: /[=><!~?:&|+\-*\/\^%]+/,
        
        // Escapes
        escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
        
        // The main tokenizer for our languages
        tokenizer: {
          root: [
            // Identifiers and keywords
            [/[a-zA-Z_]\w*/, { 
              cases: { 
                '@keywords': 'keyword',
                '@default': 'identifier' 
              } 
            }],
            
            // Whitespace
            { include: '@whitespace' },
            
            // Delimiters and operators
            [/[{}()\[\]]/, '@brackets'],
            [/[<>](?!@symbols)/, '@brackets'],
            [/@symbols/, { 
              cases: { 
                '@operators': 'operator',
                '@default'  : '' 
              } 
            }],
            
            // Numbers
            [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            [/0[xX][0-9a-fA-F]+/, 'number.hex'],
            [/\d+/, 'number'],
            
            // Strings
            [/"([^"\\]|\\.)*$/, 'string.invalid'],  // Non-terminated string
            [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
            [/`/, { token: 'string.quote', bracket: '@open', next: '@rawstring' }],
          ],
          
          string: [
            [/[^\\"]+/, 'string'],
            [/@escapes/, 'string.escape'],
            [/\\./, 'string.escape.invalid'],
            [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
          ],
          
          rawstring: [
            [/[^`]/, 'string'],
            [/`/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
          ],
          
          comment: [
            [/[^\/*]+/, 'comment' ],
            [/\/\*/, 'comment', '@push' ],
            ["\\*/", 'comment', '@pop'  ],
            [/[\/*]/, 'comment' ]
          ],
          
          whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/\/\*/, 'comment', '@comment'],
            [/\/\/.*$/, 'comment'],
          ],
        }
      });
    }
    
    (window as any).monacoConfigured = true;
  });
};

interface CodeEditorProps {
  activeFile: FileItem | null;
  onCodeChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ activeFile, onCodeChange }) => {
  const editorRef = useRef<any>(null);
  const [detectedLibraries, setDetectedLibraries] = useState<string[]>([]);

  // Configure Monaco when component mounts
  useEffect(() => {
    configureMonaco();
  }, []);

  // Update the detected libraries when the active file or its content changes
  useEffect(() => {
    if (activeFile?.language === 'python' && activeFile?.content) {
      const libraries: string[] = [];
      
      // Check for import statements using regex
      const matches = activeFile.content.match(/import\s+([\w,\s*]+)(?:\s+as\s+[\w]+)?(?:\s+from\s+([\w.]+))?/g);
      
      if (matches) {
        for (const lib of PYTHON_LIBRARIES) {
          // Create a regex pattern that matches any of the library's import patterns
          const aliasPattern = lib.aliases && lib.aliases.length > 0 
            ? `|import\\s+.*\\s+as\\s+(${lib.aliases.join('|')})`
            : '';
          const pattern = new RegExp(`(import\\s+${lib.name}|from\\s+${lib.name}\\s+import${aliasPattern})`, 'i');
          
          if (matches.some(match => pattern.test(match))) {
            libraries.push(lib.name);
          }
        }
      }
      
      setDetectedLibraries(libraries);
    } else {
      setDetectedLibraries([]);
    }
  }, [activeFile]);

  // Handle editor mount
  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
  };

  // Handle theme based on user's system preference
  const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (!activeFile) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 text-gray-400">
        <p>Select a file to edit or create a new one</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Library Indicators (when Python is selected) */}
      {activeFile?.language === 'python' && detectedLibraries.length > 0 && (
        <div className="bg-gray-100 dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-700 flex flex-wrap gap-2">
          {detectedLibraries.map(lib => {
            const library = PYTHON_LIBRARIES.find(l => l.name === lib);
            return (
              <div 
                key={lib}
                className="flex items-center text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-1"
              >
                <Package className="h-3 w-3 mr-1" />
                {library?.displayName || lib}
              </div>
            );
          })}
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center ml-2">
            Supported libraries detected in your code
          </div>
        </div>
      )}
      
      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage={activeFile.language}
          language={activeFile.language}
          value={activeFile.content}
          onChange={(value) => onCodeChange(value || '')}
          theme={isDarkMode ? 'vs-dark' : 'vs-light'}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            folding: true,
            renderWhitespace: 'none',
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor; 