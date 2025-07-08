"use client";

/**
 * @author: @Leo
 * @description: Chat Interface
 * @version: 1.0.0
 * @date: 2023-05-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from 'uuid';
import AIPromptInput from "@/components/AIPromptInput";
import AITextLoading from "@/components/AITextLoading";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    image?: string | null;
}

const initialMessages: Message[] = [{
    id: uuidv4(),
    role: "assistant",
    content: "Hello! How can I help you today?",
}];

const initialModels = [
    {
        id: "accounts/fireworks/models/qwen2p5-72b-instruct",
        name: "Qwen 72B",
    },
    {
        id: "accounts/fireworks/models/llama4-maverick-instruct-basic",
        name: "Llama Maverick",
    },
    {
        id: "accounts/fireworks/models/llama-v3p1-8b-instruct",
        name: "Llama 8B",
    },
    {
        id: "accounts/fireworks/models/deepseek-r1-basic",
        name: "Deepseek",
    },
    {
        id: "accounts/sentientfoundation-serverless/models/dobby-mini-unhinged-plus-llama-3-1-8b",
        name: "Dobby Mini",
    },
];

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState(initialModels[0].id);
    const [models, setModels] = useState(initialModels);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    const handleSendMessage = useCallback(async () => {
        if (!inputValue.trim()) return;

        setIsLoading(true);
        const userMessage: Message = {
            id: uuidv4(),
            role: "user",
            content: inputValue,
            image: uploadedImage,
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputValue("");
        setUploadedImage(null);

        try {
            // Simulate AI response delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const aiResponse: Message = {
                id: uuidv4(),
                role: "assistant",
                content: `This is a simulated response for: ${inputValue}`,
            };

            setMessages(prevMessages => [...prevMessages, aiResponse]);
        } catch (error) {
            console.error("Failed to get AI response:", error);
            // Handle error appropriately
        } finally {
            setIsLoading(false);
        }
    }, [inputValue, messages, uploadedImage]);

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setUploadedImage(null);
    };

    return (
        <div className="flex flex-col h-screen bg-black text-white font-google-sans">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div key={index} className="flex flex-col space-y-2">
                        {message.role === "user" ? (
                            <div className="flex flex-row-reverse">
                                <div className="bg-white/10 rounded-2xl px-4 py-2 max-w-[70%]">
                                    <p className="text-white">{message.content}</p>
                                    {message.image && (
                                        <img 
                                            src={message.image} 
                                            alt="User upload" 
                                            className="mt-2 rounded-lg max-w-full h-auto"
                                        />
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex">
                                <div className="bg-white/5 rounded-2xl px-4 py-2 max-w-[70%]">
                                    <p className="text-white">{message.content}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex">
                        <div className="bg-white/5 rounded-2xl px-4 py-2">
                            <AITextLoading />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area - Smooth fade transition */}
            <div className="relative">
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-black pointer-events-none"></div>
                <div className="p-4">
                    <AIPromptInput
                        value={inputValue}
                        onChange={setInputValue}
                        onSendMessage={handleSendMessage}
                        onImageUpload={handleImageUpload}
                        selectedModel={selectedModel}
                        onModelChange={setSelectedModel}
                        models={models}
                        disabled={isLoading}
                        uploadedImage={uploadedImage}
                        onRemoveImage={handleRemoveImage}
                    />
                </div>
            </div>
        </div>
    );
}
