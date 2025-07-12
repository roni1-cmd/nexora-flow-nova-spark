import React, { useState, useEffect, useRef } from 'react';
import { ConversationSidebar } from './ConversationSidebar';
import { AIPromptInput } from './AIPromptInput';
import { MessageActions } from './MessageActions';
import { UserProfile } from './UserProfile';
import { EssayModal } from './EssayModal';
import { ReasoningView } from './ReasoningView';
import ConfirmDialog from './ConfirmDialog';
import { EssayCanvas } from './EssayCanvas';
import WikipediaLoader from './WikipediaLoader';
import CustomLoader from './CustomLoader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Menu, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isThinking?: boolean;
  hasReasoning?: boolean;
  reasoning?: string;
  isWikipediaSearch?: boolean;
  isEssayGeneration?: boolean;
  isCodeGeneration?: boolean;
  codeContent?: string;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  messages: Message[];
}

interface User {
  displayName: string;
  email: string;
  company: string;
  founded: string;
  founder: string;
  location: string;
  photoURL: string;
}

// Mock user data for Nexora AI
const mockUser: User = {
  displayName: 'User',
  email: 'm@example.com',
  company: 'Nexora AI',
  founded: '2023',
  founder: 'Ron Asnahon',
  location: 'Corea Starstroupe',
  photoURL: 'https://github.com/shadcn.png' // Added missing photoURL
};

const models = [
  { id: 'gpt-4', name: 'GPT-4' },
  { id: 'gpt-3.5', name: 'GPT-3.5 Turbo' },
  { id: 'claude-3', name: 'Claude 3' },
  { id: 'nexora-1', name: 'Nexora-1' }
];

export const ChatInterface: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEssayModal, setShowEssayModal] = useState(false);
  const [showReasoningView, setShowReasoningView] = useState(false);
  const [currentReasoning, setCurrentReasoning] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('nexora-1');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'wikipedia' | 'essay' | 'thinking' | null>(null);
  const [essayContent, setEssayContent] = useState('');
  const [codeContent, setCodeContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load conversations from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('nexora-conversations');
    const savedCurrentId = localStorage.getItem('nexora-current-conversation');
    
    if (savedConversations) {
      const parsed = JSON.parse(savedConversations);
      // Convert timestamp strings back to Date objects
      const conversationsWithDates = parsed.map((conv: any) => ({
        ...conv,
        timestamp: new Date(conv.timestamp),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
      setConversations(conversationsWithDates);
    }
    
    if (savedCurrentId) {
      setCurrentConversationId(savedCurrentId);
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('nexora-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Save current conversation ID whenever it changes
  useEffect(() => {
    if (currentConversationId) {
      localStorage.setItem('nexora-current-conversation', currentConversationId);
    }
  }, [currentConversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, currentConversationId]);

  const getCurrentConversation = () => {
    return conversations.find(conv => conv.id === currentConversationId);
  };

  const handleNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      lastMessage: '',
      timestamp: new Date(),
      messageCount: 0,
      messages: []
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setSidebarOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const handleDeleteConversation = (id: string) => {
    setConversationToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDeleteConversation = () => {
    if (conversationToDelete) {
      setConversations(prev => prev.filter(conv => conv.id !== conversationToDelete));
      
      if (currentConversationId === conversationToDelete) {
        const remaining = conversations.filter(conv => conv.id !== conversationToDelete);
        setCurrentConversationId(remaining.length > 0 ? remaining[0].id : null);
      }
      
      setConversationToDelete(null);
      setShowConfirmDialog(false);
    }
  };

  const handleSendMessage = async (content: string, useWikipedia: boolean = false) => {
    if (!content.trim()) return;

    let conversation = getCurrentConversation();
    
    if (!conversation) {
      handleNewConversation();
      conversation = conversations[0];
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: content.trim(),
      isUser: true,
      timestamp: new Date()
    };

    // Add user message
    setConversations(prev => prev.map(conv => 
      conv.id === currentConversationId 
        ? {
            ...conv,
            messages: [...conv.messages, userMessage],
            lastMessage: content.trim(),
            messageCount: conv.messageCount + 1,
            timestamp: new Date(),
            title: conv.title === 'New Chat' ? content.trim().substring(0, 50) + '...' : conv.title
          }
        : conv
    ));

    // Simulate AI response with different types
    setIsLoading(true);
    
    if (useWikipedia) {
      setLoadingType('wikipedia');
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `I found information about "${content}" from Wikipedia. Here's what I discovered: This topic involves multiple aspects that are interconnected and provide valuable insights into the subject matter.`,
          isUser: false,
          timestamp: new Date(),
          isWikipediaSearch: true
        };
        
        setConversations(prev => prev.map(conv => 
          conv.id === currentConversationId 
            ? {
                ...conv,
                messages: [...conv.messages, aiMessage],
                lastMessage: aiMessage.content,
                messageCount: conv.messageCount + 1
              }
            : conv
        ));
        setIsLoading(false);
        setLoadingType(null);
      }, 2000);
    } else if (content.toLowerCase().includes('essay') || content.toLowerCase().includes('write')) {
      setLoadingType('essay');
      setTimeout(() => {
        const essayText = `# Essay on ${content}

This is a comprehensive essay that explores the various aspects of your topic. The essay is structured to provide in-depth analysis and insights.

## Introduction
The topic you've requested provides an excellent opportunity to explore multiple dimensions and perspectives.

## Main Content
Here we delve into the core aspects of the subject matter, providing detailed analysis and supporting evidence.

## Conclusion
In conclusion, this essay has examined the key elements and provided valuable insights into the topic.`;
        
        setEssayContent(essayText);
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'I\'ve generated a comprehensive essay for you. You can view it in the essay modal.',
          isUser: false,
          timestamp: new Date(),
          isEssayGeneration: true
        };
        
        setConversations(prev => prev.map(conv => 
          conv.id === currentConversationId 
            ? {
                ...conv,
                messages: [...conv.messages, aiMessage],
                lastMessage: aiMessage.content,
                messageCount: conv.messageCount + 1
              }
            : conv
        ));
        setIsLoading(false);
        setLoadingType(null);
        setShowEssayModal(true);
      }, 3000);
    } else {
      setLoadingType('thinking');
      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `Hello! I'm Nexora AI, created by Ron Asnahon from Corea Starstroupe in 2023. I understand you're asking about "${content}". I'm here to help you with detailed and thoughtful responses. How can I assist you further with this topic?`,
          isUser: false,
          timestamp: new Date(),
          hasReasoning: true,
          reasoning: 'I analyzed your question and considered the best way to provide a helpful response while introducing myself as Nexora AI.'
        };
        
        setConversations(prev => prev.map(conv => 
          conv.id === currentConversationId 
            ? {
                ...conv,
                messages: [...conv.messages, aiMessage],
                lastMessage: aiMessage.content,
                messageCount: conv.messageCount + 1
              }
            : conv
        ));
        setIsLoading(false);
        setLoadingType(null);
      }, 1500);
    }
  };

  const currentConversation = getCurrentConversation();
  const messages = currentConversation?.messages || [];

  return (
    <div className="flex h-screen bg-white">
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        onShowProfile={() => setShowProfile(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={mockUser}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        models={models}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white text-xs font-bold">N</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Nexora</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNewConversation}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </Button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !isLoading && (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">Welcome to Nexora AI</h2>
                <p>Start a conversation by typing your message below.</p>
                <p className="text-sm mt-2">Created by Ron Asnahon from Corea Starstroupe (2023)</p>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl rounded-lg px-4 py-2 group ${
                message.isUser 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
                {!message.isUser && (
                  <MessageActions
                    content={message.content}
                    messageId={message.id}
                    onRegenerate={() => {
                      // Handle regenerate
                    }}
                  />
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-3xl bg-gray-100 rounded-lg px-4 py-2">
                {loadingType === 'wikipedia' && <WikipediaLoader />}
                {loadingType === 'essay' && (
                  <div className="flex items-center space-x-2">
                    <CustomLoader />
                    <span className="text-gray-600">We're generating your essay, please wait...</span>
                  </div>
                )}
                {loadingType === 'thinking' && <CustomLoader />}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <AIPromptInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </div>

      {/* Modals */}
      <UserProfile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={mockUser}
      />

      <EssayModal
        isOpen={showEssayModal}
        onClose={() => setShowEssayModal(false)}
        content={essayContent}
        onContentChange={setEssayContent}
      />

      <ReasoningView
        reasoning={currentReasoning}
        isVisible={showReasoningView}
      />

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmDeleteConversation}
        title="Delete Conversation"
        description="Are you sure you want to delete this conversation? This action cannot be undone."
      />
    </div>
  );
};
