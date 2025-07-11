import React, { useState, useRef, useEffect } from 'react';
import { Download, X, ChevronDown, LogOut, User, Zap, Bot, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { UserProfile } from './UserProfile';
import { EssayCanvas } from './EssayCanvas';
import { EssayModal } from './EssayModal';
import { ReasoningView } from './ReasoningView';
import { MessageActions } from './MessageActions';
import { ConversationSidebar } from './ConversationSidebar';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import AIPromptInput from './AIPromptInput';
import CustomLoader from './CustomLoader';
import ConfirmDialog from './ConfirmDialog';
import EssayLoader from './EssayLoader';
import { motion } from 'framer-motion';
import { ImageModal } from './ImageModal';
import { formatMarkdown } from '@/lib/formatMarkdown';
import AuthScreen from './AuthScreen';
import { auth } from '@/lib/firebase';

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

export const ChatInterface = () => {
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
  const [isGeneratingEssay, setIsGeneratingEssay] = useState(false);
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

  const currentConversationKey = `nexora-current-conversation-${user?.email || 'anonymous'}`;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    if (mediaQuery.matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('nexora-conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConversations(parsed.map((conv: any) => ({
          ...conv,
          timestamp: new Date(conv.timestamp),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
          }))
        })));
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('nexora-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

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

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
              setUploadedImage(e.target?.result as string);
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const detectEssayRequest = (content: string) => {
    const essayPatterns = [
      /\b(essay|write|composition|paper|article|report|analysis)\b/i,
      /\b(explain|describe|discuss|analyze|compare|contrast)\b.*\b(essay|paper|article)\b/i,
      /\bwrite\s+(about|on|an?\s+essay)\b/i
    ];
    return essayPatterns.some(pattern => pattern.test(content));
  };

  const extractCodeBlocks = (content: string) => {
    const codeBlockRegex = /```(?:\w+\n)?([\s\S]*?)```/g;
    const matches = [...content.matchAll(codeBlockRegex)];
    return matches.map(match => match[1].trim());
  };

  const removeCodeBlocksFromContent = (content: string) => {
    return content.replace(/```(?:\w+\n)?[\s\S]*?```/g, '').trim();
  };

  const createNewConversation = () => {
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
  };

  const updateConversation = (messages: Message[]) => {
    if (!currentConversationId) return;

    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversationId) {
        const lastUserMessage = messages.filter(m => m.role === 'user').pop();
        return {
          ...conv,
          title: lastUserMessage?.content.slice(0, 50) + (lastUserMessage?.content.length > 50 ? '...' : '') || 'New Conversation',
          lastMessage: messages[messages.length - 1]?.content.slice(0, 100) || '',
          timestamp: new Date(),
          messageCount: messages.length,
          messages
        };
      }
      return conv;
    }));
  };

  useEffect(() => {
    if (user) {
      const savedCurrentId = localStorage.getItem(currentConversationKey);
      if (savedCurrentId && conversations.length > 0) {
        const conversation = conversations.find(c => c.id === savedCurrentId);
        if (conversation) {
          setCurrentConversationId(savedCurrentId);
          setMessages(conversation.messages);
        }
      }
    }
  }, [user, conversations]);

  useEffect(() => {
    if (currentConversationId && user) {
      localStorage.setItem(currentConversationKey, currentConversationId);
    }
  }, [currentConversationId, user]);

  const loadConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setCurrentConversationId(conversationId);
      setMessages(conversation.messages);
      setSidebarOpen(false);
    }
  };

  const handleDeleteConversation = (conversationId: string) => {
    setConfirmDelete({
      isOpen: true,
      conversationId,
      type: 'conversation'
    });
  };

  const sendMessage = async (messageContent?: string) => {
    const contentToSend = messageContent || input;
    if (!contentToSend.trim() && !uploadedImage) return;

    if (!currentConversationId) {
      createNewConversation();
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

    const isWikipediaResult = contentToSend.startsWith('Wikipedia search results for');
    
    if (isWikipediaResult) {
      updateConversation(newMessages);
      return;
    }

    const isEssayRequest = detectEssayRequest(contentToSend);
    const isReasoningModel = selectedModel === 'qwen-qwq-32b';

    if (isEssayRequest) {
      setIsGeneratingEssay(true);
    } else {
      setIsLoading(true);
    }

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
          messages: [
            {
              role: 'user',
              content: uploadedImage 
                ? [
                    { type: 'text', text: contentToSend },
                    { type: 'image_url', image_url: { url: uploadedImage } }
                  ]
                : contentToSend
            }
          ],
          max_tokens: isEssayRequest ? 2000 : 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      let responseContent = data.choices[0].message.content;
      let reasoning = '';

      if (isReasoningModel && responseContent.includes('<think>')) {
        const thinkMatch = responseContent.match(/<think>([\s\S]*?)<\/think>/);
        if (thinkMatch) {
          reasoning = thinkMatch[1].trim();
          responseContent = responseContent.replace(/<think>[\s\S]*?<\/think>/, '').trim();
        }
      }
      
      trackModelUsage(selectedModel);

      if (isEssayRequest && responseContent.length > 500) {
        setCurrentEssayContent(responseContent);
        setEssayModalOpen(true);
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseContent,
          isEssay: true,
          reasoning,
          timestamp: new Date(),
        };
        
        const updatedMessages = [...newMessages, assistantMessage];
        setMessages(updatedMessages);
        updateConversation(updatedMessages);
      } else {
        const codeBlocks = extractCodeBlocks(responseContent);
        const cleanContent = removeCodeBlocksFromContent(responseContent);
        
        const messagesToAdd: Message[] = [];
        
        if (cleanContent.trim()) {
          messagesToAdd.push({
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: cleanContent,
            reasoning,
            timestamp: new Date(),
          });
        }

        if (codeBlocks.length > 0) {
          codeBlocks.forEach((code, index) => {
            messagesToAdd.push({
              id: (Date.now() + 2 + index).toString(),
              role: 'assistant',
              content: code,
              isCode: true,
              timestamp: new Date(),
            });
          });
        }

        const updatedMessages = [...newMessages, ...messagesToAdd];
        setMessages(updatedMessages);
        updateConversation(updatedMessages);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsGeneratingEssay(false);
    }
  };

  const regenerateResponse = async (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;

    const precedingMessages = messages.slice(0, messageIndex);
    const lastUserMessage = precedingMessages.filter(m => m.role === 'user').pop();
    
    if (!lastUserMessage) return;

    const newMessages = messages.slice(0, messageIndex);
    setMessages(newMessages);
    
    await sendMessage(lastUserMessage.content);
  };

  const deleteMessage = (messageId: string) => {
    setConfirmDelete({
      isOpen: true,
      messageId,
      type: 'message'
    });
  };

  const confirmDeleteMessage = () => {
    if (confirmDelete.messageId) {
      const newMessages = messages.filter(m => m.id !== confirmDelete.messageId);
      setMessages(newMessages);
      updateConversation(newMessages);
    }
    setConfirmDelete({ isOpen: false, type: 'message' });
  };

  const confirmDeleteConversation = () => {
    if (confirmDelete.conversationId) {
      setConversations(prev => prev.filter(c => c.id !== confirmDelete.conversationId));
      if (currentConversationId === confirmDelete.conversationId) {
        setCurrentConversationId(null);
        setMessages([]);
      }
    }
    setConfirmDelete({ isOpen: false, type: 'conversation' });
  };

  const editMessage = (messageId: string, newContent: string) => {
    if (editingMessageId === messageId) {
      const newMessages = messages.map(m => 
        m.id === messageId ? { ...m, content: newContent } : m
      );
      setMessages(newMessages);
      updateConversation(newMessages);
      setEditingMessageId(null);
    } else {
      setEditingMessageId(messageId);
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setMessages([]);
      setConversations([]);
      setCurrentConversationId(null);
      setShowProfile(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUpgradeClick = () => {
    window.open('https://coreastarstroupe.netlify.app/pricing', '_blank');
  };

  if (authLoading) {
    return <CustomLoader />;
  }

  if (!user) {
    return <AuthScreen onSignIn={() => {}} />;
  }

  if (showProfile) {
    return (
      <div className="flex flex-col h-screen bg-black text-white">
        <div className="flex items-center justify-between px-4 md:px-6 py-4 bg-black border-b border-gray-800">
          <Button
            onClick={() => setShowProfile(false)}
            variant="ghost"
            className="text-white hover:bg-gray-800"
          >
            ← Back to Chat
          </Button>
          <span className="text-lg md:text-xl font-medium">User Profile</span>
          <div></div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <UserProfile user={user} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-white font-google-sans">
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={loadConversation}
        onNewConversation={createNewConversation}
        onDeleteConversation={handleDeleteConversation}
        onShowProfile={() => setShowProfile(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-black">
          <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
            <Button
              onClick={() => setSidebarOpen(true)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-gray-800 lg:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center space-x-2 md:space-x-3">
              <img 
                src="/lovable-uploads/ae2c56ce-3b9e-4596-bd03-b70dd5af1d5e.png" 
                alt="nexora" 
                className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0"
              />
              <span className="text-lg md:text-xl font-medium text-white hidden sm:block">nexora</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-800 text-sm">
                  <span className="text-gray-300">{MODELS.find(m => m.id === selectedModel)?.name}</span>
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white z-50" align="start">
                {MODELS.map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={`hover:bg-gray-800 ${selectedModel === model.id ? 'bg-gray-800' : ''}`}
                  >
                    {model.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
            <Button
              onClick={handleUpgradeClick}
              variant="outline"
              size="sm"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 text-xs md:text-sm px-2 md:px-4"
            >
              <Zap className="w-3 h-3 mr-1" />
              Upgrade
            </Button>

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

        <div className="flex-1 flex flex-col overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="text-center">
                <h1 className="text-2xl md:text-4xl font-light text-white mb-6 md:mb-8">
                  What do you want to know, <span className="text-purple-400">{user.displayName}</span>?
                </h1>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-2 md:px-4" ref={scrollAreaRef}>
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
                        
                        {message.isCode ? (
                          <EssayCanvas content={message.content} />
                        ) : message.isEssay ? (
                          <div className="bg-gray-900 rounded-lg p-3 md:p-4 my-3 border border-gray-700">
                            <div className="flex items-center justify-between mb-3">
                              <div className="text-xs text-gray-400 font-medium">Essay Generated</div>
                              <Button
                                onClick={() => {
                                  setCurrentEssayContent(message.content);
                                  setEssayModalOpen(true);
                                }}
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700 h-6 md:h-7 px-2 text-xs"
                              >
                                Open in Editor
                              </Button>
                            </div>
                            <div className="text-xs md:text-sm text-gray-300 line-clamp-4">
                              {message.content.substring(0, 200)}...
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="text-white whitespace-pre-wrap text-sm leading-relaxed">
                              <div 
                                dangerouslySetInnerHTML={{ 
                                  __html: formatMarkdown(message.content) 
                                }} 
                              />
                            </div>
                            {message.imageUrl && (
                              <div className="mt-3">
                                <img 
                                  src={message.imageUrl} 
                                  alt="Generated" 
                                  className="max-w-full md:max-w-sm rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => setFullScreenImage(message.imageUrl!)}
                                />
                              </div>
                            )}
                          </>
                        )}
                      </motion.div>
                    )}
                    
                    <MessageActions
                      content={message.content}
                      messageId={message.id}
                      onRegenerate={message.role === 'assistant' ? () => regenerateResponse(message.id) : undefined}
                      onDelete={() => deleteMessage(message.id)}
                      onEdit={(newContent) => editMessage(message.id, newContent)}
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
                      <CustomLoader />
                    </motion.div>
                  </div>
                )}
                {isGeneratingEssay && (
                  <div className="flex justify-start mb-2">
                    <motion.div 
                      className="max-w-[95%] md:max-w-2xl"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                      <div className="flex flex-col items-start">
                        <div className="transform scale-50 origin-left">
                          <EssayLoader />
                        </div>
                        <p className="text-sm text-gray-400 ml-2 -mt-8">We're generating your essay, please wait...</p>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-2 md:px-4 pb-4 md:pb-6 pt-2 bg-black">
          <AIPromptInput
            value={input}
            onChange={setInput}
            onSendMessage={() => sendMessage()}
            onImageUpload={handleImageUpload}
            disabled={isLoading || isGeneratingEssay}
            uploadedImage={uploadedImage}
            onRemoveImage={() => setUploadedImage(null)}
          />
        </div>
      </div>

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
        onConfirm={confirmDelete.type === 'message' ? confirmDeleteMessage : confirmDeleteConversation}
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
