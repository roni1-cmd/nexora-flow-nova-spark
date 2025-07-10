
import React, { useRef, useState } from 'react';
import { ArrowRight, Paperclip, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ 
    minHeight: 72, 
    maxHeight: 300 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() || uploadedImage) {
      onSendMessage();
      adjustHeight(true);
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
    <div className="relative w-full max-w-4xl mx-auto">
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
        <div className="bg-black/5 dark:bg-white/5 rounded-2xl p-1.5">
          <div className="relative flex flex-col">
            <div 
              className={cn(
                "overflow-y-auto transition-colors",
                isDragOver && "bg-purple-500/10"
              )}
              style={{ maxHeight: "300px" }}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Textarea
                value={value}
                placeholder="What can I do for you?"
                className={cn(
                  "w-full rounded-xl rounded-b-none px-4 py-3 bg-black/5 dark:bg-white/5 border-none text-white placeholder:text-white/70 resize-none focus-visible:ring-0 focus-visible:ring-offset-0",
                  "min-h-[72px]"
                )}
                ref={textareaRef}
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                  onChange(e.target.value);
                  adjustHeight();
                }}
                disabled={disabled}
              />
            </div>

            <div className="h-14 bg-black/5 dark:bg-white/5 rounded-b-xl flex items-center">
              <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between w-[calc(100%-24px)]">
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex items-center gap-1 h-8 pl-1 pr-2 text-xs rounded-md text-white hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
                        disabled={disabled}
                      >
                        <span className="max-w-32 truncate">{selectedModelName}</span>
                        <ChevronDown className="w-3 h-3 opacity-50" />
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
                  
                  <div className="h-4 w-px bg-white/10 mx-0.5" />
                  
                  <label
                    className={cn(
                      "rounded-lg p-2 bg-black/5 dark:bg-white/5 cursor-pointer",
                      "hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
                      "text-white/40 hover:text-white"
                    )}
                    aria-label="Attach file"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Paperclip className="w-4 h-4 transition-colors" />
                  </label>
                </div>
                
                <button
                  type="submit"
                  className={cn(
                    "rounded-lg p-2 bg-black/5 dark:bg-white/5",
                    "hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
                  )}
                  aria-label="Send message"
                  disabled={disabled || (!value.trim() && !uploadedImage)}
                >
                  <ArrowRight
                    className={cn(
                      "w-4 h-4 text-white transition-opacity duration-200",
                      (value.trim() || uploadedImage) ? "opacity-100" : "opacity-30"
                    )}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AIPromptInput;
