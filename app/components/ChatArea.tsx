'use client';

import { useRef, useEffect } from 'react';
import { Message } from '../types/chat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  onToggleSidebar: () => void;
}

export default function ChatArea({
  messages,
  onSendMessage,
  isLoading = false,
  onToggleSidebar,
}: ChatAreaProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <main className="flex-1 flex flex-col relative h-full bg-white">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-2 font-semibold text-lg px-4 text-gray-900">
          ChatGPT <span className="text-gray-500 font-normal">4o</span>
        </div>
      </header>

      {/* Messages */}
      <div
        id="chat-container"
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 md:px-0"
      >
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div id="messages" className="max-w-3xl mx-auto py-8 space-y-10">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && <LoadingIndicator />}
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSendMessage={onSendMessage} disabled={isLoading} />
    </main>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-white mb-4">
        AI
      </div>
      <h1 className="text-xl font-medium text-gray-700">
        How can I help you today?
      </h1>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex gap-4 items-start bg-gray-100 p-5 rounded-3xl animate-pulse">
      <div className="w-8 h-8 rounded-full bg-emerald-600 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">
        AI
      </div>
      <div className="space-y-4 flex-1">
        <p className="font-bold text-sm text-gray-900">ChatGPT</p>
        <div className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>
          <span className="inline-block w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:150ms]"></span>
          <span className="inline-block w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:300ms]"></span>
        </div>
      </div>
    </div>
  );
}
