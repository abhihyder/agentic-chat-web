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
    <div className="w-full py-6 flex justify-center bg-transparent">
      <div className="max-w-3xl w-full px-4 flex gap-4 md:gap-6 group">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isAssistant ? 'bg-emerald-600' : 'bg-white/10'}`}>
          {isAssistant ? <Sparkles size={18} className="text-white" /> : <User size={18} className="text-white/60" />}
        </div>
        
        <div className="flex-1 space-y-2 overflow-hidden">
          <div className="font-semibold text-sm">
            {isAssistant ? 'ChatGPT' : 'You'}
          </div>
          <div className="text-white/90 leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </div>
          
          {isAssistant && (
            <div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={handleCopy}
                className="p-1.5 rounded-md hover:bg-white/5 text-white/40 hover:text-white/60 transition-colors"
              >
                <Copy size={14} />
              </button>
              <button className="p-1.5 rounded-md hover:bg-white/5 text-white/40 hover:text-white/60 transition-colors">
                <ThumbsUp size={14} />
              </button>
              <button className="p-1.5 rounded-md hover:bg-white/5 text-white/40 hover:text-white/60 transition-colors">
                <ThumbsDown size={14} />
              </button>
              <button className="p-1.5 rounded-md hover:bg-white/5 text-white/40 hover:text-white/60 transition-colors">
                <RotateCcw size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
