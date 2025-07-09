
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  isCode?: boolean;
  isEssay?: boolean;
  timestamp: number;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

interface ConversationHistoryProps {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (id: string) => void;
  onBack: () => void;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  conversations,
  currentConversation,
  onSelectConversation,
  onDeleteConversation,
  onBack,
}) => {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
        <h3 className="text-xl font-medium mb-2">No conversations yet</h3>
        <p className="text-center text-gray-500">
          Start a new conversation to see your chat history here
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={`p-4 rounded-lg border transition-all cursor-pointer hover:bg-gray-800/50 ${
            currentConversation?.id === conversation.id
              ? 'bg-gray-800 border-purple-500/50'
              : 'bg-gray-900 border-gray-700 hover:border-gray-600'
          }`}
          onClick={() => {
            onSelectConversation(conversation);
            onBack();
          }}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white truncate mb-1">
                {conversation.title}
              </h3>
              <p className="text-sm text-gray-400 mb-2">
                {conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
              </p>
              {conversation.messages.length > 0 && (
                <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                  {conversation.messages[0].content}
                </p>
              )}
            </div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConversation(conversation.id);
              }}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 ml-2"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
