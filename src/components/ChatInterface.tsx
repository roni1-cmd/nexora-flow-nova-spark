
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, User, Copy, Check, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast"

import { AuthModal } from './AuthModal';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatInterface = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const copyTimeout = useRef<NodeJS.Timeout>();
  const [isCopied, setIsCopied] = useState(false);
  const [user, setUser] = useState<any>(null); // Replace with actual user state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const MAX_PROMPTS_WITHOUT_AUTH = 5;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Scroll to the bottom when messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopyClick = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);

    copyTimeout.current = setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    // Check if user is not authenticated and has reached the limit
    if (!user && promptCount >= MAX_PROMPTS_WITHOUT_AUTH) {
      setShowAuthModal(true);
      return;
    }

    // Show warning toast when user has 1 prompt left
    if (!user && promptCount === MAX_PROMPTS_WITHOUT_AUTH - 1) {
      toast({
        title: "Almost at limit",
        description: "You have 1 prompt left. Please log in to continue using the app.",
        variant: "destructive",
      });
    }

    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Increment prompt count for non-authenticated users
    if (!user) {
      setPromptCount(prev => prev + 1);
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get response from API",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    // TODO: Implement actual login logic
    console.log('Login:', email, password);
    // Reset prompt count on successful login
    setPromptCount(0);
  };

  const handleSignup = async (email: string, password: string, name: string) => {
    // TODO: Implement actual signup logic
    console.log('Signup:', email, password, name);
    // Reset prompt count on successful signup
    setPromptCount(0);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Card className="w-full border-0 bg-transparent shadow-none">
        <CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
          <MessageSquare className="mr-2 h-4 w-4" />
          <CardTitle className="text-md font-medium">Talk to the void</CardTitle>
          <div className="ml-auto text-sm text-muted-foreground">
            {!user && (
              <>
                {promptCount}/{MAX_PROMPTS_WITHOUT_AUTH} prompts left
              </>
            )}
          </div>
        </CardHeader>
      </Card>

      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start">
              {message.role === 'user' ? (
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="h-8 w-8 mr-3 bg-secondary text-secondary-foreground">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1">
                <div className="rounded-md p-3 text-sm w-full">
                  <p className="break-words">{message.content}</p>
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                  {message.role === 'assistant' && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-secondary/50"
                      onClick={() => handleCopyClick(message.content)}
                      disabled={isCopied}
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  <div>{message.timestamp.toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-primary/40 p-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            className="flex-1 rounded-md"
          />
          <Button onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />
    </div>
  );
};

export default ChatInterface;
