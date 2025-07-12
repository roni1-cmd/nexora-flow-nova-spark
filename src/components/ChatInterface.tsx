import React, { useState, useEffect, useRef } from 'react';
import { Send, Menu, Bot, User as UserIcon, Copy, ThumbsUp, ThumbsDown, RotateCcw, MessageSquare, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConversationSidebar } from './ConversationSidebar';
import { AIPromptInput } from './AIPromptInput';
import AITextLoading from './AITextLoading';
import ConfirmDialog from './ConfirmDialog';
import { MessageActions } from './MessageActions';
import WikipediaLoader from './WikipediaLoader';
import CustomLoader from './CustomLoader';
import { EssayModal } from './EssayModal';
import { ReasoningView } from './ReasoningView';
import { UserProfile } from './UserProfile';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  reasoning?: string;
  essay?: string;
  isLoading?: boolean;
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
  photoURL: string; // Make required to match UserProfile expectations
  company: string;
  founded: string;
  founder: string;
  location: string;
}

const STORAGE_KEY = 'nexora_conversations';
const CURRENT_CONVERSATION_KEY = 'nexora_current_conversation';

export const ChatInterface: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [showReasoningView, setShowReasoningView] = useState(false);
  const [showEssayModal, setShowEssayModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentReasoning, setCurrentReasoning] = useState('');
  const [currentEssay, setCurrentEssay] = useState('');
  const [deleteConversationId, setDeleteConversationId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const models = [
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    { id: 'claude-3', name: 'Claude 3' },
  ];

  // Load conversations and current conversation from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem(STORAGE_KEY);
    const savedCurrentId = localStorage.getItem(CURRENT_CONVERSATION_KEY);
    
    if (savedConversations) {
      const parsedConversations = JSON.parse(savedConversations).map((conv: any) => ({
        ...conv,
        timestamp: new Date(conv.timestamp),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
      setConversations(parsedConversations);
    }
    
    if (savedCurrentId && savedConversations) {
      const parsedConversations = JSON.parse(savedConversations);
      if (parsedConversations.some((conv: any) => conv.id === savedCurrentId)) {
        setCurrentConversationId(savedCurrentId);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

  // Save current conversation ID whenever it changes
  useEffect(() => {
    if (currentConversationId) {
      localStorage.setItem(CURRENT_CONVERSATION_KEY, currentConversationId);
    }
  }, [currentConversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, currentConversationId]);

  const generateConversationTitle = (firstMessage: string): string => {
    const words = firstMessage.split(' ').slice(0, 6);
    return words.join(' ') + (firstMessage.split(' ').length > 6 ? '...' : '');
  };

  const getCurrentConversation = (): Conversation | undefined => {
    return conversations.find(conv => conv.id === currentConversationId);
  };

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!content.trim() && !attachments?.length) return;

    let conversationId = currentConversationId;
    
    // Create new conversation if none exists
    if (!conversationId) {
      conversationId = Date.now().toString();
      const newConversation: Conversation = {
        id: conversationId,
        title: generateConversationTitle(content),
        lastMessage: content,
        timestamp: new Date(),
        messageCount: 0,
        messages: []
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversationId(conversationId);
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { 
              ...conv, 
              messages: [...conv.messages, userMessage],
              lastMessage: content,
              timestamp: new Date(),
              messageCount: conv.messageCount + 1
            }
          : conv
      )
    );

    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I'm Nexora, an AI assistant created by Ron Asnahon from Corea Starstroupe in 2023. I'm here to help you with your questions and tasks. How can I assist you today?`,
        sender: 'ai',
        timestamp: new Date(),
        reasoning: 'This is sample reasoning for the AI response.',
        essay: 'This is a sample essay content that can be expanded and edited.'
      };

      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { 
                ...conv, 
                messages: [...conv.messages, aiMessage],
                lastMessage: aiMessage.content,
                timestamp: new Date(),
                messageCount: conv.messageCount + 1
              }
            : conv
        )
      );

      setIsLoading(false);
    }, 2000);
  };

  const handleNewConversation = () => {
    setCurrentConversationId(null);
    localStorage.removeItem(CURRENT_CONVERSATION_KEY);
    setSidebarOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
    setSidebarOpen(false);
  };

  const handleDeleteConversation = (id: string) => {
    setDeleteConversationId(id);
  };

  const confirmDelete = () => {
    if (deleteConversationId) {
      setConversations(prev => prev.filter(conv => conv.id !== deleteConversationId));
      
      if (currentConversationId === deleteConversationId) {
        setCurrentConversationId(null);
        localStorage.removeItem(CURRENT_CONVERSATION_KEY);
      }
      
      setDeleteConversationId(null);
    }
  };

  const handleShowReasoning = (reasoning: string) => {
    setCurrentReasoning(reasoning);
    setShowReasoningView(true);
  };

  const handleViewEssay = (essay: string) => {
    setCurrentEssay(essay);
    setShowEssayModal(true);
  };

  const currentConversation = getCurrentConversation();
  const messages = currentConversation?.messages || [];

  const user: User = {
    displayName: 'Ron Asnahon',
    email: 'ron@coreastarstroupe.com',
    photoURL: '', // Provide empty string as fallback
    company: 'Corea Starstroupe',
    founded: '2023',
    founder: 'Ron Asnahon',
    location: 'Philippines'
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        onShowProfile={() => setShowProfile(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        models={models}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-900">Nexora</h1>
                <p className="text-xs text-gray-500">AI Assistant</p>
              </div>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome to Nexora</h2>
                <p className="text-gray-600 mb-6">I'm your AI assistant, created by Ron Asnahon from Corea Starstroupe. How can I help you today?</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`flex gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.sender === 'ai' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-3xl ${message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'} rounded-2xl px-4 py-3`}>
                    <div className="prose prose-sm max-w-none">
                      {message.isLoading ? (
                        <AITextLoading />
                      ) : (
                        <p className={message.sender === 'user' ? 'text-white' : 'text-gray-900'}>{message.content}</p>
                      )}
                    </div>
                    
                    {message.sender === 'ai' && !message.isLoading && (
                      <MessageActions
                        content={message.content}
                        messageId={message.id}
                      />
                    )}
                  </div>

                  {message.sender === 'user' && (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="max-w-3xl bg-white border border-gray-200 rounded-2xl px-4 py-3">
                  <AITextLoading />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <AIPromptInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          placeholder="Message Nexora..."
        />
      </div>

      {/* Modals */}
      <ConfirmDialog
        isOpen={!!deleteConversationId}
        onClose={() => setDeleteConversationId(null)}
        onConfirm={confirmDelete}
        title="Delete Conversation"
        description="Are you sure you want to delete this conversation? This action cannot be undone."
      />

      {showEssayModal && (
        <EssayModal
          isOpen={showEssayModal}
          onClose={() => setShowEssayModal(false)}
          content={currentEssay}
          onContentChange={() => {}}
        />
      )}

      {showReasoningView && (
        <ReasoningView
          reasoning={currentReasoning}
          isVisible={showReasoningView}
        />
      )}

      {showProfile && (
        <UserProfile user={user} />
      )}
    </div>
  );
};
