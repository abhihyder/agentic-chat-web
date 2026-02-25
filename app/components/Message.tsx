'use client';

import { User, Sparkles, Copy, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function Message({ role, content }: MessageProps) {
  const isAssistant = role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
  };

  return (
    <div className={`w-full pb-6 flex ${isAssistant ? 'justify-start' : 'justify-end'} bg-transparent`}>
      <div className={`max-w-3xl px-4 flex gap-4 md:gap-6 group ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isAssistant ? 'bg-emerald-600' : 'bg-[var(--hover-bg)]'}`}>
          {isAssistant ? <Sparkles size={18} className="text-white" /> : <User size={18} className="text-[var(--foreground-muted)]" />}
        </div>
        
        <div className={`space-y-2 overflow-hidden ${isAssistant ? 'text-left' : 'text-right'}`}>
          <div className="font-semibold text-sm">
            {isAssistant ? 'ChatGPT' : 'You'}
          </div>
          <div className={`text-[var(--foreground)] opacity-90 leading-relaxed whitespace-pre-wrap break-words ${isAssistant ? 'text-left' : 'text-right'}`}>
            {content}
          </div>
          
          {isAssistant && (
            <div className="flex items-center gap-2 pt-2 ">
              <button 
                onClick={handleCopy}
                className="p-1.5 rounded-md hover:bg-[var(--hover-bg)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              >
                <Copy size={14} />
              </button>
              <button className="p-1.5 rounded-md hover:bg-[var(--hover-bg)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                <ThumbsUp size={14} />
              </button>
              <button className="p-1.5 rounded-md hover:bg-[var(--hover-bg)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                <ThumbsDown size={14} />
              </button>
              <button className="p-1.5 rounded-md hover:bg-[var(--hover-bg)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                <RotateCcw size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
