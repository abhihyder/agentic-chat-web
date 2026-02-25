'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Message from './components/Message';
import InputArea from './components/InputArea';
import { Message as MessageType, ChatHistoryItem } from './types/chat';

interface Conversation {
  id: string;
  title: string;
  date: string;
  messages: MessageType[];
}

const initialConversations: Conversation[] = [
  { 
    id: '1', 
    title: 'How to build a React app', 
    date: 'Today',
    messages: [
      { id: '1-1', role: 'user', content: 'How to build a React app?' },
      { id: '1-2', role: 'assistant', content: 'To build a React app, you can use Create React App or Vite:\n\n1. **Using Vite (recommended):**\n```bash\nnpm create vite@latest my-app -- --template react\ncd my-app\nnpm install\nnpm run dev\n```\n\n2. **Using Create React App:**\n```bash\nnpx create-react-app my-app\ncd my-app\nnpm start\n```\n\nWould you like me to explain more about React components or state management?' }
    ]
  },
  { 
    id: '2', 
    title: 'Tailwind CSS tips', 
    date: 'Today',
    messages: [
      { id: '2-1', role: 'user', content: 'Give me some Tailwind CSS tips' },
      { id: '2-2', role: 'assistant', content: 'Here are some useful Tailwind CSS tips:\n\n1. **Use arbitrary values**: `w-[200px]` for custom widths\n2. **Group hover states**: `group-hover:text-white`\n3. **Dark mode**: Add `dark:` prefix for dark mode styles\n4. **Responsive design**: Use `sm:`, `md:`, `lg:` prefixes\n5. **Custom colors**: Define in `tailwind.config.js`\n\nWant more details on any of these?' }
    ]
  },
  { 
    id: '3', 
    title: 'TypeScript vs JavaScript', 
    date: 'Yesterday',
    messages: [
      { id: '3-1', role: 'user', content: 'TypeScript vs JavaScript - which should I use?' },
      { id: '3-2', role: 'assistant', content: 'Great question! Here\'s a comparison:\n\n**TypeScript:**\n- Static typing catches errors at compile time\n- Better IDE support and autocomplete\n- Great for large projects\n- Learning curve for beginners\n\n**JavaScript:**\n- No compilation step\n- More flexible\n- Easier to start with\n- Works everywhere\n\n**Recommendation:** Use TypeScript for production apps and JavaScript for quick prototypes.' }
    ]
  },
  { 
    id: '4', 
    title: 'Best practices for UI/UX', 
    date: 'Yesterday',
    messages: [
      { id: '4-1', role: 'user', content: 'What are the best practices for UI/UX?' },
      { id: '4-2', role: 'assistant', content: 'Key UI/UX best practices:\n\n1. **Consistency**: Keep design patterns uniform\n2. **Hierarchy**: Use size, color, spacing to guide attention\n3. **Feedback**: Show users their actions have effect\n4. **Accessibility**: Design for all users (WCAG guidelines)\n5. **Simplicity**: Remove unnecessary elements\n6. **Mobile-first**: Design for small screens first\n\nWould you like me to elaborate on any of these?' }
    ]
  },
  { 
    id: '5', 
    title: 'Cooking recipes for pasta', 
    date: 'Previous 7 days',
    messages: [
      { id: '5-1', role: 'user', content: 'Give me a simple pasta recipe' },
      { id: '5-2', role: 'assistant', content: '**Simple Garlic Butter Pasta**\n\n**Ingredients:**\n- 400g spaghetti\n- 4 cloves garlic, minced\n- 4 tbsp butter\n- Salt, pepper, parsley\n- Parmesan cheese\n\n**Steps:**\n1. Cook pasta al dente, reserve 1 cup pasta water\n2. Sauté garlic in butter until golden\n3. Toss pasta with garlic butter\n4. Add pasta water if needed\n5. Top with parmesan and parsley\n\nEnjoy! 🍝' }
    ]
  },
  { 
    id: '6', 
    title: 'Travel itinerary for Japan', 
    date: 'Previous 7 days',
    messages: [
      { id: '6-1', role: 'user', content: 'Plan a 3-day trip to Japan' },
      { id: '6-2', role: 'assistant', content: '**3-Day Japan Itinerary (Tokyo)**\n\n**Day 1 - Traditional Tokyo:**\n- Senso-ji Temple (Asakusa)\n- Tokyo Skytree\n- Ueno Park\n\n**Day 2 - Modern Tokyo:**\n- Shibuya Crossing\n- Harajuku & Meiji Shrine\n- Shinjuku nightlife\n\n**Day 3 - Culture & Food:**\n- Tsukiji Outer Market\n- teamLab Borderless\n- Ginza shopping\n\n**Tips:** Get a Suica card for trains. Best time: Spring (cherry blossoms) or Fall!' }
    ]
  },
];

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeChatId);
  const messages = activeConversation?.messages || [];

  const chatHistory: ChatHistoryItem[] = conversations.map(c => ({
    id: c.id,
    title: c.title,
    date: c.date,
  }));

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text: string) => {
    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };

    if (activeChatId) {
      // Add to existing conversation
      setConversations(prev => prev.map(conv => 
        conv.id === activeChatId 
          ? { ...conv, messages: [...conv.messages, userMessage] }
          : conv
      ));
    } else {
      // Create new conversation
      const newId = Date.now().toString();
      const newConversation: Conversation = {
        id: newId,
        title: text.slice(0, 30) + (text.length > 30 ? '...' : ''),
        date: 'Today',
        messages: [userMessage],
      };
      setConversations(prev => [newConversation, ...prev]);
      setActiveChatId(newId);
    }

    setIsLoading(true);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm a ChatGPT clone built with Next.js and Tailwind CSS. You said: "${text}"\n\nHow can I help you further today?`,
      };
      
      setConversations(prev => prev.map(conv => 
        conv.id === (activeChatId || prev[0].id)
          ? { ...conv, messages: [...conv.messages, assistantMessage] }
          : conv
      ));
      setIsLoading(false);
    }, 1000);
  };

  const handleNewChat = () => {
    setActiveChatId(null);
  };

  const handleSelectChat = (id: string) => {
    setActiveChatId(id);
  };

  return (
    <div className="flex h-screen w-full bg-[var(--background)] text-[var(--foreground)] overflow-hidden transition-colors">
      <Sidebar 
        chatHistory={chatHistory}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        activeChatId={activeChatId}
      />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {messages.length === 0 ? (
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
              {messages.map((msg) => (
                <Message key={msg.id} role={msg.role} content={msg.content} />
              ))}
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
