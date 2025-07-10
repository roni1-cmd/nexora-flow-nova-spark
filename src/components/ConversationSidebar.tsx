
import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Trash2, Calendar, X, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

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
  isOpen: boolean;
  onClose: () => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen,
  onClose,
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
        ${isCollapsed ? 'w-16' : 'w-80'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-white">Conversations</h2>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              {!isCollapsed && (
                <Button
                  onClick={onNewConversation}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 h-8 px-3"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New
                </Button>
              )}
              
              <Button
                onClick={() => setIsCollapsed(!isCollapsed)}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white h-8 w-8 p-0"
              >
                <Settings className="w-4 h-4" />
              </Button>

              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="lg:hidden text-gray-400 hover:text-white h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!isCollapsed && (
            <>
              {/* Search */}
              <div className="px-4 pb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </>
          )}

          {/* Conversations List */}
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-1">
              {filteredConversations.length === 0 ? (
                !isCollapsed && (
                  <div className="text-center text-gray-500 py-12">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-sm">No conversations yet</p>
                    <p className="text-xs text-gray-600 mt-1">Start a new conversation to begin</p>
                  </div>
                )
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      currentConversationId === conversation.id
                        ? 'bg-gray-800'
                        : 'hover:bg-gray-900'
                    }`}
                    onClick={() => {
                      onSelectConversation(conversation.id);
                      if (window.innerWidth < 1024) onClose();
                    }}
                  >
                    {isCollapsed ? (
                      <div className="flex justify-center">
                        <MessageSquare className="w-5 h-5 text-gray-400" />
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 pr-2">
                            <h3 className="font-medium text-sm text-white truncate mb-1">
                              {conversation.title}
                            </h3>
                            <p className="text-xs text-gray-400 truncate mb-2">
                              {conversation.lastMessage}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(conversation.timestamp)}
                              </div>
                              <span>•</span>
                              <span>{conversation.messageCount} messages</span>
                            </div>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteConversation(conversation.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        {/* Active indicator */}
                        {currentConversationId === conversation.id && (
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-purple-500 rounded-r-full" />
                        )}
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  );
};
