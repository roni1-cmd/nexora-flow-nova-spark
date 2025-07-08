
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
import { useState, useRef } from "react";
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

const NEXORA_SVG = (
    <div>
        <img 
            src="/Nexora.png" 
            alt="Nexora" 
            className="w-4 h-4"
        />
    </div>
);

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
    const fileInputRef = useRef<HTMLInputElement>(null);

    const MODEL_ICONS: Record<string, React.ReactNode> = {
        "accounts/fireworks/models/qwen2p5-72b-instruct": NEXORA_SVG,
        "accounts/fireworks/models/llama4-maverick-instruct-basic": NEXORA_SVG,
        "accounts/fireworks/models/llama-v3p1-8b-instruct": NEXORA_SVG,
        "accounts/fireworks/models/deepseek-r1-basic": NEXORA_SVG,
        "accounts/sentientfoundation-serverless/models/dobby-mini-unhinged-plus-llama-3-1-8b": NEXORA_SVG,
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
            adjustHeight(true);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageUpload(file);
        }
    };

    const getModelDisplayName = (modelId: string) => {
        return models.find(m => m.id === modelId)?.name || modelId;
    };

    return (
        <div className="w-full py-4 font-google-sans">
            <div className="bg-white/10 dark:bg-white/10 rounded-2xl p-1.5 border border-white/20">
                <div className="relative">
                    <div className="relative flex flex-col">
                        {uploadedImage && (
                            <div className="mb-3 mx-4 flex items-center space-x-2">
                                <img src={uploadedImage} alt="Preview" className="w-10 h-10 md:w-12 md:h-12 rounded object-cover" />
                                <Button
                                    onClick={onRemoveImage}
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-400 hover:text-red-300 hover:bg-gray-900 text-xs md:text-sm"
                                >
                                    Remove
                                </Button>
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
                                    "w-full rounded-xl rounded-b-none px-4 py-3 bg-white/5 border-none text-white placeholder:text-white/70 resize-none focus-visible:ring-0 focus-visible:ring-offset-0",
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

                        <div className="h-14 bg-white/5 rounded-b-xl flex items-center">
                            <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between w-[calc(100%-24px)]">
                                <div className="flex items-center gap-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="flex items-center gap-1 h-8 pl-1 pr-2 text-xs rounded-md text-white hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
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
                                                "border-white/20 bg-gray-900 text-white z-50"
                                            )}
                                        >
                                            {models.map((model) => (
                                                <DropdownMenuItem
                                                    key={model.id}
                                                    onSelect={() => onModelChange(model.id)}
                                                    className="flex items-center justify-between gap-2 text-white hover:bg-white/10"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {MODEL_ICONS[model.id] || (
                                                            <Bot className="w-4 h-4 opacity-50" />
                                                        )}
                                                        <span>{model.name}</span>
                                                    </div>
                                                    {selectedModel === model.id && (
                                                        <Check className="w-4 h-4 text-blue-500" />
                                                    )}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <div className="h-4 w-px bg-white/20 mx-0.5" />
                                    <label
                                        className={cn(
                                            "rounded-lg p-2 bg-white/5 cursor-pointer",
                                            "hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500",
                                            "text-white/60 hover:text-white"
                                        )}
                                        aria-label="Attach file"
                                    >
                                        <input 
                                            ref={fileInputRef}
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <Paperclip className="w-4 h-4 transition-colors" />
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    className={cn(
                                        "rounded-lg p-2 bg-white/5",
                                        "hover:bg-white/10 focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-blue-500"
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
