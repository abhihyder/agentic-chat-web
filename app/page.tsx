'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Message from './components/Message';
import InputArea from './components/InputArea';
import { Message as MessageType, ChatHistoryItem } from './types/chat';
import { useAuth } from './context/AuthContext';
import { useConversations, useConversationDetail } from './actions/conversation';
import { useSendMessage } from './actions/chat';

// Helper to categorize conversations by date
const getDateCategory = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  if (date >= today) return 'Today';
  if (date >= yesterday) return 'Yesterday';
  if (date >= weekAgo) return 'Previous 7 days';
  return 'Older';
};

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [pendingMessage, setPendingMessage] = useState<MessageType | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations list
  const { 
    data: conversationsList, 
    isLoading: conversationsLoading,
  } = useConversations();

  // Fetch active conversation detail
  const { 
    data: activeConversation, 
    isLoading: conversationDetailLoading 
  } = useConversationDetail(activeChatId);

  // Send message mutation
  const sendMessageMutation = useSendMessage();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Convert API messages to local format
  const messages: MessageType[] = useMemo(() => {
    const apiMessages = activeConversation?.messages?.map(msg => ({
      id: msg.id.toString(),
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      timestamp: new Date(msg.created_at),
    })) || [];
    
    // Add pending message if exists
    if (pendingMessage) {
      return [...apiMessages, pendingMessage];
    }
    return apiMessages;
  }, [activeConversation?.messages, pendingMessage]);

  // Convert conversations list to chat history format
  const chatHistory: ChatHistoryItem[] = useMemo(() => {
    return (conversationsList || []).map(conv => ({
      id: conv.id.toString(),
      title: conv.title || 'New conversation',
      date: getDateCategory(conv.updated_at || conv.created_at),
    }));
  }, [conversationsList]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex h-screen w-full bg-[var(--background)] items-center justify-center">
        <div className="animate-spin">
          <Sparkles size={48} className="text-emerald-600" />
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  const handleSend = async (text: string) => {
    // Add optimistic user message
    const userMessage: MessageType = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
    };
    setPendingMessage(userMessage);

    try {
      const response = await sendMessageMutation.mutateAsync({
        message: text,
        conversation_id: activeChatId,
      });

      // If this was a new conversation, set the active chat ID
      if (!activeChatId && response.conversation_id) {
        setActiveChatId(response.conversation_id);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setPendingMessage(null);
    }
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setPendingMessage(null);
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(parseInt(id, 10));
    setPendingMessage(null);
  };

  const isLoading = sendMessageMutation.isPending || conversationDetailLoading;

  return (
    <div className="flex h-screen w-full bg-[var(--background)] text-[var(--foreground)] overflow-hidden transition-colors">
      <Sidebar 
        chatHistory={chatHistory}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        activeChatId={activeChatId?.toString() || null}
        isLoading={conversationsLoading}
      />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {messages.length === 0 && !activeChatId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="w-12 h-12 rounded-full bg-[var(--hover-bg)] flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-[var(--foreground-muted)]" />
            </div>
            <h1 className="text-2xl font-semibold mb-8">How can I help you today?</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-3xl">
              {[
                "Help me write a Python script",
                "Explain quantum computing simply",
                "Suggest a 3-day trip to Tokyo",
                "Write a polite email to my boss"
              ].map((suggestion, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(suggestion)}
                  className="p-4 rounded-xl border border-[var(--border)] hover:bg-[var(--hover-bg)] transition-colors text-left text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="pb-40 w-full max-w-4xl mx-auto mt-10">
              {conversationDetailLoading && activeChatId ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin">
                    <Sparkles size={24} className="text-emerald-600" />
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <Message key={msg.id} role={msg.role} content={msg.content} />
                  ))}
                  {sendMessageMutation.isPending && (
                    <Message role="assistant" content="" isLoading />
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[var(--background)] via-[var(--background)] to-transparent pt-10">
          <InputArea onSend={handleSend} disabled={isLoading} />
        </div>
      </main>
    </div>
  );
}
