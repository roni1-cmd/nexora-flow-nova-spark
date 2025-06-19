
import React, { useState, useRef, useEffect } from 'react';
import { Send, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}

const MODELS = [
  { id: 'accounts/fireworks/models/qwen3-30b-a3b', name: 'nexora PetalFlow' },
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

    // Check if it's an image generation request (more flexible detection)
    const isImageRequest = /\b(generate|create|make|draw|show|design|produce)\b.*\b(image|picture|photo|art|illustration|drawing)\b/i.test(input);

    if (isImageRequest) {
      setIsGeneratingImage(true);
      await generateImage(input);
      return;
    }

    setIsLoading(true);

    try {
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
      const cleanPrompt = prompt.replace(/\b(generate|create|make|draw|show|design|produce)\b.*\b(image|picture|photo|art|illustration|drawing)\b/gi, '').trim();
      
      const response = await fetch('https://api.fireworks.ai/inference/v1/workflows/accounts/fireworks/models/flux-1-schnell-fp8/text_to_image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: cleanPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      // Handle binary response for image
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
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-black">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className={`relative ${isGeneratingImage ? 'animate-spin' : ''}`}>
              <img 
                src="/lovable-uploads/ae2c56ce-3b9e-4596-bd03-b70dd5af1d5e.png" 
                alt="nexora" 
                className="w-8 h-8"
              />
              {isGeneratingImage && (
                <div className="absolute inset-0 border-2 border-transparent border-t-pink-500 rounded-full animate-spin"></div>
              )}
            </div>
            <span className="text-xl font-medium text-white">nexora</span>
          </div>
          
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger className="w-64 bg-black border-gray-700 text-white focus:ring-0 focus:border-gray-700">
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
          
          {isGeneratingImage && (
            <span className="text-sm text-gray-400 italic">Generating an image, please wait</span>
          )}
        </div>
      </div>

      {/* Messages or Initial State */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-light text-white mb-8">What do you want to know?</h1>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 relative">
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
                        {message.content}
                      </div>
                      {message.imageUrl && (
                        <div className="mt-3">
                          <img 
                            src={message.imageUrl} 
                            alt="Generated" 
                            className="max-w-sm rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => downloadImage(message.imageUrl!)}
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
            </div>
            {/* Fade effect for scrolling */}
            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black to-transparent pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="px-4 pb-4 bg-black">
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
          <div className="flex items-center space-x-3 bg-black rounded-full px-4 py-3 border border-gray-700">
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
              className="flex-1 bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 focus:outline-none"
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
    </div>
  );
};
