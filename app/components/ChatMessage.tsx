'use client';

import { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex gap-4 items-start">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">
          YOU
        </div>
        <div className="space-y-1 flex-1">
          <p className="font-bold text-sm text-gray-900">You</p>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 items-start bg-gray-100 p-5 rounded-3xl">
      <div className="w-8 h-8 rounded-full bg-emerald-600 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white">
        AI
      </div>
      <div className="space-y-4 flex-1">
        <p className="font-bold text-sm text-gray-900">ChatGPT</p>
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    </div>
  );
}
