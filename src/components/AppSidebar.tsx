
import React, { useState } from 'react';
import { MessageSquare, Plus, Search, X, Bot, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface AppSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen,
  onClose,
  onToggle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        onClick={onToggle}
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 sm:hidden text-white hover:bg-gray-800 p-2"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 sm:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-black",
          isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        )}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Close button for mobile */}
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="sm:hidden absolute top-2 right-2 text-white hover:bg-gray-800 p-1"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Header with nexora branding */}
          <div className="flex items-center mb-6 pt-2">
            <img 
              src="/lovable-uploads/ae2c56ce-3b9e-4596-bd03-b70dd5af1d5e.png" 
              alt="nexora" 
              className="w-8 h-8 mr-3"
            />
            <span className="text-xl font-semibold text-white">nexora</span>
          </div>

          {/* Navigation Menu */}
          <ul className="space-y-2 font-medium mb-6">
            <li>
              <button
                onClick={onNewConversation}
                className="flex items-center w-full p-2 text-white rounded-lg hover:bg-gray-800 group"
              >
                <Plus className="w-5 h-5 text-gray-400 transition duration-75 group-hover:text-white" />
                <span className="ml-3">New Chat</span>
              </button>
            </li>
            <li>
              <div className="flex items-center p-2 text-white rounded-lg">
                <MessageSquare className="w-5 h-5 text-gray-400" />
                <span className="ml-3">Conversations</span>
              </div>
            </li>
          </ul>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600"
            />
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1">
            <div className="space-y-1">
              {filteredConversations.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No conversations yet</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "group relative p-3 rounded-lg cursor-pointer transition-all duration-200",
                      currentConversationId === conversation.id
                        ? 'bg-gray-800'
                        : 'hover:bg-gray-800/50'
                    )}
                    onClick={() => {
                      onSelectConversation(conversation.id);
                      if (window.innerWidth < 640) onClose();
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-2">
                        <h3 className="font-medium text-sm text-white truncate mb-1">
                          {conversation.title}
                        </h3>
                        <p className="text-xs text-gray-400 truncate mb-2">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{formatDate(conversation.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Active indicator */}
                    {currentConversationId === conversation.id && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-purple-500 rounded-r-full" />
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* CTA Section */}
          <div className="mt-6 p-4 rounded-lg bg-purple-900/20 border border-purple-500/30">
            <div className="flex items-center mb-3">
              <span className="bg-purple-500 text-white text-xs font-semibold px-2 py-1 rounded">
                Pro
              </span>
            </div>
            <p className="mb-3 text-sm text-purple-200">
              Unlock advanced features with nexora Pro. Get unlimited conversations and priority support.
            </p>
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm"
              onClick={() => window.open('https://coreastarstroupe.netlify.app/pricing', '_blank')}
            >
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
