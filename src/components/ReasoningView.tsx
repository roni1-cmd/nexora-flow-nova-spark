
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ReasoningViewProps {
  reasoning: string;
  isVisible: boolean;
}

export const ReasoningView: React.FC<ReasoningViewProps> = ({ reasoning, isVisible }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isVisible || !reasoning) return null;

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors mb-2 font-google-sans"
      >
        <span>Thinking Process</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      {isOpen && (
        <div className="text-xs text-gray-400 whitespace-pre-wrap font-google-sans mb-4 p-3 rounded-lg border-l-2 border-purple-500/30">
          {reasoning}
        </div>
      )}
    </div>
  );
};
