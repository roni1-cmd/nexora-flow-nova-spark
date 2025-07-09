
import React, { useState } from 'react';
import { MessageSquare, Plus, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface ConversationManagerProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
}

export const ConversationManager: React.FC<ConversationManagerProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <MessageSquare className="w-4 h-4 mr-2" />
          Conversations
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Conversations
            <Button onClick={onNewConversation} size="sm" className="h-7 px-2">
              <Plus className="w-3 h-3 mr-1" />
              New
            </Button>
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-80">
          <div className="space-y-2">
            {conversations.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No conversations yet
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group p-3 rounded-lg border cursor-pointer transition-colors ${
                    currentConversationId === conversation.id
                      ? 'bg-primary/10 border-primary/20'
                      : 'hover:bg-muted/50 border-border'
                  }`}
                  onClick={() => {
                    onSelectConversation(conversation.id);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{conversation.title}</h3>
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(conversation.timestamp)}
                        <span>• {conversation.messageCount} messages</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
