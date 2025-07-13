import { useState, useEffect } from 'react';

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  reasoning?: string;
  timestamp: Date;
};

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
  updated_at: string;
};

export const useLocalConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('nexora_conversations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        const conversationsWithDates = parsed.map((conv: any) => ({
          ...conv,
          timestamp: new Date(conv.timestamp),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setConversations(conversationsWithDates);
      } catch (error) {
        console.error('Error loading conversations from localStorage:', error);
      }
    }
  }, []);

  // Save conversations to localStorage whenever they change
  const saveConversations = (newConversations: Conversation[]) => {
    try {
      localStorage.setItem('nexora_conversations', JSON.stringify(newConversations));
      setConversations(newConversations);
    } catch (error) {
      console.error('Error saving conversations to localStorage:', error);
    }
  };

  const createConversation = (title: string = 'New Conversation') => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title,
      messages: [],
      timestamp: new Date(),
      updated_at: new Date().toISOString(),
    };

    const updatedConversations = [newConversation, ...conversations];
    saveConversations(updatedConversations);
    return newConversation;
  };

  const addMessage = (conversationId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          updated_at: new Date().toISOString(),
        };
      }
      return conv;
    });

    saveConversations(updatedConversations);
    return newMessage;
  };

  const deleteConversation = (conversationId: string) => {
    const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
    saveConversations(updatedConversations);
  };

  const fetchConversations = () => {
    // This is now handled by useEffect, but keeping for compatibility
    return Promise.resolve();
  };

  return {
    conversations,
    loading,
    createConversation,
    addMessage,
    deleteConversation,
    refetch: fetchConversations,
  };
};
