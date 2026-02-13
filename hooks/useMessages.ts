import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase/client';
import { UserProfile } from '../types';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  // Joined data
  sender?: { full_name: string; email: string };
  receiver?: { full_name: string; email: string };
}

export interface Conversation {
  conversation_id: string;
  other_user_id: string;
  other_user_name: string;
  other_user_email: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

export function useMessages(currentUser: UserProfile | null) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all conversations for the current user
  const fetchConversations = useCallback(async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      // Get all messages where user is sender or receiver
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          conversation_id,
          sender_id,
          receiver_id,
          content,
          read,
          created_at,
          sender:profiles!messages_sender_id_fkey(full_name, email),
          receiver:profiles!messages_receiver_id_fkey(full_name, email)
        `)
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by conversation_id
      const convMap = new Map<string, {
        messages: any[];
        otherUserId: string;
        otherUserName: string;
        otherUserEmail: string;
      }>();

      (data || []).forEach((msg: any) => {
        const isMe = msg.sender_id === currentUser.id;
        const otherUserId = isMe ? msg.receiver_id : msg.sender_id;
        const otherUser = isMe ? msg.receiver : msg.sender;

        if (!convMap.has(msg.conversation_id)) {
          convMap.set(msg.conversation_id, {
            messages: [],
            otherUserId,
            otherUserName: otherUser?.full_name || otherUser?.email || 'Unknown',
            otherUserEmail: otherUser?.email || '',
          });
        }
        convMap.get(msg.conversation_id)!.messages.push(msg);
      });

      const convList: Conversation[] = [];
      convMap.forEach((value, convId) => {
        const latest = value.messages[0]; // Already sorted desc
        const unread = value.messages.filter(
          (m: any) => m.receiver_id === currentUser.id && !m.read
        ).length;

        convList.push({
          conversation_id: convId,
          other_user_id: value.otherUserId,
          other_user_name: value.otherUserName,
          other_user_email: value.otherUserEmail,
          last_message: latest.content,
          last_message_time: latest.created_at,
          unread_count: unread,
        });
      });

      // Sort by most recent
      convList.sort((a, b) => new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime());
      setConversations(convList);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch messages for a specific conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!currentUser) return;
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark unread messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .eq('receiver_id', currentUser.id)
        .eq('read', false);

    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  }, [currentUser]);

  // Send a message
  const sendMessage = useCallback(async (receiverId: string, content: string, conversationId?: string) => {
    if (!currentUser) return null;
    const convId = conversationId || crypto.randomUUID();

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: convId,
          sender_id: currentUser.id,
          receiver_id: receiverId,
          content,
          read: false,
        })
        .select()
        .single();

      if (error) throw error;

      // Optimistic update
      if (data) {
        setMessages(prev => [...prev, data]);
      }

      return { conversationId: convId, message: data };
    } catch (err) {
      console.error('Failed to send message:', err);
      return null;
    }
  }, [currentUser]);

  // Delete a conversation (all messages)
  const deleteConversation = useCallback(async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId);

      if (error) throw error;
      setConversations(prev => prev.filter(c => c.conversation_id !== conversationId));
      if (activeConversation === conversationId) {
        setActiveConversation(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  }, [activeConversation]);

  // Set active conversation and load its messages
  const openConversation = useCallback((conversationId: string) => {
    setActiveConversation(conversationId);
    fetchMessages(conversationId);
  }, [fetchMessages]);

  // Real-time subscription
  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase
      .channel('messages-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${currentUser.id}`,
      }, (payload) => {
        const newMsg = payload.new as Message;
        // If we're in this conversation, add immediately
        if (newMsg.conversation_id === activeConversation) {
          setMessages(prev => [...prev, newMsg]);
          // Auto-mark as read
          supabase.from('messages').update({ read: true }).eq('id', newMsg.id);
        }
        // Refresh conversation list
        fetchConversations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, activeConversation, fetchConversations]);

  // Initial fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    messages,
    activeConversation,
    loading,
    openConversation,
    sendMessage,
    deleteConversation,
    refresh: fetchConversations,
  };
}
