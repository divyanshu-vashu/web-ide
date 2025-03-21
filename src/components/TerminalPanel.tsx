import React, { useEffect, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { Terminal as TerminalIcon } from 'lucide-react';
import 'xterm/css/xterm.css';

interface TerminalPanelProps {
  onTerminalReady: (terminal: XTerm, fitAddon: FitAddon) => void;
}

const TerminalPanel: React.FC<TerminalPanelProps> = ({ onTerminalReady }) => {
  const terminalContainerRef = useRef<HTMLDivElement | null>(null);
  const terminalRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalContainerRef.current || terminalRef.current) return;

    const term = new XTerm({
      cursorBlink: true,
      fontSize: 14,
      theme: {
        background: '#1e1e1e',
        foreground: '#ffffff'
      }
    });
    
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    
    terminalRef.current = term;
    fitAddonRef.current = fitAddon;
    
    term.open(terminalContainerRef.current);
    
    // Initial fit
    const fitTerminal = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    };

    // Delay initial fit to ensure terminal is properly mounted
    setTimeout(fitTerminal, 100);

    // Call the callback with the terminal and fitAddon
    onTerminalReady(term, fitAddon);

    // Handle window resize
    window.addEventListener('resize', fitTerminal);

    // Cleanup
    return () => {
      window.removeEventListener('resize', fitTerminal);
      term.dispose();
      terminalRef.current = null;
      fitAddonRef.current = null;
    };
  }, [onTerminalReady]);

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      <div className="bg-gray-800 p-2 flex items-center space-x-2">
        <TerminalIcon size={16} className="text-gray-400" />
        <span className="text-gray-200">Terminal</span>
      </div>
      <div ref={terminalContainerRef} className="flex-1" />
    </div>
  );
};

export default TerminalPanel; 