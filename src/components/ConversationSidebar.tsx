
import React, { useState, useEffect } from 'react';
import { Search, MessageSquare, FileText, CheckSquare, FolderOpen, History, Plus, Trash2, X, ArrowLeft, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  selectedModel: string;
  onModelChange: (model: string) => void;
  models: Array<{ id: string; name: string }>;
}

const sidebarItems = [
  { title: 'Search', icon: Search, shortcut: 'Ctrl+K' },
  { title: 'Chat', icon: MessageSquare, active: true },
  { title: 'Files', icon: FileText },
  { title: 'Tasks', icon: CheckSquare },
  { title: 'Projects', icon: FolderOpen },
  { title: 'History', icon: History },
];

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
  selectedModel,
  onModelChange,
  models,
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
        fixed left-0 top-0 h-full bg-gray-900 z-50 transform transition-all duration-300 ease-in-out border-r border-gray-700
        lg:relative lg:translate-x-0 lg:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-12' : 'w-64'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header with Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-xs font-bold">N</span>
                </div>
                <span className="text-white font-semibold">Nexora</span>
              </div>
            )}
            
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

          {/* Navigation Items */}
          <div className="flex-1 px-2 py-4">
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.title}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-sm",
                    item.active 
                      ? "bg-gray-800 text-white" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50",
                    isCollapsed && "justify-center px-2"
                  )}
                  onClick={item.title === 'Chat' ? onNewConversation : undefined}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex-1 flex items-center justify-between">
                      <span>{item.title}</span>
                      {item.shortcut && (
                        <span className="text-xs text-gray-500">{item.shortcut}</span>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* History Section */}
            {!isCollapsed && (
              <div className="mt-6">
                <div className="px-3 py-2">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Yesterday</h3>
                </div>
                <ScrollArea className="max-h-96">
                  <div className="space-y-1">
                    {filteredConversations.length === 0 ? (
                      <div className="px-3 py-2 text-xs text-gray-500">
                        No conversations yet
                      </div>
                    ) : (
                      filteredConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className={`group relative px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 mx-1 ${
                            currentConversationId === conversation.id
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                          }`}
                          onClick={() => {
                            onSelectConversation(conversation.id);
                            if (window.innerWidth < 1024) onClose();
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0 pr-2">
                              <h4 className="text-sm truncate">
                                {conversation.title}
                              </h4>
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
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="p-3 border-t border-gray-700">
            <button
              onClick={onShowProfile}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-300 hover:bg-gray-800",
                isCollapsed && "justify-center px-2"
              )}
            >
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.displayName || 'User'}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email || 'm@example.com'}</p>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
