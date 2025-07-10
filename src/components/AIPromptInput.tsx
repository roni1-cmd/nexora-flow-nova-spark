
import React, { useRef, useState } from 'react';
import { Send, Paperclip, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useAutoResizeTextarea } from '@/hooks/use-auto-resize-textarea';

interface Model {
  id: string;
  name: string;
}

interface AIPromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSendMessage: () => void;
  onImageUpload: (file: File) => void;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  models: Model[];
  disabled?: boolean;
  uploadedImage?: string | null;
  onRemoveImage?: () => void;
}

const AIPromptInput: React.FC<AIPromptInputProps> = ({
  value,
  onChange,
  onSendMessage,
  onImageUpload,
  selectedModel,
  onModelChange,
  models,
  disabled = false,
  uploadedImage,
  onRemoveImage
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  useAutoResizeTextarea(textareaRef, value, 120);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() || uploadedImage) {
      onSendMessage();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const selectedModelName = models.find(m => m.id === selectedModel)?.name || 'Select Model';

  return (
    <div className="relative">
      {uploadedImage && (
        <div className="mb-3 relative inline-block">
          <img 
            src={uploadedImage} 
            alt="Uploaded" 
            className="max-w-xs max-h-32 rounded-lg border border-gray-700"
          />
          <Button
            onClick={onRemoveImage}
            size="sm"
            variant="ghost"
            className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="relative">
        <div 
          className={`flex items-end gap-2 p-3 bg-gray-900 rounded-2xl border transition-colors ${
            isDragOver 
              ? 'border-purple-500 bg-purple-500/5' 
              : 'border-gray-700 hover:border-gray-600'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message nexora..."
              disabled={disabled}
              className="w-full bg-transparent text-white placeholder-gray-400 resize-none border-none outline-none text-sm leading-relaxed min-h-[24px] max-h-32"
              rows={1}
            />
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-gray-400 hover:text-white h-8 px-3"
                  disabled={disabled}
                >
                  <span className="max-w-32 truncate">{selectedModelName}</span>
                  <ChevronDown className="w-3 h-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white">
                {models.map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => onModelChange(model.id)}
                    className={`cursor-pointer hover:bg-gray-800 ${
                      selectedModel === model.id ? 'bg-gray-800 text-purple-400' : ''
                    }`}
                  >
                    {model.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white h-8 w-8 p-0"
              disabled={disabled}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <Button
              type="submit"
              size="sm"
              disabled={disabled || (!value.trim() && !uploadedImage)}
              className="bg-purple-600 hover:bg-purple-700 h-8 w-8 p-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </form>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default AIPromptInput;
