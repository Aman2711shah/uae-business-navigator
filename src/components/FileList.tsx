import React from 'react';
import { FileText, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatFileSize } from '@/lib/uploads';

interface FileItem {
  name: string;
  size: number;
  type: string;
  file: File;
  uploaded?: boolean;
  progress?: number;
  error?: string;
  storagePath?: string;
}

interface FileListProps {
  files: FileItem[];
  onRemove: (index: number) => void;
  isUploading?: boolean;
  className?: string;
}

const FileList: React.FC<FileListProps> = ({ 
  files, 
  onRemove, 
  isUploading = false,
  className = "" 
}) => {
  if (files.length === 0) {
    return null;
  }

  const getFileIcon = (type: string) => {
    return <FileText className="h-4 w-4 text-primary" />;
  };

  const getStatusIcon = (file: FileItem) => {
    if (file.error) {
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    }
    
    if (file.uploaded) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    
    return null;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="font-medium text-sm">Selected Files ({files.length}):</h4>
      {files.map((file, index) => (
        <div 
          key={index} 
          className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {getFileIcon(file.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" title={file.name}>
                {file.name}
              </p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
                {file.error && (
                  <p className="text-xs text-destructive" title={file.error}>
                    Upload failed
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Progress bar */}
            {isUploading && file.progress !== undefined && !file.uploaded && !file.error && (
              <div className="w-16">
                <Progress value={file.progress} className="h-2" />
                <p className="text-xs text-center mt-1">{Math.round(file.progress)}%</p>
              </div>
            )}
            
            {/* Status icon */}
            {getStatusIcon(file)}
            
            {/* Remove button */}
            {!file.uploaded && !isUploading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(index)}
                className="h-8 w-8 p-0"
                aria-label={`Remove ${file.name}`}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;