
import React, { useRef, useState } from 'react';
import { Send, Paperclip, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import WikipediaLoader from './WikipediaLoader';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAutoResizeTextarea } from '@/hooks/use-auto-resize-textarea';

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
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const { toast } = useToast();
  
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 52,
    maxHeight: 200,
  });

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSendMessage();
        adjustHeight(true);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
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

  const handleContainerClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

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

      <div className="relative max-w-xl w-full mx-auto">
        <div
          role="textbox"
          tabIndex={0}
          aria-label="Message input container"
          className={cn(
            "relative flex flex-col rounded-xl transition-all duration-200 w-full text-left cursor-text",
            "ring-1 ring-white/10",
            isFocused && "ring-white/20"
          )}
          onClick={handleContainerClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleContainerClick();
            }
          }}
        >
          <div className="overflow-y-auto max-h-[200px]">
            <Textarea
              value={value}
              placeholder="Message nexora..."
              className="w-full rounded-xl rounded-b-none px-4 py-3 bg-white/5 border-none text-white placeholder:text-white/70 resize-none focus-visible:ring-0 leading-[1.2]"
              ref={textareaRef}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeyPress}
              onChange={(e) => {
                onChange(e.target.value);
                adjustHeight();
              }}
              disabled={disabled}
            />
          </div>

          <div className="h-12 bg-white/5 rounded-b-xl">
            <div className="absolute left-3 bottom-3 flex items-center gap-2">
              <label className="cursor-pointer rounded-lg p-2 bg-white/5">
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden" 
                  disabled={disabled}
                />
                <Paperclip className="w-4 h-4 text-white/40 hover:text-white transition-colors" />
              </label>
              
              <button
                type="button"
                onClick={() => setShowSearch(!showSearch)}
                className={cn(
                  "rounded-full transition-all flex items-center gap-2 px-1.5 py-1 border h-8 cursor-pointer",
                  showSearch
                    ? "bg-purple-500/15 border-purple-400 text-purple-400"
                    : "bg-white/5 border-transparent text-white/40 hover:text-white"
                )}
                disabled={disabled}
              >
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  <motion.div
                    animate={{
                      rotate: showSearch ? 180 : 0,
                      scale: showSearch ? 1.1 : 1,
                    }}
                    whileHover={{
                      rotate: showSearch ? 180 : 15,
                      scale: 1.1,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      },
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 25,
                    }}
                  >
                    {isSearching ? (
                      <div className="w-4 h-4">
                        <WikipediaLoader />
                      </div>
                    ) : (
                      <Globe
                        className={cn(
                          "w-4 h-4",
                          showSearch ? "text-purple-400" : "text-inherit"
                        )}
                      />
                    )}
                  </motion.div>
                </div>
                <AnimatePresence>
                  {showSearch && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm overflow-hidden whitespace-nowrap text-purple-400 shrink-0"
                    >
                      Search
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
            
            <div className="absolute right-3 bottom-3">
              <button
                type="button"
                onClick={() => {
                  if (showSearch && value.trim()) {
                    handleWikipediaSearch();
                  } else {
                    onSendMessage();
                    adjustHeight(true);
                  }
                }}
                disabled={disabled || !value.trim()}
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  value.trim()
                    ? "bg-purple-500/15 text-purple-400"
                    : "bg-white/5 text-white/40 cursor-not-allowed"
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
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
