
import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, Trash2, Calendar, X, Search, ArrowLeft, User, ChevronDown, Files, CheckSquare, FolderOpen, History, Bot } from 'lucide-react';
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

const navigationItems = [
  { id: 'chat', label: 'Chat', icon: MessageSquare, active: true },
  { id: 'files', label: 'Files', icon: Files, active: false },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, active: false },
  { id: 'projects', label: 'Projects', icon: FolderOpen, active: false },
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
  const [historyExpanded, setHistoryExpanded] = useState(true);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const groupConversationsByDate = () => {
    const groups: { [key: string]: Conversation[] } = {};
    
    conversations.forEach(conv => {
      const dateKey = formatDate(conv.timestamp);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(conv);
    });
    
    return groups;
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const conversationGroups = groupConversationsByDate();

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
        fixed left-0 top-0 h-full bg-gray-900 z-50 transform transition-all duration-300 ease-in-out border-r border-gray-800
        lg:relative lg:translate-x-0 lg:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isCollapsed ? 'w-12' : 'w-64'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo and Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-800">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-semibold text-sm">Nexora</span>
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

          {/* Search */}
          {!isCollapsed && (
            <div className="px-3 py-3 border-b border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search Ctrl+K"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-gray-800 border-gray-700 text-white placeholder-gray-400 h-9 text-sm focus:border-gray-600"
                />
              </div>
            </div>
          )}

          {/* Navigation Items */}
          {!isCollapsed && (
            <div className="px-2 py-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-sm",
                    item.active 
                      ? "bg-gray-800 text-white" 
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* New Chat Button */}
          <div className="px-3 pb-3">
            <button
              onClick={onNewConversation}
              className={cn(
                "w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors",
                "text-white bg-blue-600 hover:bg-blue-700 text-sm font-medium",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span>New Chat</span>}
            </button>
          </div>

          {/* History Section */}
          {!isCollapsed && (
            <div className="px-3 pb-2">
              <button
                onClick={() => setHistoryExpanded(!historyExpanded)}
                className="w-full flex items-center justify-between text-gray-400 hover:text-white text-sm py-1"
              >
                <div className="flex items-center space-x-2">
                  <History className="w-4 h-4" />
                  <span>History</span>
                </div>
                <ChevronDown className={`w-3 h-3 transition-transform ${historyExpanded ? '' : '-rotate-90'}`} />
              </button>
            </div>
          )}

          {/* Conversations List */}
          {!isCollapsed && historyExpanded && (
            <ScrollArea className="flex-1 px-2">
              <div className="space-y-1">
                {Object.keys(conversationGroups).length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    <p className="text-xs">No conversations yet</p>
                  </div>
                ) : (
                  Object.entries(conversationGroups).map(([dateGroup, conversations]) => (
                    <div key={dateGroup} className="mb-4">
                      <div className="px-3 py-1 text-xs text-gray-500 font-medium">
                        {dateGroup}
                      </div>
                      {conversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className={`group relative p-2 rounded-lg cursor-pointer transition-all duration-200 mx-1 ${
                            currentConversationId === conversation.id
                              ? 'bg-gray-800 text-white'
                              : 'hover:bg-gray-800/50 text-gray-300'
                          }`}
                          onClick={() => {
                            onSelectConversation(conversation.id);
                            if (window.innerWidth < 1024) onClose();
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0 pr-2">
                              <h3 className="font-medium text-xs truncate mb-1">
                                {conversation.title}
                              </h3>
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
                      ))}
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          )}

          {/* User Profile */}
          <div className="p-3 border-t border-gray-800 mt-auto">
            <button
              onClick={onShowProfile}
              className={cn(
                "w-full flex items-center space-x-3 px-2 py-2 rounded-lg text-left transition-colors text-gray-300 hover:bg-gray-800",
                isCollapsed && "justify-center px-2"
              )}
            >
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white truncate">Ron Asnahon</p>
                  <p className="text-xs text-gray-400 truncate">Founder, Corea Starstroupe</p>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
