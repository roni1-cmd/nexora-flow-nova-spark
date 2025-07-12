
import React, { useState, useRef } from 'react';
import { Globe, Paperclip, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import WikipediaLoader from './WikipediaLoader';

interface AIPromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSendMessage: () => void;
  onImageUpload: (file: File) => void;
  disabled?: boolean;
  uploadedImage?: string | null;
  onRemoveImage?: () => void;
}

interface WikipediaResult {
  title: string;
  snippet: string;
  pageid: number;
}

const AIPromptInput: React.FC<AIPromptInputProps> = ({
  value,
  onChange,
  onSendMessage,
  onImageUpload,
  disabled = false,
  uploadedImage,
  onRemoveImage,
}) => {
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 52,
    maxHeight: 200,
  });
  const [showSearch, setShowSearch] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<WikipediaResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!value.trim()) return;
    
    if (showSearch) {
      handleWikipediaSearch();
    } else {
      onSendMessage();
    }
    adjustHeight(true);
  };

  const handleWikipediaSearch = async () => {
    if (!value.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=${encodeURIComponent(value)}&srlimit=3`
      );
      const data = await response.json();
      
      if (data.query && data.query.search) {
        setSearchResults(data.query.search);
        // Format the results and send as a message
        const formattedResults = data.query.search.map((result: any) => 
          `**${result.title}**: ${result.snippet.replace(/<[^>]*>/g, '')}`
        ).join('\n\n');
        
        onChange(`Wikipedia search results for "${value}":\n\n${formattedResults}`);
        onSendMessage();
      }
    } catch (error) {
      console.error('Wikipedia search error:', error);
      onChange(`Sorry, I couldn't search Wikipedia for "${value}". Please try again.`);
      onSendMessage();
    } finally {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleContainerClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  };

  if (isSearching) {
    return (
      <div className="w-full py-4">
        <div className="relative max-w-2xl w-full mx-auto">
          <WikipediaLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      <div className="relative max-w-2xl w-full mx-auto">
        {/* Uploaded Image Preview */}
        {uploadedImage && (
          <div className="mb-3 relative inline-block">
            <img 
              src={uploadedImage} 
              alt="Uploaded" 
              className="max-w-32 max-h-32 rounded-lg border border-gray-700"
            />
            <button 
              onClick={onRemoveImage}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}

        <div
          role="textbox"
          tabIndex={0}
          aria-label="Search input container"
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
              placeholder={showSearch ? "Search the web..." : "Ask nexora anything..."}
              className="w-full rounded-xl rounded-b-none px-4 py-3 bg-white/5 border-none text-white placeholder:text-white/70 resize-none focus-visible:ring-0 leading-[1.2]"
              ref={textareaRef}
              onFocus={handleFocus}
              onBlur={handleBlur}
              disabled={disabled}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              onChange={(e) => {
                onChange(e.target.value);
                adjustHeight();
              }}
            />
          </div>

          <div className="h-12 bg-white/5 rounded-b-xl">
            <div className="absolute left-3 bottom-3 flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label className="cursor-pointer rounded-lg p-2 bg-white/5">
                <Paperclip 
                  className="w-4 h-4 text-white/40 hover:text-white transition-colors" 
                  onClick={handleImageUploadClick}
                />
              </label>
              <button
                type="button"
                onClick={() => setShowSearch(!showSearch)}
                className={cn(
                  "rounded-full transition-all flex items-center gap-2 px-1.5 py-1 border h-8 cursor-pointer",
                  showSearch
                    ? "bg-sky-500/15 border-sky-400 text-sky-500"
                    : "bg-white/5 border-transparent text-white/40 hover:text-white"
                )}
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
                    <Globe
                      className={cn(
                        "w-4 h-4",
                        showSearch ? "text-sky-500" : "text-inherit"
                      )}
                    />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {showSearch && (
                    <motion.span
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm overflow-hidden whitespace-nowrap text-sky-500 shrink-0"
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
                onClick={handleSubmit}
                disabled={disabled || !value.trim()}
                className={cn(
                  "rounded-lg p-2 transition-colors",
                  value.trim() && !disabled
                    ? "bg-sky-500/15 text-sky-500"
                    : "bg-white/5 text-white/40 cursor-not-allowed"
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPromptInput;
