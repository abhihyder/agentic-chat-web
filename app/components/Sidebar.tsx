'use client';

import { useState } from 'react';
import { MessageSquare, Plus, Sun, Moon, LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import { ChatHistoryItem } from '../types/chat';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

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
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const todayChats = chatHistory.filter(h => h.date === 'Today');
  const yesterdayChats = chatHistory.filter(h => h.date === 'Yesterday');
  const previousChats = chatHistory.filter(h => h.date === 'Previous 7 days');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="w-[260px] h-full bg-[var(--background-secondary)] flex flex-col border-r border-[var(--border)] transition-colors">
      <div className="p-3">
        <button 
          onClick={onNewChat}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors text-sm font-medium border border-[var(--border)]"
        >
          <Plus size={16} />
          New chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-6 mt-2">
        {todayChats.length > 0 && (
          <div>
            <h3 className="px-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-2">Today</h3>
            {todayChats.map(item => (
              <button 
                key={item.id} 
                onClick={() => onSelectChat?.(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors text-sm truncate group flex items-center gap-2 ${
                  activeChatId === item.id ? 'bg-[var(--active-bg)]' : ''
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
            <h3 className="px-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-2">Yesterday</h3>
            {yesterdayChats.map(item => (
              <button 
                key={item.id}
                onClick={() => onSelectChat?.(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors text-sm truncate group flex items-center gap-2 ${
                  activeChatId === item.id ? 'bg-[var(--active-bg)]' : ''
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
            <h3 className="px-3 text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider mb-2">Previous 7 days</h3>
            {previousChats.map(item => (
              <button 
                key={item.id}
                onClick={() => onSelectChat?.(item.id)}
                className={`w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors text-sm truncate group flex items-center gap-2 ${
                  activeChatId === item.id ? 'bg-[var(--active-bg)]' : ''
                }`}
              >
                <MessageSquare size={14} className="shrink-0 opacity-60" />
                <span className="truncate">{item.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-[var(--border)] space-y-2">
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors text-sm"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
        
        {/* User Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--hover-bg)] transition-colors text-sm"
          >
            {user?.picture ? (
              <img 
                src={user.picture} 
                alt={user.name} 
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-white">
                {user ? getInitials(user.name) : 'U'}
              </div>
            )}
            <span className="flex-1 truncate text-left">{user?.name || 'User'}</span>
            {showUserMenu ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          
          {showUserMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-[var(--background-secondary)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden">
              <div className="px-3 py-2 border-b border-[var(--border)]">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-[var(--foreground-muted)] truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[var(--hover-bg)] transition-colors text-sm text-red-500"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
