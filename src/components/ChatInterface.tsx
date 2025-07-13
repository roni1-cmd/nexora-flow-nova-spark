

import React, { useState, useRef, useEffect } from 'react';
import { Download, X, ChevronDown, LogOut, User, Zap, Bot, ArrowLeft, MessageSquare, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './UserProfile';
import { EssayCanvas } from './EssayCanvas';
import { EssayModal } from './EssayModal';
import { ReasoningView } from './ReasoningView';
import { MessageActions } from './MessageActions';
import { AppSidebar } from './AppSidebar';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { useLocalConversations, type Message } from '@/hooks/useLocalConversations';
import AIPromptInput from './AIPromptInput';
import AITextLoading from './AITextLoading';
import CustomLoader from './CustomLoader';
import ConfirmDialog from './ConfirmDialog';
import AnimatedLoader from './AnimatedLoader';
import DynamicText from './DynamicText';
import { FadeInText } from './FadeInText';
import { motion } from 'framer-motion';

interface User {
  displayName: string;
  email: string;
  photoURL: string;
}

const MODELS = [
  { id: 'mistralai/mistral-small-3.2-24b-instruct:free', name: 'Mistral Small (Default)' },
  { id: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free', name: 'Dolphin Mistral 24B' },
  { id: 'deepseek/deepseek-r1-0528-qwen3-8b:free', name: 'DeepSeek R1 Qwen3' },
  { id: 'mistralai/devstral-small-2505:free', name: 'Devstral Small' },
  { id: 'sarvamai/sarvam-m:free', name: 'Sarvam-M (Reasoning)' },
];

const TypingAnimation = () => (
  <div className="flex items-center space-x-3 p-3">
    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
      <Bot className="w-4 h-4 text-white" />
    </div>
    <span className="text-gray-400 text-sm">Thinking...</span>
  </div>
);

const formatMarkdown = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/##\s+(.*?)(?=\n|$)/g, '<h2 class="text-lg font-semibold mt-4 mb-2 text-white">$1</h2>')
    .replace(/\n/g, '<br/>');
};

const ImageModal = ({ imageUrl, onClose }: { imageUrl: string; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
    <div className="relative max-w-4xl max-h-4xl p-4">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-white hover:text-gray-300"
      >
        <X className="w-6 h-6" />
      </button>
      <img src={imageUrl} alt="Full size" className="max-w-full max-h-full object-contain" />
    </div>
  </div>
);

// Name Input Screen Component
const NameInputScreen = ({ onNameSubmit }: { onNameSubmit: (name: string) => void }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNameSubmit(name.trim());
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-google-sans">
      {/* Left side - show on desktop only */}
      <div className="hidden lg:flex flex-1 items-center justify-center px-4 sm:px-8" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
      }}>
        <div className="max-w-md p-4 sm:p-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4 sm:mb-6 text-white">
            Transform<br />
            Your Business<br />
            with AI
          </h1>
          <p className="text-lg sm:text-xl text-white/90 leading-relaxed">
            Build magical AI experiences with open models on the fastest and most reliable AI platform.
          </p>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <img 
                src="/lovable-uploads/ae2c56ce-3b9e-4596-bd03-b70dd5af1d5e.png" 
                alt="nexora" 
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
              <span className="text-lg sm:text-xl font-semibold text-white">nexora</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome</h2>
            <p className="text-gray-400 mb-6">Put your name here</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Put your name here"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-700 rounded-lg bg-black text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              autoFocus
            />
            <Button 
              type="submit"
              disabled={!name.trim()}
              className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </Button>
          </form>
          
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs text-gray-400 leading-relaxed">
              By continuing, you agree to our{' '}
              <a href="https://coreastarstroupe.netlify.app/terms-of-service" className="text-purple-400 hover:text-purple-300">terms of service</a>{' '}
              and{' '}
              <a href="https://coreastarstroupe.netlify.app/privacy-policy" className="text-purple-400 hover:text-purple-300">Data Processing Agreement</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatInterface = () => {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [essayModalOpen, setEssayModalOpen] = useState(false);
  const [currentEssayContent, setCurrentEssayContent] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [appLoading, setAppLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { trackApiCall, trackModelUsage, stats } = useUsageTracking();
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    messageId?: string;
    conversationId?: string;
    type: 'message' | 'conversation';
  }>({ isOpen: false, type: 'message' });

  const { conversations, createConversation, addMessage, deleteConversation } = useLocalConversations();

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('nexora_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('nexora_user');
      }
    }
    setAuthLoading(false);
  }, []);

  // Save user to localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('nexora_user', JSON.stringify(user));
    }
  }, [user]);

  const handleNameSubmit = (name: string) => {
    const newUser: User = {
      displayName: name,
      email: `${name.toLowerCase().replace(/\s+/g, '')}@nexora.local`,
      photoURL: '',
    };
    setUser(newUser);
  };

  const handleSignOut = () => {
    setAppLoading(true);
    setTimeout(() => {
      localStorage.removeItem('nexora_user');
      setUser(null);
      setMessages([]);
      setCurrentConversationId(null);
      setShowProfile(false);
      setAppLoading(false);
    }, 1000);
  };

  // Update document title based on conversation or user input
  useEffect(() => {
    if (input.trim()) {
      const shortPrompt = input.slice(0, 30) + (input.length > 30 ? '...' : '');
      document.title = `${shortPrompt} - nexora`;
    } else if (currentConversationId) {
      const currentConv = conversations.find(c => c.id === currentConversationId);
      if (currentConv) {
        document.title = `${currentConv.title} - nexora`;
      } else {
        document.title = 'nexora';
      }
    } else {
      document.title = 'nexora';
    }
  }, [input, currentConversationId, conversations]);

  // Handle paste events for image pasting
  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            handleImageUpload(file);
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  // Get first name only
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  // Load current conversation messages - Fixed to handle direct conversation updates
  useEffect(() => {
    console.log('Loading messages for conversation:', currentConversationId);
    console.log('Available conversations:', conversations);
    
    if (currentConversationId) {
      const conversation = conversations.find(c => c.id === currentConversationId);
      console.log('Found conversation:', conversation);
      
      if (conversation && conversation.messages) {
        console.log('Setting messages:', conversation.messages);
        setMessages(conversation.messages);
      } else {
        console.log('No messages found, setting empty array');
        setMessages([]);
      }
    } else {
      console.log('No current conversation, clearing messages');
      setMessages([]);
    }
  }, [currentConversationId, conversations]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generateConversationTitle = (firstMessage: string) => {
    // Generate a title from the first message (first 50 characters)
    const title = firstMessage.slice(0, 50);
    return title.length < firstMessage.length ? title + '...' : title;
  };

  const sendMessage = async () => {
    const contentToSend = input.trim();
    if (!contentToSend && !uploadedImage) return;
    if (!user) return;

    console.log('Sending message:', contentToSend);
    
    let conversationId = currentConversationId;
    
    // Create new conversation if none exists
    if (!conversationId) {
      const title = generateConversationTitle(contentToSend);
      const newConversation = createConversation(title);
      conversationId = newConversation.id;
      setCurrentConversationId(conversationId);
      console.log('Created new conversation:', conversationId);
    }

    // Add user message and immediately update local state
    const userMessage = addMessage(conversationId, {
      role: 'user',
      content: contentToSend,
      imageUrl: uploadedImage || undefined,
    });

    console.log('Added user message:', userMessage);

    // Update messages immediately for better UX
    const updatedConversation = conversations.find(c => c.id === conversationId);
    if (updatedConversation) {
      setMessages(updatedConversation.messages);
    }

    // Clear input immediately
    setInput('');
    setUploadedImage(null);
    setIsLoading(true);

    try {
      console.log('Making API call with model:', selectedModel);
      trackApiCall(selectedModel);

      const response = await supabase.functions.invoke('chat-completion', {
        body: {
          model: selectedModel,
          messages: [{ role: 'user', content: contentToSend }],
          max_tokens: 1000,
          temperature: 0.7,
        },
      });

      console.log('API response:', response);

      if (response.error) {
        throw new Error(response.error.message);
      }

      const data = response.data;
      const assistantContent = data.choices[0].message.content;
      const reasoning = selectedModel === 'sarvamai/sarvam-m:free' ? data.choices[0].message.reasoning : null;

      console.log('Assistant response:', assistantContent);

      // Add assistant message
      const assistantMessage = addMessage(conversationId, {
        role: 'assistant',
        content: assistantContent,
        reasoning: reasoning || undefined,
      });

      console.log('Added assistant message:', assistantMessage);

      // Update messages immediately for better UX
      const finalConversation = conversations.find(c => c.id === conversationId);
      if (finalConversation) {
        setMessages(finalConversation.messages);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      
      // Add error message to help debug
      addMessage(conversationId, {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || appLoading) {
    return <CustomLoader />;
  }

  if (!user) {
    return <NameInputScreen onNameSubmit={handleNameSubmit} />;
  }

  console.log('Current messages:', messages);
  console.log('Current conversations:', conversations);

  return (
    <div className="flex h-screen bg-black text-white font-google-sans">
      <AppSidebar
        conversations={conversations.map(conv => ({
          id: conv.id,
          title: conv.title,
          lastMessage: conv.messages[conv.messages.length - 1]?.content || '',
          timestamp: new Date(conv.updated_at),
          messageCount: conv.messages.length,
          messages: conv.messages,
        }))}
        currentConversationId={currentConversationId}
        onSelectConversation={(id) => {
          console.log('Selecting conversation:', id);
          setCurrentConversationId(id);
        }}
        onNewConversation={() => {
          console.log('Creating new conversation');
          const newConversation = createConversation();
          setCurrentConversationId(newConversation.id);
        }}
        onDeleteConversation={deleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onCollapsedChange={setSidebarCollapsed}
      />
      
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-0 sm:ml-16 lg:ml-64'}`}>
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-black">
          <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-48 bg-transparent border-none text-white text-sm shadow-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-white">
                {MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id} className="hover:bg-gray-800">
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1 md:space-x-2 hover:bg-gray-800 p-1 md:p-2">
                  <Avatar className="w-6 h-6 md:w-8 md:h-8">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || user.email || ''} />
                    <AvatarFallback className="bg-purple-600 text-white text-xs md:text-sm">
                      {(user.displayName || user.email || 'U').charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white text-sm md:text-base hidden md:block">
                    {getFirstName(user.displayName || user.email || 'User')}
                  </span>
                  <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white z-50" align="end">
                <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-800">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || user.email || ''} />
                    <AvatarFallback className="bg-purple-600 text-white text-xs">
                      {(user.displayName || user.email || 'U').charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.displayName || user.email}</span>
                    <span className="text-xs text-gray-400">{user.email}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 hover:bg-gray-800 text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-6">
                  <DynamicText />
                  <span className="text-2xl md:text-4xl font-light text-white ml-2">
                    <span className="text-purple-400">
                      {getFirstName(user.displayName || user.email || 'User')}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-2 md:px-4 relative scrollbar-hide" ref={scrollAreaRef}>
              <div className="max-w-3xl mx-auto py-4 space-y-4 md:space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className="group">
                    {message.role === 'user' ? (
                      <div className="flex justify-end mb-2">
                        <div className="max-w-[85%] md:max-w-xs lg:max-w-md bg-gray-800 text-white rounded-2xl px-3 md:px-4 py-3">
                          {message.imageUrl && (
                            <img 
                              src={message.imageUrl} 
                              alt="Uploaded" 
                              className="max-w-full rounded-lg mb-2"
                              onClick={() => setFullScreenImage(message.imageUrl!)}
                            />
                          )}
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                      </div>
                    ) : (
                      <motion.div 
                        className="max-w-[95%] md:max-w-2xl mb-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        <ReasoningView 
                          reasoning={message.reasoning || ''} 
                          isVisible={selectedModel === 'sarvamai/sarvam-m:free' && !!message.reasoning}
                        />
                        <div className="text-white whitespace-pre-wrap text-sm leading-relaxed">
                          <FadeInText text={message.content} />
                        </div>
                      </motion.div>
                    )}
                    <MessageActions
                      content={message.content}
                      messageId={message.id}
                      onRegenerate={message.role === 'assistant' ? () => {} : undefined}
                      onDelete={() => {}}
                      onEdit={(newContent) => {}}
                      isEditing={editingMessageId === message.id}
                      onCancelEdit={() => setEditingMessageId(null)}
                      isUser={message.role === 'user'}
                    />
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <AnimatedLoader />
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="px-2 md:px-4 pb-4 md:pb-6 pt-2 bg-black relative z-10">
          <div className="max-w-4xl mx-auto w-full">
            <AIPromptInput
              value={input}
              onChange={setInput}
              onSendMessage={sendMessage}
              onImageUpload={handleImageUpload}
              disabled={isLoading}
              uploadedImage={uploadedImage}
              onRemoveImage={() => setUploadedImage(null)}
            />
          </div>
        </div>
      </div>
      
      {showProfile && (
        <UserProfile 
          user={{
            displayName: user.displayName || user.email || 'User',
            email: user.email || '',
            photoURL: user.photoURL || '',
          }}
        />
      )}
      <EssayModal
        isOpen={essayModalOpen}
        onClose={() => setEssayModalOpen(false)}
        content={currentEssayContent}
        onContentChange={setCurrentEssayContent}
        title="Essay Editor"
      />
      {fullScreenImage && (
        <ImageModal 
          imageUrl={fullScreenImage} 
          onClose={() => setFullScreenImage(null)} 
        />
      )}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, type: 'message' })}
        onConfirm={confirmDelete.type === 'message' ? () => {} : () => {}}
        title={confirmDelete.type === 'message' ? "Delete Message" : "Delete Conversation"}
        description={
          confirmDelete.type === 'message' 
            ? "Are you sure you want to delete this message? This action cannot be undone."
            : "Are you sure you want to delete this conversation? All messages will be permanently removed."
        }
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default ChatInterface;

