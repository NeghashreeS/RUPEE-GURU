import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Wallet, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  History, 
  Loader2,
  Target,
  Plus,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart as RePieChart, Pie
} from 'recharts';
import { getFinancialHistory } from '../services/apiService';
import { cn } from '../lib/utils';
import type { Goal } from '../types';

const DATA = [
  { month: 'Jan', savings: 15000, expenses: 25000 },
  { month: 'Feb', savings: 18000, expenses: 24000 },
  { month: 'Mar', savings: 12000, expenses: 32000 },
  { month: 'Apr', savings: 20000, expenses: 22000 },
  { month: 'May', savings: 22000, expenses: 23000 },
  { month: 'Jun', savings: 25000, expenses: 21000 },
];

const ASSET_DATA = [
  { name: 'Equity', value: 60, color: '#10b981' },
  { name: 'Debt', value: 25, color: '#3b82f6' },
  { name: 'Gold', value: 10, color: '#f59e0b' },
  { name: 'Cash', value: 5, color: '#6b7280' },
];

export default function Dashboard() {
  const [history, setHistory] = useState<any>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyData, goalsData] = await Promise.all([
          getFinancialHistory(),
          fetch('/api/goals').then(res => res.json())
        ]);
        console.log("Dashboard Data Fetched:", { historyData, goalsData });
        setHistory(historyData);
        setGoals(goalsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const latestProfile = history?.profiles?.[history.profiles.length - 1];
  const latestFirePlan = history?.firePlans?.[history.firePlans.length - 1];

  const stats = [
    { label: 'Net Worth', value: latestProfile?.profile?.totalInvestments ? `₹${latestProfile.profile.totalInvestments.toLocaleString()}` : '₹12,45,000', icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+₹45k' },
    { label: 'Monthly Savings', value: latestProfile?.profile?.monthlySavings ? `₹${latestProfile.profile.monthlySavings.toLocaleString()}` : '₹25,000', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%' },
    { label: 'Health Score', value: latestProfile?.result?.score ? `${latestProfile.result.score}/100` : '72/100', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50', trend: latestProfile?.result?.grade || 'Good' },
    { label: 'FIRE Target', value: latestFirePlan?.result?.targetCorpus ? `₹${(latestFirePlan.result.targetCorpus / 10000000).toFixed(1)}Cr` : '₹4.2Cr', icon: Target, color: 'text-orange-600', bg: 'bg-orange-50', trend: 'On Track' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh]">
        <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Syncing your financial world...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-1 font-medium">Welcome back! Your money is working hard for you.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.location.reload()}
            className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
          >
            <History size={20} />
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95">
            <Plus size={20} />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-4 rounded-2xl transition-colors group-hover:scale-110 duration-300", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-wider">{stat.trend}</span>
            </div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-xl font-black text-gray-900">Wealth Growth</h3>
              <p className="text-sm text-gray-400 font-medium">Monthly savings vs expenses trend</p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Savings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-200 rounded-full" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Expenses</span>
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 600 }} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="savings" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorSavings)" />
                <Area type="monotone" dataKey="expenses" stroke="#e5e7eb" strokeWidth={4} fill="transparent" strokeDasharray="8 8" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goals & Allocation */}
        <div className="space-y-8">
          {/* Goal Tracker */}
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-gray-900">Goals</h3>
              <button className="text-emerald-600 font-bold text-sm hover:underline">View All</button>
            </div>
            <div className="space-y-6">
              {goals.map((goal) => (
                <div key={goal.id} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700">{goal.title}</span>
                    <span className="text-xs font-bold text-gray-400">{Math.round((goal.current / goal.target) * 100)}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-emerald-500 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <span>₹{(goal.current / 100000).toFixed(1)}L</span>
                    <span>₹{(goal.target / 100000).toFixed(1)}L</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Allocation */}
          <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-8">Allocation</h3>
            <div className="h-48 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={ASSET_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {ASSET_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-gray-900">100%</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Assets</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {ASSET_DATA.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 rounded-[3.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group"
      >
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <Sparkles size={20} className="text-emerald-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">Guru Insight</span>
          </div>
          <h3 className="text-3xl font-black mb-4 leading-tight">Your savings rate is <span className="text-emerald-400">31%</span> higher than last month!</h3>
          <p className="text-gray-400 font-medium leading-relaxed">
            This extra surplus could shave off <span className="text-white font-bold">2.4 years</span> from your retirement timeline if invested in your ELSS portfolio today.
          </p>
        </div>
        <button className="relative z-10 px-10 py-5 bg-white text-gray-900 font-black rounded-[2rem] shadow-xl hover:bg-emerald-50 transition-all active:scale-95 flex items-center gap-3 group">
          Optimize Portfolio
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
        
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-emerald-500/20 transition-colors duration-700" />
        <div className="absolute left-0 bottom-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />
      </motion.div>
    </div>
  );
}
