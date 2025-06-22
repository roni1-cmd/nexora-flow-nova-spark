import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Send, User, Settings, LogOut, PlusCircle, Code } from 'lucide-react';
import { UserProfile } from './UserProfile';
import { EssayCanvas } from './EssayCanvas';
import { useUsageTracking } from '@/hooks/useUsageTracking';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const models = [
  {
    id: 'accounts/fireworks/models/qwen2p5-72b-instruct',
    name: 'PetalFlow',
    description: 'Best general-purpose model'
  },
  {
    id: 'accounts/fireworks/models/llama4-maverick-instruct-basic',
    name: 'Casanova Scout',
    description: 'Good at creative tasks'
  },
  {
    id: 'accounts/fireworks/models/llama-v3p1-8b-instruct',
    name: 'Lip Instruct',
    description: 'Fast and efficient'
  },
  {
    id: 'accounts/fireworks/models/deepseek-r1-basic',
    name: 'Fluxborn Adaptive',
    description: 'Excels at coding tasks'
  },
  {
    id: 'accounts/sentientfoundation-serverless/models/dobby-mini-unhinged-plus-llama-3-1-8b',
    name: 'RogueMini 8B',
    description: 'Experimental model'
  }
];

const Message = ({ message, isUser }: { message: Message; isUser: boolean }) => {
  return (
    <div className={`flex gap-2 md:gap-4 mb-4 md:mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar className="w-6 h-6 md:w-8 md:h-8 mt-1">
          <AvatarFallback className="bg-purple-600 text-white text-xs md:text-sm">AI</AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-[85%] md:max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <Card className={`p-2 md:p-4 ${
          isUser 
            ? 'bg-purple-600 text-white border-purple-600' 
            : 'bg-gray-800 text-gray-100 border-gray-700'
        }`}>
          <div className="text-xs md:text-sm whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </div>
        </Card>
      </div>
      {isUser && (
        <Avatar className="w-6 h-6 md:w-8 md:h-8 mt-1">
          <AvatarFallback className="bg-blue-600 text-white text-xs md:text-sm">U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(models[0].id);
  const [showProfile, setShowProfile] = useState(false);
  const [lastResponse, setLastResponse] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { stats, trackApiCall, trackModelUsage } = useUsageTracking();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      trackApiCall(selectedModel);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ modelId: selectedModel, message: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage: Message = { role: 'assistant', content: data.response };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      setLastResponse(data.response);
      trackModelUsage(selectedModel);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorAIResponse: Message = { role: 'assistant', content: "Sorry, I'm having trouble connecting to the server. Please try again later." };
      setMessages(prevMessages => [...prevMessages, errorAIResponse]);
      setLastResponse("Sorry, I'm having trouble connecting to the server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const HeaderSection = () => (
    <div className="bg-gray-900 border-b border-gray-800 p-2 md:p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:block">
            <SidebarTrigger className="text-white hover:bg-gray-800" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-lg md:text-xl font-bold text-white">Nexora AI</h1>
            <p className="text-xs md:text-sm text-gray-400">Your AI Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1 md:gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-white hover:bg-gray-800 h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm"
              >
                {models.find(m => m.id === selectedModel)?.name || 'Select Model'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 w-48 md:w-56">
              {models.map((model) => (
                <DropdownMenuItem 
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer text-xs md:text-sm"
                >
                  <div>
                    <div className="font-medium">{model.name}</div>
                    <div className="text-xs text-gray-400">{model.description}</div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800 h-7 md:h-8 w-7 md:w-8 p-0">
                <User className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700 w-40 md:w-48">
              <DropdownMenuItem 
                onClick={() => setShowProfile(true)}
                className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer text-xs md:text-sm"
              >
                <User className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer text-xs md:text-sm">
                <Settings className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer text-xs md:text-sm">
                <LogOut className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      <HeaderSection />
      
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2 md:p-6 space-y-4 md:space-y-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] md:min-h-[500px] text-center space-y-4 md:space-y-6">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-purple-600 rounded-full flex items-center justify-center">
                  <PlusCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">Welcome to Nexora AI</h2>
                  <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
                    Start a conversation with our AI assistant. Ask questions, request essays, get code help, and more!
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 w-full max-w-md md:max-w-2xl">
                  {[
                    { icon: '📝', text: 'Write an essay', prompt: 'Write an essay about artificial intelligence' },
                    { icon: '💻', text: 'Code assistance', prompt: 'Help me write a React component' },
                    { icon: '🤔', text: 'Ask questions', prompt: 'Explain quantum computing in simple terms' },
                    { icon: '✨', text: 'Creative writing', prompt: 'Write a short story about time travel' }
                  ].map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="p-3 md:p-4 h-auto bg-gray-800 border-gray-700 hover:bg-gray-700 text-left text-xs md:text-sm"
                      onClick={() => setInput(item.prompt)}
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <span className="text-base md:text-lg">{item.icon}</span>
                        <span className="text-gray-300">{item.text}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <Message key={index} message={message} isUser={message.role === 'user'} />
                ))}
                
                {lastResponse && lastResponse.toLowerCase().includes('essay') && (
                  <EssayCanvas 
                    content={lastResponse}
                    onEdit={(newContent) => {
                      const updatedMessages = [...messages];
                      const lastAiMessageIndex = updatedMessages.map(m => m.role).lastIndexOf('assistant');
                      if (lastAiMessageIndex !== -1) {
                        updatedMessages[lastAiMessageIndex].content = newContent;
                        setMessages(updatedMessages);
                        setLastResponse(newContent);
                      }
                    }}
                  />
                )}
                
                {(lastResponse && (lastResponse.includes('```') || lastResponse.toLowerCase().includes('code'))) && (
                  <div className="bg-gray-900 rounded-lg p-3 md:p-4 my-3 border border-gray-700">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <div className="text-xs text-gray-400 font-medium">Code</div>
                      <div className="flex gap-1 md:gap-2">
                        <Button
                          onClick={() => navigator.clipboard.writeText(lastResponse)}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white h-6 md:h-7 px-1 md:px-2 text-xs md:text-sm"
                        >
                          <Code className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded p-2 md:p-3 overflow-x-auto">
                      <pre className="text-xs md:text-sm text-gray-100 whitespace-pre-wrap">
                        <code>{lastResponse}</code>
                      </pre>
                    </div>
                  </div>
                )}
                
                {isLoading && (
                  <div className="flex gap-2 md:gap-4 mb-4 md:mb-6">
                    <Avatar className="w-6 h-6 md:w-8 md:h-8 mt-1">
                      <AvatarFallback className="bg-purple-600 text-white text-xs md:text-sm">AI</AvatarFallback>
                    </Avatar>
                    <Card className="p-2 md:p-4 bg-gray-800 text-gray-100 border-gray-700 max-w-[85%] md:max-w-[80%]">
                      <div className="flex items-center gap-1 md:gap-2">
                        <div className="flex space-x-1">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-pulse"
                              style={{ animationDelay: `${i * 0.3}s` }}
                            />
                          ))}
                        </div>
                        <span className="text-xs md:text-sm text-gray-400">AI is thinking...</span>
                      </div>
                    </Card>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 p-3 md:p-4 bg-gray-900">
        <form onSubmit={handleSubmit} className="flex gap-2 md:gap-3 max-w-4xl mx-auto">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 text-sm md:text-base h-10 md:h-11"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 h-10 md:h-11 px-3 md:px-4"
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </form>
      </div>

      {showProfile && (
        <UserProfile 
          isOpen={showProfile} 
          onClose={() => setShowProfile(false)} 
          stats={stats}
        />
      )}
    </div>
  );
};

export default ChatInterface;
