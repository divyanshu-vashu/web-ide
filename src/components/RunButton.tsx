import React from 'react';
import { Play } from 'lucide-react';

interface RunButtonProps {
  onClick: () => void;
  isRunning: boolean;
  activeLanguage: string;
}

const RunButton: React.FC<RunButtonProps> = ({ onClick, isRunning, activeLanguage }) => {
  return (
    <button
      onClick={onClick}
      disabled={isRunning}
      className={`${
        isRunning ? 'bg-gray-600' : 'bg-green-600 hover:bg-green-700'
      } text-white px-4 py-1 rounded-md flex items-center space-x-2 transition-colors`}
    >
      <Play size={16} />
      <span>{isRunning ? 'Running...' : 'Run'}</span>
    </button>
  );
};

export default RunButton; 