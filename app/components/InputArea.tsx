'use client';

import { useState, KeyboardEvent, FormEvent } from 'react';
import { ArrowUp, Paperclip, Search, Image as ImageIcon } from 'lucide-react';

interface InputAreaProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function InputArea({ onSend, disabled }: InputAreaProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6 pt-2">
      <form 
        onSubmit={handleSubmit}
        className="relative flex flex-col w-full bg-[#2f2f2f] rounded-2xl border border-white/10 focus-within:border-white/20 transition-colors"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message ChatGPT"
          rows={1}
          disabled={disabled}
          className="w-full bg-transparent border-none focus:ring-0 focus:outline-none resize-none py-4 pl-4 pr-12 text-white placeholder-white/40 max-h-[200px] custom-scrollbar"
          style={{ height: 'auto', minHeight: '56px' }}
        />
        
        <div className="flex items-center justify-between px-2 pb-2">
          <div className="flex items-center gap-1">
            <button type="button" className="p-2 rounded-lg hover:bg-white/5 text-white/40 transition-colors">
              <Paperclip size={18} />
            </button>
            <button type="button" className="p-2 rounded-lg hover:bg-white/5 text-white/40 transition-colors">
              <Search size={18} />
            </button>
            <button type="button" className="p-2 rounded-lg hover:bg-white/5 text-white/40 transition-colors">
              <ImageIcon size={18} />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className={`p-2 rounded-xl transition-all ${
              input.trim() && !disabled
                ? 'bg-white text-black hover:bg-white/90' 
                : 'bg-white/10 text-white/20'
            }`}
          >
            <ArrowUp size={20} strokeWidth={3} />
          </button>
        </div>
      </form>
      <p className="text-[11px] text-white/40 text-center mt-3">
        ChatGPT can make mistakes. Check important info.
      </p>
    </div>
  );
}
