
import React, { useState } from 'react';
import { MessageSquare, Plus, Trash2, Calendar, X, Search, ArrowLeft, User } from 'lucide-react';
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

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onShowProfile: () => void;
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onShowProfile,
  isOpen,
  onClose,
  user,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

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
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-black z-50 transform transition-all duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-12' : 'w-60'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center space-x-1">
              <Button
                onClick={() => setIsCollapsed(!isCollapsed)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white h-6 w-6 p-0"
              >
                <ArrowLeft className={`w-3 h-3 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
              </Button>

              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="lg:hidden text-gray-400 hover:text-white h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* New Chat Button */}
          {!isCollapsed && (
            <div className="px-3 pb-3">
              <button
                onClick={onNewConversation}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors text-white bg-gray-800 hover:bg-gray-700 text-sm"
              >
                <Plus className="w-4 h-4 flex-shrink-0" />
                <span>New chat</span>
              </button>
            </div>
          )}

          {/* Search */}
          {!isCollapsed && (
            <div className="px-3 pb-3">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                <Input
                  placeholder="Search chats"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-7 bg-gray-900 border-none text-white placeholder-gray-400 h-8 text-xs"
                />
              </div>
            </div>
          )}

          {/* Conversations Section */}
          {!isCollapsed && (
            <div className="px-3 pb-2">
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">Chats</h3>
            </div>
          )}

          {/* Conversations List */}
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-1">
              {filteredConversations.length === 0 ? (
                !isCollapsed && (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p className="text-xs">No conversations yet</p>
                  </div>
                )
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`group relative p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      currentConversationId === conversation.id
                        ? 'bg-gray-800'
                        : 'hover:bg-gray-800/50'
                    }`}
                    onClick={() => {
                      onSelectConversation(conversation.id);
                      if (window.innerWidth < 1024) onClose();
                    }}
                  >
                    {isCollapsed ? (
                      <div className="flex justify-center">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 pr-2">
                            <h3 className="font-medium text-xs text-white truncate mb-1">
                              {conversation.title}
                            </h3>
                            <p className="text-xs text-gray-400 truncate">
                              {conversation.lastMessage}
                            </p>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteConversation(conversation.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 h-5 w-5 p-0 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-opacity"
                          >
                            <Trash2 className="w-2 h-2" />
                          </Button>
                        </div>
                        
                        {/* Active indicator */}
                        {currentConversationId === conversation.id && (
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-blue-500 rounded-r-full" />
                        )}
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* User Profile at bottom */}
          <div className="p-3 mt-auto">
            <button
              onClick={onShowProfile}
              className={cn(
                "w-full flex items-center space-x-2 px-2 py-2 rounded-lg text-left transition-colors text-gray-300 hover:bg-gray-800",
                isCollapsed && "justify-center px-2"
              )}
            >
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">{user?.displayName || 'User'}</p>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
