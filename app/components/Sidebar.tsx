'use client';

import { MessageSquare, Plus } from 'lucide-react';
import { ChatHistoryItem } from '../types/chat';

interface SidebarProps {
  chatHistory: ChatHistoryItem[];
  onNewChat: () => void;
  onSelectChat?: (id: string) => void;
  activeChatId?: string | null;
}

export default function Sidebar({
  chatHistory,
  onNewChat,
  onSelectChat,
  activeChatId,
}: SidebarProps) {
  const todayChats = chatHistory.filter(h => h.date === 'Today');
  const yesterdayChats = chatHistory.filter(h => h.date === 'Yesterday');
  const previousChats = chatHistory.filter(h => h.date === 'Previous 7 days');

  return (
    <div className="w-[260px] h-full bg-[#171717] flex flex-col border-r border-white/10">
      <div className="p-3">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium border border-white/10"
        >
          <Plus size={16} />
          New chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-6 mt-2">
        {todayChats.length > 0 && (
          <div>
            <h3 className="px-3 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Today</h3>
            {todayChats.map(item => (
              <button 
                key={item.id} 
                onClick={() => onSelectChat?.(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm truncate group flex items-center gap-2 ${
                  activeChatId === item.id ? 'bg-white/5' : ''
                }`}
              >
                <MessageSquare size={14} className="shrink-0 opacity-60" />
                <span className="truncate">{item.title}</span>
              </button>
            ))}
          </div>
        )}

        {yesterdayChats.length > 0 && (
          <div>
            <h3 className="px-3 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Yesterday</h3>
            {yesterdayChats.map(item => (
              <button 
                key={item.id}
                onClick={() => onSelectChat?.(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm truncate group flex items-center gap-2 ${
                  activeChatId === item.id ? 'bg-white/5' : ''
                }`}
              >
                <MessageSquare size={14} className="shrink-0 opacity-60" />
                <span className="truncate">{item.title}</span>
              </button>
            ))}
          </div>
        )}

        {previousChats.length > 0 && (
          <div>
            <h3 className="px-3 text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Previous 7 days</h3>
            {previousChats.map(item => (
              <button 
                key={item.id}
                onClick={() => onSelectChat?.(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm truncate group flex items-center gap-2 ${
                  activeChatId === item.id ? 'bg-white/5' : ''
                }`}
              >
                <MessageSquare size={14} className="shrink-0 opacity-60" />
                <span className="truncate">{item.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm">
          <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] font-bold">JD</div>
          John Doe
        </button>
      </div>
    </div>
  );
}
