"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImageIcon, Send, X, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AIPromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSendMessage: () => void;
  onImageUpload: (file: File) => void;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  models: { id: string; name: string }[];
  disabled: boolean;
  uploadedImage: string | null;
  onRemoveImage: () => void;
}

export default function AIPromptInput({
  value,
  onChange,
  onSendMessage,
  onImageUpload,
  selectedModel,
  onModelChange,
  models,
  disabled,
  uploadedImage,
  onRemoveImage,
}: AIPromptInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  return (
    <div className="relative flex flex-col space-y-3">
      {/* Model selector and image preview row */}
      <div className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-gray-900/50 border-gray-700 text-gray-300 hover:bg-gray-800 text-xs font-google-sans"
            >
              {models.find(m => m.id === selectedModel)?.name || 'Select Model'}
              <ChevronDown className="ml-2 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white z-50">
            {models.map((model) => (
              <DropdownMenuItem
                key={model.id}
                onClick={() => onModelChange(model.id)}
                className={`hover:bg-gray-800 cursor-pointer font-google-sans ${
                  selectedModel === model.id ? 'bg-purple-600/20 text-purple-300' : ''
                }`}
              >
                <span>{model.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Image preview */}
        {uploadedImage && (
          <div className="relative">
            <img 
              src={uploadedImage} 
              alt="Upload preview" 
              className="h-12 w-12 object-cover rounded-lg border border-gray-700"
            />
            <Button
              onClick={onRemoveImage}
              size="sm"
              variant="ghost"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Main input area */}
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          placeholder="Type your message here..."
          className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 pr-16 resize-none font-google-sans"
          disabled={disabled}
        />
        <div className="absolute inset-y-0 right-0 flex items-center space-x-2 p-2">
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="ghost"
            size="sm"
            className="hover:bg-gray-800 text-gray-400"
            disabled={disabled}
          >
            <ImageIcon className="h-4 w-4" />
            <span className="sr-only">Upload Image</span>
          </Button>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          <Button
            onClick={onSendMessage}
            variant="ghost"
            size="sm"
            className="hover:bg-blue-700 bg-blue-600 text-white rounded-full h-8 w-8 p-0"
            disabled={disabled}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send Message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
