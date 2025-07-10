
import React from 'react';
import { MessageSquare, Plus, Trash2, Calendar, X, Archive, Download, Search } from 'lucide-react';
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
  onArchiveConversation?: (id: string) => void;
  onExportConversation?: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onArchiveConversation,
  onExportConversation,
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
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
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
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
        fixed left-0 top-0 h-full w-80 bg-black border-r border-gray-800 z-50 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white font-google-sans">Conversations</h2>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={onNewConversation}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 h-8 px-3 font-google-sans"
              >
                <Plus className="w-4 h-4 mr-1" />
                New
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

          {/* Search */}
          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 font-google-sans"
              />
            </div>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm font-google-sans">
                    {searchQuery ? 'No conversations found' : 'No conversations yet'}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 font-google-sans">
                    {searchQuery ? 'Try a different search term' : 'Start a new conversation to begin'}
                  </p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      currentConversationId === conversation.id
                        ? 'bg-purple-600/20 border border-purple-500/30'
                        : 'hover:bg-gray-900/50 border border-transparent'
                    }`}
                    onClick={() => {
                      onSelectConversation(conversation.id);
                      if (window.innerWidth < 1024) onClose();
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 pr-2">
                        <h3 className="font-medium text-sm text-white truncate mb-1 font-google-sans">
                          {conversation.title}
                        </h3>
                        <p className="text-xs text-gray-400 truncate mb-2 font-google-sans">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500 font-google-sans">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(conversation.timestamp)}
                          </div>
                          <span>•</span>
                          <span>{conversation.messageCount} messages</span>
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {onExportConversation && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              onExportConversation(conversation.id);
                            }}
                            className="h-6 w-6 p-0 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        )}
                        {onArchiveConversation && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              onArchiveConversation(conversation.id);
                            }}
                            className="h-6 w-6 p-0 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300"
                          >
                            <Archive className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conversation.id);
                          }}
                          className="h-6 w-6 p-0 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
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

          {/* Footer with stats */}
          <div className="p-4 border-t border-gray-800">
            <div className="text-xs text-gray-500 text-center font-google-sans">
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''} saved
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
