import React, { useState, useRef, useEffect } from 'react';
import { Download, X, ChevronDown, LogOut, User, Zap, Bot, ArrowLeft, MessageSquare, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { UserProfile } from './UserProfile';
import { EssayCanvas } from './EssayCanvas';
import { EssayModal } from './EssayModal';
import { ReasoningView } from './ReasoningView';
import { MessageActions } from './MessageActions';
import { AppSidebar } from './AppSidebar';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import AIPromptInput from './AIPromptInput';
import AITextLoading from './AITextLoading';
import CustomLoader from './CustomLoader';
import ConfirmDialog from './ConfirmDialog';
import AnimatedLoader from './AnimatedLoader';
import DynamicText from './DynamicText';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  isCode?: boolean;
  isEssay?: boolean;
  reasoning?: string;
  timestamp?: Date;
}

interface User {
  displayName: string;
  email: string;
  photoURL: string;
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
  messages: Message[];
}

const MODELS = [
  { id: 'gemma2-9b-it', name: 'nexora node-X7' },
  { id: 'llama-3.1-8b-instant', name: 'nexora orion-9' },
  { id: 'llama-3.3-70b-versatile', name: 'nexora fract-01' },
  { id: 'mistral-saba-24b', name: 'nexora cryptiq-32R' },
  { id: 'qwen-qwq-32b', name: 'nexora Cortex-Cerebruc' },
];

const API_KEY = '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';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCB1DwFSwQLDOlUFtWQtUvqOWPnI1HrP5E",
  authDomain: "messenger-7c40c.firebaseapp.com",
  projectId: "messenger-7c40c",
  storageBucket: "messenger-7c40c.firebasestorage.app",
  messagingSenderId: "435817942279",
  appId: "1:435817942279:web:36b3f65e6358d8aa0a49a2",
  measurementId: "G-HJ094HC4F2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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

// Enhanced Auth Screen Component
const AuthScreen = () => (
  <div className="flex flex-col h-screen bg-black text-white">
    <header className="flex justify-center items-center p-6 bg-black">
      <div className="flex items-center gap-3">
        <img 
          src="/lovable-uploads/ae2c56ce-3b9e-4596-bd03-b70dd5af1d5e.png" 
          alt="nexora" 
          className="w-8 h-8 mr-3"
        />
        <span className="text-xl font-semibold text-white">nexora</span>
      </div>
    </header>
    
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-light text-white mb-4">Welcome to nexora</h1>
            <p className="text-gray-400 text-lg mb-8">Your intelligent AI companion</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-900 rounded-lg p-4 text-center">
                <Zap className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-xs text-gray-300">Fast</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 text-center">
                <Bot className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-xs text-gray-300">Smart</p>
              </div>
              <div className="bg-gray-900 rounded-lg p-4 text-center">
                <MessageSquare className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-xs text-gray-300">Helpful</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button 
            onClick={async () => {
              const provider = new GoogleAuthProvider();
              await signInWithPopup(auth, provider);
            }}
            className="w-full flex items-center justify-center gap-3 p-4 border border-gray-700 rounded-lg bg-black hover:bg-gray-900 transition-all duration-200 text-white mb-6 shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="font-medium">Continue with Google</span>
          </button>
          
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            By signing up, I agree to the nexora<br/>
            <a href="https://coreastarstroupe.netlify.app/privacy-policy" className="text-purple-400 hover:text-purple-300">privacy policy</a> and <a href="https://coreastarstroupe.netlify.app/terms-of-service" className="text-purple-400 hover:text-purple-300">terms of service</a>
          </p>
        </motion.div>
      </div>
    </div>
  </div>
);

const ChatInterface = () => {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
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

  // Load data from localStorage on mount
  useEffect(() => {
    const savedConversations = localStorage.getItem('nexora-conversations');
    const savedCurrentId = localStorage.getItem('nexora-current-conversation');
    const savedModel = localStorage.getItem('nexora-selected-model');
    
    if (savedConversations) {
      const parsedConversations = JSON.parse(savedConversations).map((conv: any) => ({
        ...conv,
        timestamp: new Date(conv.timestamp),
        messages: conv.messages.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
        }))
      }));
      setConversations(parsedConversations);
    }
    
    if (savedCurrentId) {
      setCurrentConversationId(savedCurrentId);
      const conversation = conversations.find(c => c.id === savedCurrentId);
      if (conversation) {
        setMessages(conversation.messages);
      }
    }
    
    if (savedModel) {
      setSelectedModel(savedModel);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('nexora-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  useEffect(() => {
    if (currentConversationId) {
      localStorage.setItem('nexora-current-conversation', currentConversationId);
    }
  }, [currentConversationId]);

  useEffect(() => {
    localStorage.setItem('nexora-selected-model', selectedModel);
  }, [selectedModel]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          displayName: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || ''
        });
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const sendMessage = async () => {
    const contentToSend = input;
    if (!contentToSend.trim() && !uploadedImage) return;

    if (!currentConversationId) {
      const newId = Date.now().toString();
      const newConversation: Conversation = {
        id: newId,
        title: 'New Conversation',
        lastMessage: '',
        timestamp: new Date(),
        messageCount: 0,
        messages: []
      };
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversationId(newId);
      setMessages([]);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: contentToSend,
      imageUrl: uploadedImage || undefined,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setUploadedImage(null);

    setIsLoading(true);

    try {
      trackApiCall(selectedModel);

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: 'user', content: contentToSend }],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: new Date(),
      };

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return <CustomLoader />;
  }

  if (!user) {
    return <AuthScreen />;
  }

  // Check if sidebar is collapsed by looking at the sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-black text-white font-google-sans">
      <AppSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={(id) => {
          const conversation = conversations.find(c => c.id === id);
          if (conversation) {
            setCurrentConversationId(id);
            setMessages(conversation.messages);
          }
        }}
        onNewConversation={() => {
          const newId = Date.now().toString();
          const newConversation: Conversation = {
            id: newId,
            title: 'New Conversation',
            lastMessage: '',
            timestamp: new Date(),
            messageCount: 0,
            messages: []
          };
          setConversations(prev => [newConversation, ...prev]);
          setCurrentConversationId(newId);
          setMessages([]);
        }}
        onDeleteConversation={(id) => {
          setConversations(prev => prev.filter(c => c.id !== id));
          if (currentConversationId === id) {
            setCurrentConversationId(null);
            setMessages([]);
          }
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className={cn(
        "flex-1 flex flex-col overflow-hidden transition-all duration-300",
        sidebarOpen ? "sm:ml-16 lg:ml-64" : "sm:ml-0 lg:ml-0" // Default margins for sidebar
      )}>
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-black">
          <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
            {/* Model Selector replacing "nexora" */}
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-white text-sm">
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
                    <AvatarImage src={user.photoURL} alt={user.displayName} />
                    <AvatarFallback className="bg-purple-600 text-white text-xs md:text-sm">
                      {user.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white text-sm md:text-base hidden md:block">{user.displayName}</span>
                  <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white z-50" align="end">
                <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-800">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={user.photoURL} alt={user.displayName} />
                    <AvatarFallback className="bg-purple-600 text-white text-xs">
                      {user.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.displayName}</span>
                    <span className="text-xs text-gray-400">{user.email}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowProfile(true)}
                  className="flex items-center space-x-2 hover:bg-gray-800"
                >
                  <User className="w-4 h-4" />
                  <span>View Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={async () => {
                    await signOut(auth);
                    setMessages([]);
                    setConversations([]);
                    setCurrentConversationId(null);
                    setShowProfile(false);
                    localStorage.clear();
                  }}
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
                {/* Bringing greeting closer to name */}
                <div className="flex items-center justify-center gap-1 mb-6">
                  <DynamicText />
                  <span className="text-2xl md:text-4xl font-light text-white">
                    <span className="text-purple-400">{user.displayName}</span>
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
                          isVisible={selectedModel === 'qwen-qwq-32b' && !!message.reasoning}
                        />
                        <div className="text-white whitespace-pre-wrap text-sm leading-relaxed">
                          <div 
                            dangerouslySetInnerHTML={{ 
                              __html: formatMarkdown(message.content) 
                            }} 
                          />
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
      
      {showProfile && (
        <UserProfile 
          user={user}
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
