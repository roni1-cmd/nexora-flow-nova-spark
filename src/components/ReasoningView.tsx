
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface ReasoningViewProps {
  reasoning: string;
  isVisible: boolean;
}

export const ReasoningView: React.FC<ReasoningViewProps> = ({ reasoning, isVisible }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isVisible || !reasoning) return null;

  return (
    <div className="mb-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-xs bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/30"
          >
            <Brain className="w-3 h-3" />
            AI Reasoning
            {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          <div className="bg-muted/50 rounded-lg p-3 border border-muted-foreground/20">
            <div className="text-xs text-muted-foreground mb-2 font-medium">Thinking Process:</div>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
              {reasoning}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
