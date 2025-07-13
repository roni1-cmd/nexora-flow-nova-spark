
import React, { useState } from 'react';
import { MessageSquare, Plus, Search, X, Bot, Menu, ChevronLeft, ChevronRight, Zap, Crown, Sparkles } from 'lucide-react';
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
  onCollapsedChange?: (collapsed: boolean) => void;
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
  onCollapsedChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

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

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';

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
          "fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-black",
          sidebarWidth,
          isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        )}
      >
        <div className="h-full px-3 py-4 overflow-y-auto flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            {!isCollapsed && (
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/ae2c56ce-3b9e-4596-bd03-b70dd5af1d5e.png" 
                  alt="nexora" 
                  className="w-8 h-8 mr-3"
                />
                <span className="text-xl font-semibold text-white">nexora</span>
              </div>
            )}
            
            {/* Collapse Toggle */}
            <Button
              onClick={handleCollapse}
              variant="ghost"
              size="sm"
              className="hidden sm:flex text-white hover:bg-gray-800 p-2"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>

            {/* Mobile Close */}
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="sm:hidden text-white hover:bg-gray-800 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* New Chat Button */}
          <div className="mb-4">
            <button
              onClick={onNewConversation}
              className={cn(
                "flex items-center w-full p-3 text-white rounded-lg hover:bg-gray-800 group transition-colors",
                isCollapsed ? "justify-center" : "justify-start"
              )}
            >
              <Plus className="w-5 h-5 text-gray-400 transition duration-75 group-hover:text-white flex-shrink-0" />
              {!isCollapsed && <span className="ml-3">New Chat</span>}
            </button>
          </div>

          {/* Search */}
          {!isCollapsed && (
            <div className="relative mb-4">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600"
              />
            </div>
          )}

          {/* Conversations Header */}
          {!isCollapsed && (
            <div className="flex items-center p-2 text-white mb-2">
              <MessageSquare className="w-5 h-5 text-gray-400 mr-3" />
              <span>Conversations</span>
            </div>
          )}

          {/* Conversations List */}
          <ScrollArea className="flex-1 mb-6">
            <div className="space-y-1">
              {filteredConversations.length === 0 ? (
                !isCollapsed && (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No conversations yet</p>
                  </div>
                )
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={cn(
                      "group relative rounded-lg cursor-pointer transition-all duration-200",
                      currentConversationId === conversation.id
                        ? 'bg-gray-800'
                        : 'hover:bg-gray-800/50',
                      isCollapsed ? "p-2 flex justify-center" : "p-3"
                    )}
                    onClick={() => {
                      onSelectConversation(conversation.id);
                      if (window.innerWidth < 640) onClose();
                    }}
                  >
                    {isCollapsed ? (
                      <MessageSquare className="w-5 h-5 text-gray-400" />
                    ) : (
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
                    )}
                    
                    {/* Active indicator */}
                    {currentConversationId === conversation.id && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-purple-500 rounded-r-full" />
                    )}
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Enhanced CTA Section */}
          {!isCollapsed && (
            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-900/30 to-blue-900/20">
              <div className="flex items-center mb-3">
                <Crown className="w-4 h-4 text-purple-400 mr-2" />
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent text-sm font-bold">
                  WHAT'S NEW?
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-xs text-purple-200">
                  <Zap className="w-3 h-3 mr-2 text-purple-400" />
                  <span>Now with reasoning mode with Sarvam-M.</span>
                </div>
                <div className="flex items-center text-xs text-purple-200">
                  <Sparkles className="w-3 h-3 mr-2 text-purple-400" />
                  <span>Multiple AI models available for different tasks.</span>
                </div>
                <div className="flex items-center text-xs text-purple-200">
                  <Bot className="w-3 h-3 mr-2 text-purple-400" />
                  <span>Enhanced chat experience with fade-in responses.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
