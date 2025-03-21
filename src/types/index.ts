export interface Language {
  id: string;
  name: string;
  extension: string;
}

export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
}

export interface FileItem {
  id: string;
  name: string;
  content: string;
  language: string;
  path: string;
} 