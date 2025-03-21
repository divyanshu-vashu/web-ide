import React from 'react';
import { Play, Loader2, Code2, Info } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  supportedLanguages: Language[];
  activeLanguage: string;
  onLanguageChange: (languageId: string) => void;
  onRun: () => void;
  isRunning: boolean;
}

const Header: React.FC<HeaderProps> = ({
  supportedLanguages,
  activeLanguage,
  onLanguageChange,
  onRun,
  isRunning
}) => {
  const isGoLanguage = activeLanguage === 'go';
  const isPythonLanguage = activeLanguage === 'python';

  return (
    <header className="bg-gray-800 border-b border-gray-700 p-3 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Code2 className="text-blue-400 h-6 w-6" />
        <h1 className="text-white text-lg font-medium">Browser IDE</h1>
        
        {/* Language badges */}
        {isGoLanguage && (
          <div className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            <Info className="h-3 w-3 mr-1" />
            Using GopherJS Transpiler
          </div>
        )}
        
        {isPythonLanguage && (
          <div className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <Info className="h-3 w-3 mr-1" />
            NumPy, Pandas, Matplotlib & More
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="flex space-x-1 border border-gray-700 rounded-md overflow-hidden">
          {supportedLanguages.map(language => (
            <button
              key={language.id}
              className={`px-3 py-1 text-sm ${
                activeLanguage === language.id
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
              onClick={() => onLanguageChange(language.id)}
            >
              {language.name}
            </button>
          ))}
        </div>
        
        <button
          className={`px-4 py-1 rounded-md flex items-center space-x-1 text-white ${
            isRunning ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
          onClick={onRun}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <Loader2 className="animate-spin h-4 w-4" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span>Run</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header; 