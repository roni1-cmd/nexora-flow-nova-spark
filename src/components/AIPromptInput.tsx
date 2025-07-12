
import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AIPromptInputProps {
  onSendMessage: (message: string, useWikipedia?: boolean) => void;
  disabled?: boolean;
}

export const AIPromptInput: React.FC<AIPromptInputProps> = ({ onSendMessage, disabled = false }) => {
  const [input, setInput] = useState('');
  const [useWikipedia, setUseWikipedia] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 200; // max height in pixels
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim(), useWikipedia);
      setInput('');
      setUseWikipedia(false);
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleContainerClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        className={cn(
          "relative flex flex-col rounded-xl transition-all duration-200 w-full text-left cursor-text bg-white",
          "ring-1 ring-gray-200",
          isFocused && "ring-2 ring-blue-500",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={!disabled ? handleContainerClick : undefined}
      >
        <div className="overflow-y-auto max-h-[200px]">
          <Textarea
            ref={textareaRef}
            value={input}
            placeholder="Search the web..."
            className="w-full rounded-xl rounded-b-none px-4 py-3 bg-gray-50 border-none text-gray-900 placeholder:text-gray-500 resize-none focus-visible:ring-0 leading-[1.2] min-h-[52px]"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyPress}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            disabled={disabled}
          />
        </div>

        <div className="h-12 bg-gray-50 rounded-b-xl border-t border-gray-100">
          <div className="absolute left-3 bottom-3 flex items-center gap-2">
            <label className={cn(
              "cursor-pointer rounded-lg p-2 bg-gray-100 hover:bg-gray-200 transition-colors",
              disabled && "cursor-not-allowed"
            )}>
              <input type="file" className="hidden" disabled={disabled} />
              <Paperclip className="w-4 h-4 text-gray-500" />
            </label>
            
            <button
              type="button"
              onClick={() => !disabled && setUseWikipedia(!useWikipedia)}
              disabled={disabled}
              className={cn(
                "rounded-full transition-all flex items-center gap-2 px-2 py-1 border h-8 cursor-pointer",
                useWikipedia
                  ? "bg-sky-500/15 border-sky-400 text-sky-500"
                  : "bg-gray-100 border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-200",
                disabled && "cursor-not-allowed opacity-50"
              )}
            >
              <div className="w-4 h-4 flex items-center justify-center shrink-0">
                <motion.div
                  animate={{
                    rotate: useWikipedia ? 180 : 0,
                    scale: useWikipedia ? 1.1 : 1,
                  }}
                  whileHover={!disabled ? {
                    rotate: useWikipedia ? 180 : 15,
                    scale: 1.1,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 10,
                    },
                  } : {}}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 25,
                  }}
                >
                  <Globe
                    className={cn(
                      "w-4 h-4",
                      useWikipedia ? "text-sky-500" : "text-inherit"
                    )}
                  />
                </motion.div>
              </div>
              <AnimatePresence>
                {useWikipedia && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{
                      width: "auto",
                      opacity: 1,
                    }}
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
            <Button
              onClick={handleSubmit}
              disabled={!input.trim() || disabled}
              size="sm"
              className={cn(
                "rounded-lg p-2 transition-colors h-8 w-8",
                input.trim() && !disabled
                  ? "bg-sky-500 hover:bg-sky-600 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
