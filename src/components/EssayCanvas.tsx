
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, Copy, Edit } from 'lucide-react';

interface EssayCanvasProps {
  content: string;
  onEdit?: (newContent: string) => void;
}

export const EssayCanvas = ({ content, onEdit }: EssayCanvasProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    if (onEdit) {
      onEdit(editedContent);
    }
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent);
  };

  const handleDownload = () => {
    const blob = new Blob([editedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nexora-essay.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4 my-3 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-gray-400 font-medium">Essay</div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white h-7 px-2"
          >
            <Edit className="w-3 h-3 mr-1" />
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          <Button
            onClick={handleCopy}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white h-7 px-2"
          >
            <Copy className="w-3 h-3 mr-1" />
            Copy
          </Button>
          <Button
            onClick={handleDownload}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white h-7 px-2"
          >
            <Download className="w-3 h-3 mr-1" />
            Download
          </Button>
          {isEditing && (
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 h-7 px-2"
            >
              Save
            </Button>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full h-64 bg-gray-800 text-gray-100 p-3 rounded border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none font-mono text-sm"
          placeholder="Write your essay here..."
        />
      ) : (
        <div className="bg-gray-800 rounded p-3 min-h-64 max-h-96 overflow-y-auto">
          <div className="text-sm text-gray-100 whitespace-pre-wrap leading-relaxed">
            {editedContent}
          </div>
        </div>
      )}
    </div>
  );
};
