import React, { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { Folder, Book } from 'lucide-react';

import { CodeExecutor } from './services/codeExecutor';
import FileExplorer from './components/FileExplorer';
import CodeEditor from './components/CodeEditor';
import SimpleTerminal from './components/SimpleTerminal';
import ResizablePanel from './components/ResizablePanel';
import Header from './components/Header';
import PythonExamplesPanel from './components/PythonExamplesPanel';
import { Language, FileItem } from './types';

const SUPPORTED_LANGUAGES: Language[] = [
  { id: 'python', name: 'Python', extension: '.py' },
  { id: 'cpp', name: 'C++', extension: '.cpp' },
  { id: 'go', name: 'Go', extension: '.go' }
];

const DEFAULT_CODE: Record<string, string> = {
  python: '# Python code here\nprint("Hello, World!")',
  cpp: '// C++ code here\n#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
  go: '// Go code here\npackage main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, World!")\n}'
};

function App(): JSX.Element {
  // File management state
  const [files, setFiles] = useState<FileItem[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  
  // Runtime state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  
  // UI state
  const [activeSidebar, setActiveSidebar] = useState<'files' | 'examples'>('files');
  
  // Terminal and code executor references
  const terminalRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const codeExecutorRef = useRef<CodeExecutor | null>(null);

  // Initialize with a default file when the app loads
  useEffect(() => {
    const initialLanguage = SUPPORTED_LANGUAGES[0].id;
    const defaultFile: FileItem = {
      id: uuidv4(),
      name: `main${SUPPORTED_LANGUAGES[0].extension}`,
      content: DEFAULT_CODE[initialLanguage],
      language: initialLanguage,
      path: `main${SUPPORTED_LANGUAGES[0].extension}`
    };
    
    setFiles([defaultFile]);
    setActiveFileId(defaultFile.id);
  }, []);

  // Get the currently active file
  const activeFile = files.find(file => file.id === activeFileId) || null;
  
  // Handler for terminal initialization
  const handleTerminalReady = useCallback((terminal: Terminal, fitAddon: FitAddon) => {
    terminalRef.current = terminal;
    fitAddonRef.current = fitAddon;
    codeExecutorRef.current = new CodeExecutor(terminal);
  }, []);

  // File operations
  const handleFileSelect = (fileId: string) => {
    setActiveFileId(fileId);
  };

  const handleFileCreate = (language: string) => {
    const selectedLang = SUPPORTED_LANGUAGES.find(lang => lang.id === language) || SUPPORTED_LANGUAGES[0];
    const fileName = `new_file_${files.length + 1}${selectedLang.extension}`;
    
    const newFile: FileItem = {
      id: uuidv4(),
      name: fileName,
      content: DEFAULT_CODE[language],
      language: language,
      path: fileName
    };
    
    setFiles([...files, newFile]);
    setActiveFileId(newFile.id);
  };

  const handleFileDelete = (fileId: string) => {
    const newFiles = files.filter(file => file.id !== fileId);
    setFiles(newFiles);
    
    if (activeFileId === fileId) {
      setActiveFileId(newFiles.length > 0 ? newFiles[0].id : null);
    }
  };

  const handleFileSave = (fileId: string) => {
    // In a real app, this would save to a server or local storage
    console.log(`File ${fileId} saved`);
  };

  const handleCodeChange = (content: string) => {
    if (!activeFileId) return;
    
    setFiles(prevFiles => prevFiles.map(file => 
      file.id === activeFileId ? { ...file, content } : file
    ));
  };

  // Code execution
  const handleRun = async () => {
    if (!terminalRef.current || !codeExecutorRef.current || isRunning || !activeFile) return;

    try {
      setIsRunning(true);
      const term = terminalRef.current;
      term.clear();
      term.writeln(`Running ${activeFile.language} code...\r\n`);
      
      if (activeFile.language === 'python') {
        await codeExecutorRef.current.executePython(activeFile.content);
      } else if (activeFile.language === 'cpp') {
        // In a real implementation, you would add C++ execution here
        await codeExecutorRef.current.executePython(activeFile.content);
      } else if (activeFile.language === 'go') {
        await codeExecutorRef.current.executeGo(activeFile.content);
      }
      
      term.writeln('\r\nProgram finished with exit code 0');
    } catch (error) {
      terminalRef.current?.writeln(`\r\nProgram failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Language change handling
  const handleLanguageChange = (languageId: string) => {
    if (!activeFileId || !activeFile) return;
    
    // Get the selected language
    const selectedLang = SUPPORTED_LANGUAGES.find(lang => lang.id === languageId);
    if (!selectedLang) return;
    
    // Update file extension
    const baseName = activeFile.name.split('.')[0];
    const newName = `${baseName}${selectedLang.extension}`;
    
    // Check if we need to update the content with default code
    const shouldResetContent = activeFile.content === DEFAULT_CODE[activeFile.language];
    
    setFiles(prevFiles => prevFiles.map(file => 
      file.id === activeFileId 
        ? { 
            ...file, 
            language: languageId, 
            name: newName,
            path: newName,
            content: shouldResetContent ? DEFAULT_CODE[languageId] : file.content
          } 
        : file
    ));
  };

  // Handle example code selection
  const handleExampleSelect = (code: string) => {
    if (!activeFileId) return;
    
    setFiles(prevFiles => prevFiles.map(file => 
      file.id === activeFileId ? { ...file, content: code } : file
    ));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <Header 
        supportedLanguages={SUPPORTED_LANGUAGES}
        activeLanguage={activeFile?.language || SUPPORTED_LANGUAGES[0].id}
        onLanguageChange={handleLanguageChange}
        onRun={handleRun}
        isRunning={isRunning}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar navigation */}
        <div className="w-10 flex-shrink-0 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4">
          <button 
            className={`p-2 mb-2 rounded-md ${activeSidebar === 'files' ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveSidebar('files')}
            title="Files"
          >
            <Folder size={20} />
          </button>
          {activeFile?.language === 'python' && (
            <button 
              className={`p-2 rounded-md ${activeSidebar === 'examples' ? 'bg-gray-700 text-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
              onClick={() => setActiveSidebar('examples')}
              title="Python Examples"
            >
              <Book size={20} />
            </button>
          )}
        </div>
        
        {/* Sidebar content */}
        <div className="w-52 flex-shrink-0 bg-gray-800">
          {activeSidebar === 'files' ? (
            <FileExplorer 
              files={files}
              activeFileId={activeFileId}
              onFileSelect={handleFileSelect}
              onFileCreate={handleFileCreate}
              onFileDelete={handleFileDelete}
              onFileSave={handleFileSave}
              supportedLanguages={SUPPORTED_LANGUAGES}
            />
          ) : (
            <PythonExamplesPanel onSelectExample={handleExampleSelect} />
          )}
        </div>
        
        {/* Main content area with code editor and terminal */}
        <div className="flex-1 overflow-hidden">
          <ResizablePanel 
            direction="vertical" 
            defaultSizes={[60, 40]} 
            minSizes={[30, 30]}
          >
            {/* Code Editor */}
            <CodeEditor 
              activeFile={activeFile} 
              onCodeChange={handleCodeChange} 
            />
            
            {/* Terminal */}
            <div className="h-full flex flex-col" style={{ minHeight: '200px' }}>
              <SimpleTerminal onReady={handleTerminalReady} />
            </div>
          </ResizablePanel>
        </div>
      </div>
    </div>
  );
}

export default App;