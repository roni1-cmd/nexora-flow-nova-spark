
import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  isTyping?: boolean;
}

const MODELS = [
  { id: 'accounts/fireworks/models/llama4-scout-instruct-basic', name: 'nexora PetalFlow' },
  { id: 'accounts/fireworks/models/llama4-maverick-instruct-basic', name: 'nexora Casanova Scout' },
  { id: 'accounts/fireworks/models/llama-v3p1-8b-instruct', name: 'nexora Lip Instruct' },
  { id: 'accounts/fireworks/models/deepseek-r1-basic', name: 'nexora Fluxborn Adaptive' },
  { id: 'accounts/sentientfoundation-serverless/models/dobby-mini-unhinged-plus-llama-3-1-8b', name: 'nexora-X RogueMini 8B' },
];

const API_KEY = 'fw_3ZWXAxAD6BWE4pgQkvkAqem3';

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() && !uploadedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      imageUrl: uploadedImage || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setUploadedImage(null);
    setIsLoading(true);

    try {
      // Check if it's an image generation request
      if (input.toLowerCase().includes('generate image') || input.toLowerCase().includes('create image')) {
        await generateImage(input);
        return;
      }

      // Use image recognition model if image is uploaded
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
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.choices[0].message.content,
        isTyping: true,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Simulate typewriter effect
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === assistantMessage.id 
              ? { ...msg, isTyping: false }
              : msg
          )
        );
      }, 2000);

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
    setIsGeneratingImage(true);
    
    try {
      const response = await fetch('https://api.fireworks.ai/inference/v1/workflows/accounts/fireworks/models/flux-1-schnell-fp8/text_to_image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.replace(/generate image|create image/gi, '').trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Here\'s the generated image:',
        imageUrl: data.images[0].url,
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

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <div className={`text-2xl font-bold gradient-text ${isGeneratingImage ? 'loading-border' : ''}`}>
            Nexora
          </div>
          {isGeneratingImage && (
            <span className="text-sm text-gray-400 italic">Generating an image, please wait</span>
          )}
        </div>
        
        <Select value={selectedModel} onValueChange={setSelectedModel}>
          <SelectTrigger className="w-64 bg-gray-900 border-gray-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            {MODELS.map((model) => (
              <SelectItem key={model.id} value={model.id} className="text-white hover:bg-gray-800">
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <Card key={message.id} className={`p-4 ${
              message.role === 'user' 
                ? 'bg-gray-900 border-gray-700 ml-12' 
                : 'bg-gray-800 border-gray-600 mr-12'
            }`}>
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                }`}>
                  {message.role === 'user' ? 'U' : 'N'}
                </div>
                <div className="flex-1">
                  {message.imageUrl && message.role === 'user' && (
                    <img 
                      src={message.imageUrl} 
                      alt="Uploaded" 
                      className="max-w-sm rounded-lg mb-2"
                    />
                  )}
                  <div className={`text-gray-100 ${
                    message.isTyping ? 'typewriter cursor' : ''
                  }`}>
                    {message.content}
                  </div>
                  {message.imageUrl && message.role === 'assistant' && (
                    <div className="mt-2">
                      <img 
                        src={message.imageUrl} 
                        alt="Generated" 
                        className="max-w-sm rounded-lg"
                      />
                      <Button
                        onClick={() => downloadImage(message.imageUrl!)}
                        variant="outline"
                        size="sm"
                        className="mt-2 bg-gray-700 border-gray-600 hover:bg-gray-600"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
          {isLoading && (
            <Card className="p-4 bg-gray-800 border-gray-600 mr-12">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white flex items-center justify-center text-sm font-semibold">
                  N
                </div>
                <div className="flex-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          {uploadedImage && (
            <div className="mb-2">
              <img src={uploadedImage} alt="Preview" className="max-w-xs rounded-lg" />
              <Button
                onClick={() => setUploadedImage(null)}
                variant="ghost"
                size="sm"
                className="ml-2 text-red-400 hover:text-red-300"
              >
                Remove
              </Button>
            </div>
          )}
          <div className="flex space-x-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              size="icon"
              className="bg-gray-900 border-gray-700 hover:bg-gray-800"
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
              placeholder="Type your message..."
              className="flex-1 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
              disabled={isLoading || isGeneratingImage}
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || isGeneratingImage || (!input.trim() && !uploadedImage)}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            Nexora AI • Send a message to start chatting • Type "generate image [description]" to create images
          </div>
        </div>
      </div>
    </div>
  );
};
