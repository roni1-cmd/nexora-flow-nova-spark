
import React from 'react';
import { Copy, RotateCcw, Trash2, Edit3, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MessageActionsProps {
  content: string;
  messageId: string;
  onRegenerate?: () => void;
  onDelete?: () => void;
  onEdit?: (newContent: string) => void;
  isEditing?: boolean;
  onCancelEdit?: () => void;
  isUser?: boolean;
}

export const MessageActions: React.FC<MessageActionsProps> = ({
  content,
  messageId,
  onRegenerate,
  onDelete,
  onEdit,
  isEditing,
  onCancelEdit,
  isUser = false,
}) => {
  const { toast } = useToast();
  const [editContent, setEditContent] = React.useState(content);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied",
        description: "Message copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy message",
        variant: "destructive",
      });
    }
  };

  const handleSaveEdit = () => {
    if (onEdit && editContent.trim()) {
      onEdit(editContent);
    }
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 mt-2 w-full">
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full p-3 text-sm border rounded-lg bg-gray-900 border-gray-700 text-white"
          rows={3}
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSaveEdit} className="h-7 px-3 text-xs bg-purple-600 hover:bg-purple-700">
            <Check className="w-3 h-3 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={onCancelEdit} className="h-7 px-3 text-xs border-gray-700">
            <X className="w-3 h-3 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity ${isUser ? 'justify-end' : 'justify-start'}`}>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleCopy}
        className="h-7 px-2 text-xs hover:bg-gray-800 text-gray-400 hover:text-white"
      >
        <Copy className="w-3 h-3" />
      </Button>
      {onRegenerate && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onRegenerate}
          className="h-7 px-2 text-xs hover:bg-gray-800 text-gray-400 hover:text-white"
        >
          <RotateCcw className="w-3 h-3" />
        </Button>
      )}
      {onEdit && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onEdit(content)}
          className="h-7 px-2 text-xs hover:bg-gray-800 text-gray-400 hover:text-white"
        >
          <Edit3 className="w-3 h-3" />
        </Button>
      )}
      {onDelete && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className="h-7 px-2 text-xs hover:bg-red-900 text-red-400 hover:text-red-300"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
};
