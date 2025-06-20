
import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, Download, X, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

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

const API_KEY = 'fw_3ZWXAxAD6BWE4pgQkvkAqem3';

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
      }, 10); // Made faster: reduced from 20ms to 10ms
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text]);

  return <span>{displayedText}</span>;
};

const CodeCanvas = ({ code }: { code: string }) => (
  <div className="bg-gray-900 rounded-lg p-4 my-2 border border-gray-700">
    <div className="text-xs text-gray-400 mb-2">Code</div>
    <pre className="text-sm text-gray-100 overflow-x-auto">
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

const AuthScreen = ({ onSignIn }: { onSignIn: (user: User) => void }) => (
  <div className="flex flex-col h-screen bg-black text-white">
    {/* Header */}
    <header className="flex justify-center items-center p-4 bg-black/80 backdrop-blur-lg">
      <div className="flex items-center gap-3">
        <img 
          src="/lovable-uploads/ae2c56ce-3b9e-4596-bd03-b70dd5af1d5e.png" 
          alt="nexora" 
          className="w-10 h-10"
        />
        <div className="flex flex-col">
          <div className="text-lg font-semibold text-white">nexora</div>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 max-w-6xl w-full">
        {/* Left Section */}
        <div className="flex-1 max-w-2xl text-center lg:text-left">
          <h1 className="text-4xl lg:text-5xl font-semibold leading-tight mb-8">
            <span className="block mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              You command a consteallation.
            </span>
            <span className="block bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              Sign in. Rewrite what's possible.
            </span>
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-4 min-w-80 max-w-sm w-full">
          <button 
            onClick={() => {
              // Mock Google sign-in for demo
              onSignIn({
                displayName: 'Test User',
                email: 'testuser@gmail.com',
                photoURL: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
              });
            }}
            className="flex items-center justify-center gap-3 p-4 border border-white/20 rounded-3xl bg-white/5 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all duration-200 text-white"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
            By signing up, I agree to the nexora<br/>
            <a href="https://coreastarstroupe.netlify.app/privacy-policy" className="text-purple-400 hover:text-purple-300">privacy policy</a> and <a href="https://coreastarstroupe.netlify.app/terms-of-service" className="text-purple-400 hover:text-purple-300">terms of service</a>
          </p>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="flex justify-center gap-8 p-4 bg-white/5">
      <a href="https://coreastarstroupe.netlify.app/privacy-policy" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">Privacy</a>
      <a href="https://coreastarstroupe.netlify.app/terms-of-service" className="text-sm text-gray-400 hover:text-purple-400 transition-colors">Terms</a>
    </div>
  </div>
);

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const matches = [...content.matchAll(codeBlockRegex)];
    return matches.map(match => match[1].trim());
  };

  const sendMessage = async () => {
    if (!input.trim() && !uploadedImage) return;

    const isCodeRequest = detectCodeInMessage(input);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      imageUrl: uploadedImage || undefined,
      isCode: isCodeRequest,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setUploadedImage(null);

    const isImageRequest = /\b(generate|create|make|draw|show|design|produce|image|picture|photo|art|illustration|drawing)\b/i.test(input);

    if (isImageRequest) {
      setIsGeneratingImage(true);
      await generateImage(input);
      return;
    }

    setIsLoading(true);

    try {
      const modelToUse = uploadedImage ? 'accounts/fireworks/models/llama4-maverick-instruct-basic' : selectedModel;

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
                    { type: 'text', text: input },
                    { type: 'image_url', image_url: { url: uploadedImage } }
                  ]
                : input
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from API');
      }

      const data = await response.json();
      const responseContent = data.choices[0].message.content;
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        isCode: detectCodeInMessage(responseContent),
      };

      setMessages(prev => [...prev, assistantMessage]);

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

  const handleSignOut = () => {
    setUser(null);
    setMessages([]);
  };

  if (!user) {
    return <AuthScreen onSignIn={setUser} />;
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white font-google-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-black">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/ae2c56ce-3b9e-4596-bd03-b70dd5af1d5e.png" 
              alt="nexora" 
              className="w-8 h-8"
            />
            <span className="text-xl font-medium text-white">nexora</span>
          </div>
          
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-64 bg-black border-none text-white focus:ring-0 focus:border-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black border-gray-700">
              {MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id} className="text-white hover:bg-gray-800">
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-800">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.photoURL} alt={user.displayName} />
                <AvatarFallback className="bg-purple-600 text-white">
                  {user.displayName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-white">{user.displayName}</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white" align="end">
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
              onClick={handleSignOut}
              className="flex items-center space-x-2 hover:bg-gray-800 text-red-400"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages or Initial State */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-light text-white mb-8">
                What do you want to know, <span className="text-purple-400">{user.displayName}</span>?
              </h1>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 relative scrollbar-hide" ref={scrollAreaRef}>
            <div className="max-w-3xl mx-auto py-4 space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'user' ? (
                    <div className="max-w-xs lg:max-w-md bg-gray-800 text-white rounded-2xl px-4 py-2">
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
                    <div className="max-w-2xl">
                      <div className="text-white whitespace-pre-wrap text-sm leading-relaxed">
                        <TypewriterText text={message.content} />
                      </div>
                      {message.isCode && extractCodeBlocks(message.content).map((code, index) => (
                        <CodeCanvas key={index} code={code} />
                      ))}
                      {message.imageUrl && (
                        <div className="mt-3">
                          <img 
                            src={message.imageUrl} 
                            alt="Generated" 
                            className="max-w-sm rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
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
                    <Progress value={imageProgress} className="w-64 h-2" />
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
      <div className="px-4 pb-6 bg-black">
        <div className="max-w-3xl mx-auto">
          {uploadedImage && (
            <div className="mb-3 flex items-center space-x-2">
              <img src={uploadedImage} alt="Preview" className="w-12 h-12 rounded object-cover" />
              <Button
                onClick={() => setUploadedImage(null)}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-gray-900"
              >
                Remove
              </Button>
            </div>
          )}
          <div className="flex items-center space-x-3 bg-black border border-white rounded-full px-4 py-3">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full w-8 h-8"
            >
              <Upload className="w-4 h-4" />
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
              className="flex-1 bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 focus:outline-none focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={isLoading || isGeneratingImage}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || isGeneratingImage || (!input.trim() && !uploadedImage)}
              size="icon"
              className="rounded-full w-8 h-8 bg-white hover:bg-gray-200 text-black disabled:bg-gray-600 disabled:text-gray-400"
            >
              <Send className="w-4 h-4" />
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
