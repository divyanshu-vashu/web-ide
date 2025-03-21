import React, { useState } from 'react';
import { Folder, File, Plus, Trash2, Save, FileCode } from 'lucide-react';
import { FileItem, Language } from '../types';

interface FileExplorerProps {
  files: FileItem[];
  activeFileId: string | null;
  onFileSelect: (fileId: string) => void;
  onFileCreate: (language: string) => void;
  onFileDelete: (fileId: string) => void;
  onFileSave: (fileId: string) => void;
  supportedLanguages: Language[];
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  activeFileId,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileSave,
  supportedLanguages,
}) => {
  const [showNewFileMenu, setShowNewFileMenu] = useState(false);

  return (
    <div className="h-full bg-gray-800 text-gray-200 flex flex-col">
      <div className="p-2 border-b border-gray-700 flex items-center justify-between">
        <h2 className="font-semibold">Explorer</h2>
        <button
          className="p-1 hover:bg-gray-700 rounded"
          onClick={() => setShowNewFileMenu(!showNewFileMenu)}
          title="New File"
        >
          <Plus size={16} />
        </button>
      </div>

      {showNewFileMenu && (
        <div className="p-2 bg-gray-700">
          <p className="text-xs mb-1">Select language:</p>
          <div className="flex flex-col space-y-1">
            {supportedLanguages.map((lang) => (
              <button
                key={lang.id}
                className="text-xs p-1 hover:bg-gray-600 rounded text-left flex items-center"
                onClick={() => {
                  onFileCreate(lang.id);
                  setShowNewFileMenu(false);
                }}
              >
                <FileCode size={14} className="mr-1" />
                {lang.name} ({lang.extension})
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-y-auto flex-grow">
        {files.length === 0 ? (
          <div className="p-2 text-gray-400 text-xs">No files yet. Create one to get started.</div>
        ) : (
          <ul>
            {files.map((file) => (
              <li
                key={file.id}
                className={`flex items-center justify-between px-2 py-1 text-sm ${
                  activeFileId === file.id ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
              >
                <button
                  className="flex items-center flex-grow overflow-hidden text-left"
                  onClick={() => onFileSelect(file.id)}
                >
                  <File size={14} className="mr-1 flex-shrink-0" />
                  <span className="truncate">{file.name}</span>
                </button>
                <div className="flex space-x-1">
                  <button
                    className="p-1 hover:bg-gray-600 rounded"
                    onClick={() => onFileSave(file.id)}
                    title="Save"
                  >
                    <Save size={14} />
                  </button>
                  <button
                    className="p-1 hover:bg-gray-600 rounded text-red-400"
                    onClick={() => onFileDelete(file.id)}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FileExplorer; 