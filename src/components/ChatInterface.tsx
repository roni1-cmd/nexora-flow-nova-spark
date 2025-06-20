import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, Download, X, ChevronDown, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { UserProfile } from './UserProfile';
import { EssayCanvas } from './EssayCanvas';
import { useUsageTracking } from '@/hooks/useUsageTracking';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  isCode?: boolean;
}

interface User {
  displayName: string;
  email: string;
  photoURL: string;
}

const MODELS = [
  { id: 'accounts/fireworks/models/qwen2p5-72b-instruct', name: 'nexora PetalFlow' },
  { id: 'accounts/fireworks/models/llama4-maverick-instruct-basic', name: 'nexora Casanova Scout' },
  { id: 'accounts/fireworks/models/llama-v3p1-8b-instruct', name: 'nexora Lip Instruct' },
  { id: 'accounts/fireworks/models/deepseek-r1-basic', name: 'nexora Fluxborn Adaptive' },
  { id: 'accounts/sentientfoundation-serverless/models/dobby-mini-unhinged-plus-llama-3-1-8b', name: 'nexora-X RogueMini 8B' },
];

const API_KEY = 'fw_3Zkrqd9Q3bWrDrUUCUdfgBog';

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
  <div className="flex space-x-1 p-3">
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
  </div>
);

const TypewriterText = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 5);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return <span>{displayedText}</span>;
};

const CodeCanvas = ({ code }: { code: string }) => (
  <div className="bg-gray-900 rounded-lg p-4 my-3 border border-gray-700">
    <div className="flex items-center justify-between mb-3">
      <div className="text-xs text-gray-400 font-medium">Code</div>
      <Button
        onClick={() => navigator.clipboard.writeText(code)}
        variant="ghost"
        size="sm"
        className="text-gray-400 hover:text-white h-7 px-2"
      >
        Copy
      </Button>
    </div>
    <pre className="text-sm text-gray-100 overflow-x-auto whitespace-pre-wrap">
      <code>{code}</code>
    </pre>
  </div>
);

const ImageModal = ({ imageUrl, onClose }: { imageUrl: string; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50" onClick={onClose}>
    <div className="relative max-w-4xl max-h-4xl p-4">
      <Button
        onClick={onClose}
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 text-white hover:bg-gray-800 z-10"
      >
        <X className="w-6 h-6" />
      </Button>
      <img 
        src={imageUrl} 
        alt="Full screen view" 
        className="max-w-full max-h-full object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  </div>
);

const AuthScreen = ({ onSignIn }: { onSignIn: () => void }) => {
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onSignIn();
    } catch (error: any) {
      console.error('Error during sign-in:', error);
      toast({
        title: "Error",
        description: "Failed to sign in: " + error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <header className="flex justify-center items-center p-4 bg-black/80 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/ae2c56ce-3b9e-4596-bd03-b70dd5af1d5e.png" 
            alt="nexora" 
            className="w-8 h-8 md:w-10 md:h-10"
          />
          <div className="flex flex-col">
            <div className="text-lg md:text-xl font-semibold text-white">nexora</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-10 max-w-6xl w-full">
          {/* Left Section */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-6 md:mb-8">
              <span className="block mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                You command a constellation.
              </span>
              <span className="block bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                Sign in. Rewrite what's possible.
              </span>
            </h1>
          </div>

          {/* Right Section */}
          <div className="flex flex-col gap-4 w-full max-w-sm">
            <button 
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center gap-3 p-4 border border-white/20 rounded-3xl bg-white/5 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all duration-200 text-white"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm md:text-base">Sign in with Google</span>
            </button>

            <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed px-2">
              By signing up, I agree to the nexora<br/>
              <a href="https://coreastarstroupe.netlify.app/privacy-policy" className="text-purple-400 hover:text-purple-300">privacy policy</a> and <a href="https://coreastarstroupe.netlify.app/terms-of-service" className="text-purple-400 hover:text-purple-300">terms of service</a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-center gap-6 md:gap-8 p-4 bg-white/5">
        <a href="https://coreastarstroupe.netlify.app/privacy-policy" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">Privacy</a>
        <a href="https://coreastarstroupe.netlify.app/terms-of-service" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">Terms</a>
      </div>
    </div>
  );
};

export const ChatInterface = () => {
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { trackApiCall, trackModelUsage, stats } = useUsageTracking();

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
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isGeneratingImage) {
      const interval = setInterval(() => {
        setImageProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 200);
      return () => clearInterval(interval);
    } else {
      setImageProgress(0);
    }
  }, [isGeneratingImage]);

  // Add clipboard paste support
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

  const detectCodeInMessage = (content: string) => {
    const codePatterns = [
      /```[\s\S]*?```/g,
      /`[^`]+`/g,
      /\b(function|const|let|var|if|else|for|while|class|import|export)\b/g,
      /\b(def|print|return|import|class|if|else|for|while)\b/g,
      /<[^>]+>/g
    ];
    return codePatterns.some(pattern => pattern.test(content));
  };

  const extractCodeBlocks = (content: string) => {
    const codeBlockRegex = /```(?:\w+\n)?([\s\S]*?)```/g;
    const matches = [...content.matchAll(codeBlockRegex)];
    return matches.map(match => match[1].trim());
  };

  const removeCodeBlocksFromContent = (content: string) => {
    return content.replace(/```(?:\w+\n)?[\s\S]*?```/g, '').trim();
  };

  const detectEssayRequest = (content: string) => {
    const essayPatterns = [
      /\b(essay|write|composition|paper|article|report|analysis)\b/i,
      /\b(explain|describe|discuss|analyze|compare|contrast)\b.*\b(essay|paper|article)\b/i,
      /\bwrite\s+(about|on|an?\s+essay)\b/i
    ];
    return essayPatterns.some(pattern => pattern.test(content));
  };

  const sendMessage = async () => {
    if (!input.trim() && !uploadedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      imageUrl: uploadedImage || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setUploadedImage(null);

    const isImageRequest = /\b(generate|create|make|draw|show|design|produce|image|picture|photo|art|illustration|drawing)\b/i.test(currentInput);
    const isEssayRequest = detectEssayRequest(currentInput);

    if (isImageRequest) {
      setIsGeneratingImage(true);
      await generateImage(currentInput);
      return;
    }

    setIsLoading(true);

    try {
      const modelToUse = uploadedImage ? 'accounts/fireworks/models/llama4-maverick-instruct-basic' : selectedModel;

      // Track API call
      trackApiCall(modelToUse);

      const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelToUse,
          messages: [
            {
              role: 'user',
              content: uploadedImage 
                ? [
                    { type: 'text', text: currentInput },
                    { type: 'image_url', image_url: { url: uploadedImage } }
                  ]
                : currentInput
            }
          ],
          max_tokens: isEssayRequest ? 2000 : 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from API');
      }

      const data = await response.json();
      const responseContent = data.choices[0].message.content;
      
      // Track model usage
      trackModelUsage(modelToUse);

      if (isEssayRequest) {
        // For essay requests, use EssayCanvas
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseContent,
          isCode: false,
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // For regular requests, handle code blocks
        const codeBlocks = extractCodeBlocks(responseContent);
        const cleanContent = removeCodeBlocksFromContent(responseContent);
        
        if (cleanContent.trim()) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: cleanContent,
          };
          setMessages(prev => [...prev, assistantMessage]);
        }

        // Add code blocks as separate messages if they exist
        if (codeBlocks.length > 0) {
          codeBlocks.forEach((code, index) => {
            const codeMessage: Message = {
              id: (Date.now() + 2 + index).toString(),
              role: 'assistant',
              content: code,
              isCode: true,
            };
            setMessages(prev => [...prev, codeMessage]);
          });
        }
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
    }
  };

  const generateImage = async (prompt: string) => {
    try {
      const response = await fetch('https://api.fireworks.ai/inference/v1/workflows/accounts/fireworks/models/flux-1-schnell-fp8/text_to_image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      setImageProgress(100);
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Here\'s the generated image:',
        imageUrl: imageUrl,
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
      setImageProgress(0);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'nexora-generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setMessages([]);
      setShowProfile(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUpgradeClick = () => {
    window.open('https://coreastarstroupe.netlify.app/pricing', '_blank');
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onSignIn={() => {}} />;
  }

  if (showProfile) {
    return (
      <div className="flex flex-col h-screen bg-black text-white">
        {/* Header for Profile */}
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
    <div className="flex flex-col h-screen bg-black text-white font-google-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-black border-b border-gray-800 md:border-none">
        <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
          <div className="flex items-center space-x-2 md:space-x-3">
            <img 
              src="/lovable-uploads/ae2c56ce-3b9e-4596-bd03-b70dd5af1d5e.png" 
              alt="nexora" 
              className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0"
            />
            <span className="text-lg md:text-xl font-medium text-white hidden sm:block">nexora</span>
          </div>
          
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-32 md:w-64 bg-black border-none text-white focus:ring-0 focus:border-none text-xs md:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-gray-700 z-50">
              {MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id} className="text-white hover:bg-gray-800 text-xs md:text-sm">
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Right side with Upgrade button and User Profile Dropdown */}
        <div className="flex items-center space-x-2 md:space-x-4 flex-shrink-0">
          <Button
            onClick={handleUpgradeClick}
            variant="outline"
            size="sm"
            className="border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 text-xs md:text-sm px-2 md:px-4"
          >
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

      {/* Messages or Initial State */}
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
          <div className="flex-1 overflow-y-auto px-2 md:px-4 relative scrollbar-hide" ref={scrollAreaRef}>
            <div className="max-w-3xl mx-auto py-4 space-y-4 md:space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'user' ? (
                    <div className="max-w-[85%] md:max-w-xs lg:max-w-md bg-gray-800 text-white rounded-2xl px-3 md:px-4 py-2">
                      {message.imageUrl && (
                        <img 
                          src={message.imageUrl} 
                          alt="Uploaded" 
                          className="max-w-full rounded-lg mb-2"
                        />
                      )}
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ) : (
                    <div className="max-w-[95%] md:max-w-2xl">
                      {message.isCode ? (
                        <CodeCanvas code={message.content} />
                      ) : detectEssayRequest(message.content) && message.content.length > 500 ? (
                        <EssayCanvas content={message.content} />
                      ) : (
                        <>
                          <div className="text-white whitespace-pre-wrap text-sm leading-relaxed">
                            <TypewriterText text={message.content} />
                          </div>
                          {message.imageUrl && (
                            <div className="mt-3">
                              <img 
                                src={message.imageUrl} 
                                alt="Generated" 
                                className="max-w-full md:max-w-sm rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => setFullScreenImage(message.imageUrl!)}
                              />
                              <Button
                                onClick={() => downloadImage(message.imageUrl!)}
                                variant="outline"
                                size="sm"
                                className="mt-2 bg-gray-800 border-gray-600 hover:bg-gray-700 text-white"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <TypingAnimation />
                </div>
              )}
              {isGeneratingImage && (
                <div className="flex justify-start">
                  <div className="max-w-2xl">
                    <div className="text-white text-sm mb-2">Generating image...</div>
                    <Progress value={imageProgress} className="w-48 md:w-64 h-2" />
                  </div>
                </div>
              )}
            </div>
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="px-2 md:px-4 pb-4 md:pb-6 pt-6 md:pt-12 bg-black">
        <div className="max-w-3xl mx-auto">
          {uploadedImage && (
            <div className="mb-3 flex items-center space-x-2">
              <img src={uploadedImage} alt="Preview" className="w-10 h-10 md:w-12 md:h-12 rounded object-cover" />
              <Button
                onClick={() => setUploadedImage(null)}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-gray-900 text-xs md:text-sm"
              >
                Remove
              </Button>
            </div>
          )}
          <div className="flex items-center space-x-2 md:space-x-3 bg-black border border-white rounded-full px-3 md:px-4 py-2 md:py-3">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full w-6 h-6 md:w-8 md:h-8 flex-shrink-0"
            >
              <Upload className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Message nexora..."
              className="flex-1 bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 focus:outline-none focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm md:text-base"
              disabled={isLoading || isGeneratingImage}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || isGeneratingImage || (!input.trim() && !uploadedImage)}
              size="icon"
              className="rounded-full w-6 h-6 md:w-8 md:h-8 bg-white hover:bg-gray-200 text-black disabled:bg-gray-600 disabled:text-gray-400 flex-shrink-0"
            >
              <Send className="w-3 h-3 md:w-4 md:h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {fullScreenImage && (
        <ImageModal 
          imageUrl={fullScreenImage} 
          onClose={() => setFullScreenImage(null)} 
        />
      )}
    </div>
  );
};
