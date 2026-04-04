import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, Command, Zap, MessageSquare, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { eventBus } from '@/lib/event-bus';
import { useAdminData } from '@/context/AdminDataContext';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  actions?: string[];
}

export const AdminAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      role: 'agent',
      content: "Hello Admin! I'm your TofhaVerse agent. I've analyzed our latest data. Orders are up 12% this week! How can I assist you with inventory or logistics today?",
      timestamp: new Date(),
      actions: ["Summary Report", "Low Stock Alert", "Logistics Status"]
    }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { products, orders } = useAdminData();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulated Agent Logic
    setTimeout(() => {
      let agentResponse = "I'm processing that request for you. I'll need to check the inventory logs.";
      
      if (input.toLowerCase().includes('order')) {
        agentResponse = `You have ${orders.length} total orders. ${orders.filter(o => o.status === 'Processing').length} are currently processing. Shall I prepare a logistics summary?`;
      } else if (input.toLowerCase().includes('stock') || input.toLowerCase().includes('inventory')) {
        const lowStock = products.filter(p => p.stock < 10);
        agentResponse = `I found ${lowStock.length} items with low stock. Would you like me to notify the artisans?`;
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'agent',
        content: agentResponse,
        timestamp: new Date()
      }]);
      
      eventBus.emit('app:toast', { message: 'Agent processing complete', type: 'success' });
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-96 h-[500px] bg-white dark:bg-black/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl flex flex-col overflow-hidden ring-1 ring-black/5"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">TofhaVerse AI</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-white/70 text-[10px]">Operational</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={18} className="text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => (
                <div 
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    m.role === 'user' 
                      ? 'bg-purple-600 text-white rounded-tr-none' 
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none'
                  }`}>
                    {m.content}
                    {m.actions && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {m.actions.map(a => (
                          <button 
                            key={a}
                            onClick={() => setInput(a)}
                            className="px-2 py-1 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-lg text-[10px] hover:bg-zinc-50 transition-colors"
                          >
                            {a}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for reports or actions..."
                  className="w-full pl-4 pr-10 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <button 
                  onClick={handleSend}
                  className="absolute right-2 top-1.5 p-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[10px] text-zinc-400">
                <Command size={10} />
                <span>Command Panel Enabled</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 text-white"
      >
        {isOpen ? <X size={24} /> : <Zap size={24} className="animate-pulse" />}
      </motion.button>
    </div>
  );
};
