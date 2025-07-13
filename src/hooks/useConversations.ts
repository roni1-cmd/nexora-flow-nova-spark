
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Conversation = Database['public']['Tables']['conversations']['Row'] & {
  messages: Database['public']['Tables']['messages']['Row'][];
};

type Message = Database['public']['Tables']['messages']['Row'];

export const useConversations = (userId: string | undefined) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConversations = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Set Firebase user ID in the JWT claims for RLS
      await supabase.rpc('set_claim', { 
        uid: userId, 
        claim: 'sub', 
        value: userId 
      }).catch(() => {
        // Fallback: set the user context manually
        supabase.auth.getSession().then(() => {
          // This ensures the session is properly set
        });
      });

      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select(`
          *,
          messages (*)
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (conversationsError) throw conversationsError;
      setConversations(conversationsData || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const createConversation = async (title: string = 'New Conversation') => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: userId,
          title,
        })
        .select()
        .single();

      if (error) throw error;
      
      const newConversation = { ...data, messages: [] };
      setConversations(prev => [newConversation, ...prev]);
      return newConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    }
  };

  const addMessage = async (conversationId: string, message: Omit<Message, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          ...message,
        })
        .select()
        .single();

      if (error) throw error;

      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, messages: [...conv.messages, data] }
          : conv
      ));

      // Update conversation's updated_at timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return data;
    } catch (error) {
      console.error('Error adding message:', error);
      return null;
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;
      
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [userId]);

  return {
    conversations,
    loading,
    createConversation,
    addMessage,
    deleteConversation,
    refetch: fetchConversations,
  };
};
