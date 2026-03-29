import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, Sparkles, IndianRupee } from 'lucide-react';
import { ChatMessage } from '../types';
import { chatWithGuru } from '../services/aiService';
import { cn } from '../lib/utils';

export default function Chat() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Namaste! I am your Rupee Guru. How can I help you with your finances today? I can help you with tax planning, investment advice, or understanding Indian financial schemes.",
      timestamp: Date.now(),
    },
  ]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      history.push({ role: 'user', parts: [{ text: input }] });

      const response = await chatWithGuru(history);
      
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Chat Header */}
      <div className="p-6 bg-green-600 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <Bot size={28} />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight">Rupee Guru AI</h2>
            <p className="text-xs font-bold text-green-100 uppercase tracking-widest flex items-center gap-1">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              Online | Financial Expert
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest">India Specific</div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex w-full gap-4",
                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm",
                msg.role === 'user' ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-600"
              )}>
                {msg.role === 'user' ? <User size={20} /> : <Sparkles size={20} />}
              </div>
              <div className={cn(
                "max-w-[75%] p-5 rounded-[2rem] shadow-sm relative",
                msg.role === 'user' 
                  ? "bg-green-600 text-white rounded-tr-none" 
                  : "bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100"
              )}>
                <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>
                <div className={cn(
                  "text-[10px] mt-2 font-bold opacity-50",
                  msg.role === 'user' ? "text-right" : "text-left"
                )}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex justify-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
              <Loader2 className="animate-spin" size={20} />
            </div>
            <div className="bg-gray-50 p-5 rounded-[2rem] rounded-tl-none border border-gray-100 shadow-sm">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-8 bg-gray-50 border-t border-gray-100">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about Indian finance..."
            className="w-full bg-white border border-gray-200 rounded-[2rem] pl-8 pr-20 py-5 text-sm font-bold shadow-inner focus:ring-4 focus:ring-green-100 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-3 top-3 bottom-3 px-6 bg-green-600 text-white rounded-2xl font-black shadow-lg hover:bg-green-700 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Send size={18} />
            <span className="hidden md:inline">Send</span>
          </button>
        </form>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {["Best ELSS funds?", "How to save tax?", "Explain NPS benefit", "SIP vs Lumpsum?"].map(q => (
            <button 
              key={q}
              onClick={() => setInput(q)}
              className="whitespace-nowrap px-4 py-2 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-500 hover:border-green-300 hover:text-green-600 transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
