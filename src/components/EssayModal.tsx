
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EssayToolbar } from './EssayToolbar';
import { motion, AnimatePresence } from 'framer-motion';

interface EssayModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onContentChange: (content: string) => void;
  title?: string;
}

export const EssayModal = ({ 
  isOpen, 
  onClose, 
  content, 
  onContentChange, 
  title = "Essay Editor" 
}: EssayModalProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  React.useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleSave = () => {
    onContentChange(editedContent);
    setIsEditMode(false);
  };

  const handleExport = () => {
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Essay',
        text: editedContent,
      });
    } else {
      navigator.clipboard.writeText(editedContent);
      // You could add a toast notification here
    }
  };

  const handleAppearanceChange = () => {
    // Placeholder for appearance changes
    console.log('Appearance change clicked');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <EssayToolbar
                onExport={handleExport}
                onShare={handleShare}
                onAppearanceChange={handleAppearanceChange}
                isEditMode={isEditMode}
                onEditModeToggle={() => setIsEditMode(!isEditMode)}
                className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              {isEditMode ? (
                <div className="h-full flex flex-col">
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="flex-1 w-full p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-none focus:ring-0 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                    placeholder="Write your essay here..."
                  />
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 justify-end">
                    <Button
                      onClick={() => {
                        setEditedContent(content);
                        setIsEditMode(false);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-full overflow-y-auto p-6">
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <div className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap leading-relaxed">
                      {editedContent}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
