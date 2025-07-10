
"use client";

/**
 * @author: @kokonutui
 * @description: AI Prompt Input
 * @version: 1.0.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { ArrowRight, Bot, Check, ChevronDown, Paperclip } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion, AnimatePresence } from "framer-motion";

const OPENAI_SVG = (
    <div>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="256"
            height="260"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 260"
            aria-label="o3-mini icon"
            className="dark:hidden block"
        >
            <title>OpenAI Icon Light</title>
            
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="256"
            height="260"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 260"
            aria-label="o3-mini icon"
            className="hidden dark:block"
        >
            <title>OpenAI Icon Dark</title>
           
        </svg>
    </div>
);

interface AIPromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSendMessage: () => void;
  onImageUpload: (file: File) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  models: Array<{ id: string; name: string }>;
  disabled?: boolean;
  uploadedImage?: string | null;
  onRemoveImage?: () => void;
}

export default function AIPromptInput({
  value,
  onChange,
  onSendMessage,
  onImageUpload,
  selectedModel,
  onModelChange,
  models,
  disabled = false,
  uploadedImage,
  onRemoveImage
}: AIPromptInputProps) {
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 72,
        maxHeight: 300,
    });

    const MODEL_ICONS: Record<string, React.ReactNode> = {
        "gemma2-9b-it": (
            <svg
                height="1em"
                style={{ flex: "none", lineHeight: "1" }}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <title>Gemini</title>
                <defs>
                    <linearGradient
                        id="lobe-icons-gemini-fill"
                        x1="0%"
                        x2="68.73%"
                        y1="100%"
                        y2="30.395%"
                    >
                        <stop offset="0%" stopColor="#1C7DFF" />
                        <stop offset="52.021%" stopColor="#1C69FF" />
                        <stop offset="100%" stopColor="#F0DCD6" />
                    </linearGradient>
                </defs>
                <path
                    d="M12 24A14.304 14.304 0 000 12 14.304 14.304 0 0012 0a14.305 14.305 0 0012 12 14.305 14.305 0 00-12 12"
                    fill="url(#lobe-icons-gemini-fill)"
                    fillRule="nonzero"
                />
            </svg>
        ),
        "llama-3.1-8b-instant": OPENAI_SVG,
        "llama-3.3-70b-versatile": OPENAI_SVG,
        "mistral-saba-24b": OPENAI_SVG,
        "qwen-qwq-32b": OPENAI_SVG,
    };

    const getModelDisplayName = (modelId: string) => {
        const model = models.find(m => m.id === modelId);
        return model ? model.name : modelId;
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
            adjustHeight(true);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageUpload(file);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto py-4">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl p-1.5 pt-4">
                <div className="relative">
                    <div className="relative flex flex-col">
                        {uploadedImage && (
                            <div className="px-4 pb-2">
                                <div className="relative inline-block">
                                    <img 
                                        src={uploadedImage} 
                                        alt="Uploaded" 
                                        className="max-w-32 max-h-32 rounded-lg"
                                    />
                                    {onRemoveImage && (
                                        <button
                                            onClick={onRemoveImage}
                                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        <div
                            className="overflow-y-auto"
                            style={{ maxHeight: "400px" }}
                        >
                            <Textarea
                                id="ai-input-15"
                                value={value}
                                placeholder={"What can I do for you?"}
                                className={cn(
                                    "w-full rounded-xl rounded-b-none px-4 py-3 bg-gray-800 border-none text-white placeholder:text-gray-400 resize-none focus-visible:ring-0 focus-visible:ring-offset-0",
                                    "min-h-[72px]"
                                )}
                                ref={textareaRef}
                                onKeyDown={handleKeyDown}
                                onChange={(e) => {
                                    onChange(e.target.value);
                                    adjustHeight();
                                }}
                                disabled={disabled}
                            />
                        </div>

                        <div className="h-14 bg-gray-800 rounded-b-xl flex items-center">
                            <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between w-[calc(100%-24px)]">
                                <div className="flex items-center gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="flex items-center gap-1 h-8 pl-1 pr-2 text-xs rounded-md text-white hover:bg-gray-700 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
                                                disabled={disabled}
                                            >
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={selectedModel}
                                                        initial={{
                                                            opacity: 0,
                                                            y: -5,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            y: 5,
                                                        }}
                                                        transition={{
                                                            duration: 0.15,
                                                        }}
                                                        className="flex items-center gap-1"
                                                    >
                                                        {MODEL_ICONS[selectedModel] || <Bot className="w-4 h-4 opacity-50" />}
                                                        {getModelDisplayName(selectedModel)}
                                                        <ChevronDown className="w-3 h-3 opacity-50" />
                                                    </motion.div>
                                                </AnimatePresence>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            className={cn(
                                                "min-w-[10rem]",
                                                "border-gray-700",
                                                "bg-gray-900"
                                            )}
                                        >
                                            {models.map((model) => (
                                                <DropdownMenuItem
                                                    key={model.id}
                                                    onSelect={() => onModelChange(model.id)}
                                                    className="flex items-center justify-between gap-2 text-white hover:bg-gray-800"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {MODEL_ICONS[model.id] || <Bot className="w-4 h-4 opacity-50" />}
                                                        <span>{model.name}</span>
                                                    </div>
                                                    {selectedModel === model.id && (
                                                        <Check className="w-4 h-4 text-blue-500" />
                                                    )}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <div className="h-4 w-px bg-gray-600 mx-0.5" />
                                    <label
                                        className={cn(
                                            "rounded-lg p-2 bg-gray-700 cursor-pointer",
                                            "hover:bg-gray-600 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
                                            "text-gray-400 hover:text-white",
                                            disabled && "opacity-50 cursor-not-allowed"
                                        )}
                                        aria-label="Attach file"
                                    >
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            disabled={disabled}
                                        />
                                        <Paperclip className="w-4 h-4 transition-colors" />
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    className={cn(
                                        "rounded-lg p-2 bg-gray-700",
                                        "hover:bg-gray-600 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
                                        disabled && "opacity-50 cursor-not-allowed"
                                    )}
                                    aria-label="Send message"
                                    disabled={!value.trim() || disabled}
                                    onClick={onSendMessage}
                                >
                                    <ArrowRight
                                        className={cn(
                                            "w-4 h-4 text-white transition-opacity duration-200",
                                            value.trim() && !disabled
                                                ? "opacity-100"
                                                : "opacity-30"
                                        )}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
