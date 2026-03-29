import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  Loader2, 
  TrendingUp, 
  ShieldCheck, 
  Flame, 
  HelpCircle,
  MessageSquare,
  Plus,
  ArrowDown
} from 'lucide-react';
import { chatWithGuru } from '../services/apiService';
import type { ChatMessage } from '../types';
import { cn } from '../lib/utils';

const SUGGESTIONS = [
  "Where to invest ₹5000?",
  "How to save tax under 80C?",
  "Best SIP for beginners?",
  "Explain PPF vs ELSS",
  "How much emergency fund do I need?"
];

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Namaste! I'm Rupee Guru, your personal AI finance mentor. How can I help you reach financial freedom today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithGuru(text, messages);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[85vh] flex flex-col bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl overflow-hidden relative">
      {/* Chat Header */}
      <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <Sparkles className="text-white" size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">Rupee Guru</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Online Advisor</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <HelpCircle size={20} />
          </button>
          <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(
              "flex items-start gap-4 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
              msg.role === 'assistant' ? "bg-emerald-50 text-emerald-600" : "bg-gray-900 text-white"
            )}>
              {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className={cn(
              "p-6 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm",
              msg.role === 'assistant' 
                ? "bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100" 
                : "bg-emerald-600 text-white rounded-tr-none shadow-emerald-100"
            )}>
              {msg.content}
              <div className={cn(
                "text-[10px] mt-2 font-bold uppercase tracking-widest opacity-50",
                msg.role === 'user' ? "text-right" : ""
              )}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
              <Bot size={20} />
            </div>
            <div className="bg-gray-50 p-6 rounded-[2rem] rounded-tl-none border border-gray-100 flex items-center gap-3">
              <Loader2 className="animate-spin text-emerald-600" size={18} />
              <span className="text-sm font-bold text-gray-500 animate-pulse">Guru is typing...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-8 bg-white border-t border-gray-100">
        {/* Suggestions */}
        <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide">
          {SUGGESTIONS.map((s) => (
            <button 
              key={s}
              onClick={() => handleSend(s)}
              className="px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-xs font-bold text-gray-600 hover:bg-emerald-50 hover:border-emerald-100 hover:text-emerald-700 transition-all whitespace-nowrap active:scale-95"
            >
              {s}
            </button>
          ))}
        </div>

        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center gap-4"
        >
          <div className="relative flex-1">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Guru anything about money..."
              className="w-full pl-6 pr-16 py-5 bg-gray-50 border-none rounded-[2rem] focus:ring-2 focus:ring-emerald-500 font-bold text-gray-900 placeholder:text-gray-400 transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
              <button 
                type="button"
                className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
              >
                <MessageSquare size={20} />
              </button>
            </div>
          </div>
          <button 
            type="submit"
            disabled={!input.trim() || loading}
            className="p-5 bg-emerald-600 text-white rounded-[2rem] shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
          >
            <Send size={24} />
          </button>
        </form>
      </div>

      {/* Floating Action Hint */}
      <AnimatePresence>
        {messages.length < 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full text-xs font-bold flex items-center gap-3 shadow-2xl z-20"
          >
            <ArrowDown size={14} className="animate-bounce" />
            Try asking about tax saving
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
