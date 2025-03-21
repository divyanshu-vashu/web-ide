import React, { useState, useEffect } from 'react';
import { getExamplesForLibrary, PythonExample } from '../services/pythonExamples';
import { ChevronRight, BookOpen, Code, Copy } from 'lucide-react';

interface PythonExamplesPanelProps {
  onSelectExample: (code: string) => void;
}

const PythonExamplesPanel: React.FC<PythonExamplesPanelProps> = ({ onSelectExample }) => {
  const [examples, setExamples] = useState<PythonExample[]>([]);
  const [selectedLibrary, setSelectedLibrary] = useState<string>('all');
  const [expandedExample, setExpandedExample] = useState<string | null>(null);

  const libraries = [
    { id: 'all', name: 'All Libraries' },
    { id: 'numpy', name: 'NumPy' },
    { id: 'pandas', name: 'Pandas' },
    { id: 'matplotlib', name: 'Matplotlib' },
    { id: 'scikit-learn', name: 'Scikit-learn' },
  ];

  useEffect(() => {
    setExamples(getExamplesForLibrary(selectedLibrary));
  }, [selectedLibrary]);

  const handleSelectLibrary = (library: string) => {
    setSelectedLibrary(library);
    setExpandedExample(null);
  };

  const handleExpandExample = (exampleName: string) => {
    setExpandedExample(expandedExample === exampleName ? null : exampleName);
  };

  const handleUseExample = (code: string) => {
    onSelectExample(code);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-100 dark:bg-gray-800">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
          <BookOpen className="mr-2 h-4 w-4" />
          Python Examples
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Browse examples for popular Python libraries
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2 p-3 border-b border-gray-200 dark:border-gray-700">
        {libraries.map((lib) => (
          <button
            key={lib.id}
            className={`px-3 py-1 text-sm rounded-full ${
              selectedLibrary === lib.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            onClick={() => handleSelectLibrary(lib.id)}
          >
            {lib.name}
          </button>
        ))}
      </div>
      
      <div className="flex-1 overflow-auto">
        {examples.length === 0 ? (
          <div className="p-5 text-center text-gray-500 dark:text-gray-400">
            No examples available for the selected library
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {examples.map((example) => (
              <div key={example.name} className="example-item">
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={() => handleExpandExample(example.name)}
                >
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">{example.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{example.description}</p>
                  </div>
                  <ChevronRight
                    className={`h-5 w-5 text-gray-500 transition-transform ${
                      expandedExample === example.name ? 'transform rotate-90' : ''
                    }`}
                  />
                </div>
                
                {expandedExample === example.name && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {example.library === 'all' ? 'Multiple Libraries' : example.library}
                      </span>
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 flex items-center text-sm"
                          onClick={() => handleUseExample(example.code)}
                        >
                          <Code className="h-4 w-4 mr-1" />
                          Use Example
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 flex items-center text-sm"
                          onClick={() => {
                            navigator.clipboard.writeText(example.code);
                          }}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </button>
                      </div>
                    </div>
                    <pre className="text-xs bg-gray-800 text-gray-200 p-3 rounded overflow-auto max-h-80">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PythonExamplesPanel; 