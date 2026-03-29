import { useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Wallet, PieChart, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart as RePieChart, Pie
} from 'recharts';

const DATA = [
  { month: 'Jan', savings: 15000, expenses: 25000 },
  { month: 'Feb', savings: 18000, expenses: 24000 },
  { month: 'Mar', savings: 12000, expenses: 32000 },
  { month: 'Apr', savings: 20000, expenses: 22000 },
  { month: 'May', savings: 22000, expenses: 23000 },
  { month: 'Jun', savings: 25000, expenses: 21000 },
];

const ASSET_DATA = [
  { name: 'Equity', value: 60, color: '#16a34a' },
  { name: 'Debt', value: 25, color: '#2563eb' },
  { name: 'Gold', value: 10, color: '#f59e0b' },
  { name: 'Cash', value: 5, color: '#6b7280' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Financial Overview</h2>
          <p className="text-gray-500 mt-1">Welcome back! Your net worth grew by <span className="text-green-600 font-bold">12%</span> this month.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">Export Report</button>
          <button className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-200 hover:bg-green-700 transition-colors">Add Transaction</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Balance', value: '₹12,45,000', icon: Wallet, color: 'text-green-600', bg: 'bg-green-50', trend: '+₹45k' },
          { label: 'Monthly Savings', value: '₹25,000', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12%' },
          { label: 'Monthly Expenses', value: '₹21,000', icon: ArrowDownRight, color: 'text-red-600', bg: 'bg-red-50', trend: '-5%' },
          { label: 'Investments', value: '₹8,90,000', icon: PieChart, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+₹1.2L' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={stat.bg + " p-3 rounded-2xl " + stat.color}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">{stat.trend}</span>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-gray-900">Savings vs Expenses</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full" />
                <span className="text-xs font-bold text-gray-500 uppercase">Savings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-200 rounded-full" />
                <span className="text-xs font-bold text-gray-500 uppercase">Expenses</span>
              </div>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af', fontWeight: 600 }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="savings" stroke="#16a34a" strokeWidth={4} fillOpacity={1} fill="url(#colorSavings)" />
                <Area type="monotone" dataKey="expenses" stroke="#e5e7eb" strokeWidth={4} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-black text-gray-900 mb-8">Asset Allocation</h3>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={ASSET_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {ASSET_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-gray-900">100%</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Allocated</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {ASSET_DATA.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-gray-500 uppercase">{item.name}</span>
                </div>
                <span className="text-sm font-black text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insight Banner */}
      <div className="bg-green-600 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-green-200 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={20} className="text-green-200" />
            <span className="text-xs font-bold uppercase tracking-widest text-green-100">AI Guru Insight</span>
          </div>
          <h3 className="text-2xl font-black mb-2">You're on track to retire at 45!</h3>
          <p className="text-green-50 opacity-90 max-w-lg">Based on your current savings rate and investment returns, you are in the top 5% of savers in your age group. Keep it up!</p>
        </div>
        <button className="relative z-10 px-8 py-4 bg-white text-green-700 font-black rounded-2xl shadow-lg hover:bg-green-50 transition-colors">View FIRE Plan</button>
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
      </div>
    </div>
  );
}
