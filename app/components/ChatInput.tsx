'use client';

import { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({
  onSendMessage,
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  const handleSend = () => {
    const text = message.trim();
    if (!text || disabled) return;
    onSendMessage(text);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <footer className="p-4 bg-gradient-to-t from-white via-white to-transparent">
      <div className="max-w-3xl mx-auto relative group">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={1}
          placeholder="Message ChatGPT..."
          disabled={disabled}
          className="w-full bg-gray-100 text-gray-900 rounded-2xl py-4 pl-4 pr-14 focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none shadow-2xl transition-all"
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className="absolute right-3 bottom-3 p-2 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-all disabled:opacity-50 disabled:bg-gray-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
          </svg>
        </button>
      </div>
      <p className="text-[10px] text-gray-500 text-center mt-3">
        Built with Next.js & Tailwind CSS
      </p>
    </footer>
  );
}
