import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Terminal as TerminalIcon } from 'lucide-react';
import 'xterm/css/xterm.css';

interface SimpleTerminalProps {
  onReady: (terminal: Terminal, fitAddon: FitAddon) => void;
}

const SimpleTerminal: React.FC<SimpleTerminalProps> = ({ onReady }) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!terminalRef.current) return;
    
    // Create terminal instance
    const terminal = new Terminal({
      cursorBlink: true,
      fontSize: 14,
      theme: {
        background: '#1e1e1e',
        foreground: '#ffffff'
      },
      rows: 10,
      cols: 100,
      disableStdin: false,
    });
    
    // Load fit addon
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    
    // Open terminal in the DOM
    terminal.open(terminalRef.current);
    
    // Write some welcome message
    terminal.write('\x1b[1;32m'); // Bold green text
    terminal.writeln('Terminal initialized. Ready to run code.');
    terminal.write('\x1b[0m'); // Reset formatting
    
    // Fit the terminal to container
    setTimeout(() => {
      try {
        fitAddon.fit();
      } catch (err) {
        console.error('Error fitting terminal:', err);
      }
    }, 100);
    
    // Pass the terminal to parent
    onReady(terminal, fitAddon);
    
    // Handle resize
    const handleResize = () => {
      try {
        fitAddon.fit();
      } catch (err) {
        console.error('Error fitting terminal:', err);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      terminal.dispose();
    };
  }, [onReady]);
  
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]" style={{ minHeight: '200px' }}>
      <div className="bg-gray-800 p-2 flex items-center space-x-2">
        <TerminalIcon size={16} className="text-gray-400" />
        <span className="text-gray-200">Terminal</span>
      </div>
      <div 
        id="terminal-container"
        ref={terminalRef} 
        className="flex-1 terminal-container" 
        style={{ 
          minHeight: '180px',
          position: 'relative',
          padding: '5px'
        }} 
      />
    </div>
  );
};

export default SimpleTerminal; 