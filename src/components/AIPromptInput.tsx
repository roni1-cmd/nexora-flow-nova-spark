
import React, { useRef, useState } from 'react';
import { Send, Paperclip, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'framer-motion';
import WikipediaLoader from './WikipediaLoader';
import { useToast } from '@/hooks/use-toast';

interface AIPromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSendMessage: () => void;
  onImageUpload: (file: File) => void;
  disabled?: boolean;
  uploadedImage?: string | null;
  onRemoveImage?: () => void;
}

const AIPromptInput = ({
  value,
  onChange,
  onSendMessage,
  onImageUpload,
  disabled = false,
  uploadedImage,
  onRemoveImage
}: AIPromptInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSendMessage();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleWikipediaSearch = async () => {
    if (!value.trim()) {
      toast({
        title: "Search Query Required",
        description: "Please enter a search query first.",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    
    try {
      const searchQuery = encodeURIComponent(value.trim());
      const response = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=${searchQuery}&srlimit=3`);
      
      if (!response.ok) {
        throw new Error('Wikipedia search failed');
      }
      
      const data = await response.json();
      const results = data.query.search;
      
      if (results.length > 0) {
        let searchResults = `Wikipedia search results for "${value.trim()}":\n\n`;
        results.forEach((result: any, index: number) => {
          searchResults += `${index + 1}. **${result.title}**\n`;
          searchResults += `${result.snippet.replace(/<[^>]*>/g, '')}\n\n`;
        });
        
        onChange(searchResults);
        onSendMessage();
      } else {
        toast({
          title: "No Results Found",
          description: "No Wikipedia articles found for your search query.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Wikipedia search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search Wikipedia. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [value]);

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence>
        {uploadedImage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-3"
          >
            <div className="relative inline-block">
              <img 
                src={uploadedImage} 
                alt="Uploaded preview" 
                className="max-w-32 max-h-32 rounded-lg border border-gray-700"
              />
              <Button
                onClick={onRemoveImage}
                size="sm"
                variant="ghost"
                className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-600 hover:bg-red-700 text-white rounded-full"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <div className="flex items-end gap-2 p-3 bg-gray-900 rounded-2xl border border-gray-700 focus-within:border-purple-500 transition-colors">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Message nexora..."
            disabled={disabled}
            className="flex-1 min-h-[20px] max-h-[120px] bg-transparent border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder-gray-400 text-sm leading-relaxed"
            style={{ height: 'auto' }}
          />
          
          <div className="flex items-center gap-1">
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
              disabled={disabled}
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            <Button
              type="button"
              onClick={handleWikipediaSearch}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
              disabled={disabled || isSearching || !value.trim()}
            >
              {isSearching ? (
                <div className="w-4 h-4">
                  <WikipediaLoader />
                </div>
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              onClick={onSendMessage}
              disabled={disabled || !value.trim()}
              size="sm"
              className="h-8 w-8 p-0 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default AIPromptInput;
