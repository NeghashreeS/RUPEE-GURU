import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Flame, 
  MessageSquare, 
  LogOut, 
  Settings, 
  User,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/health-score', label: 'Health Score', icon: ShieldCheck },
  { path: '/fire-plan', label: 'FIRE Planner', icon: Flame },
  { path: '/chat', label: 'AI Chat Advisor', icon: MessageSquare },
];

export default function Sidebar() {
  return (
    <aside className="w-80 h-screen bg-white border-r border-gray-100 flex flex-col sticky top-0 z-50">
      {/* Logo Section */}
      <div className="p-10">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-14 h-14 bg-emerald-600 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-emerald-200 group-hover:scale-110 transition-transform duration-500">
            <Sparkles className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tighter leading-none">RUPEE<br />GURU</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 space-y-2">
        <div className="px-4 mb-6">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Main Menu</p>
        </div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group",
              isActive 
                ? "bg-emerald-50 text-emerald-700 shadow-sm" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <div className="flex items-center gap-4">
              <item.icon size={20} className={cn(
                "transition-transform duration-300 group-hover:scale-110",
                "group-[.active]:text-emerald-600"
              )} />
              <span className="font-bold text-sm">{item.label}</span>
            </div>
            <ChevronRight size={14} className={cn(
              "opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1",
              "group-[.active]:opacity-100"
            )} />
          </NavLink>
        ))}
      </nav>

      {/* User Profile / Footer */}
      <div className="p-8 space-y-6">
        <div className="bg-gray-900 rounded-[2rem] p-6 text-white relative overflow-hidden group cursor-pointer">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg">
              NS
            </div>
            <div>
              <p className="text-sm font-black">Neha Shree</p>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Premium User</p>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-colors" />
        </div>

        <div className="flex items-center justify-between px-4">
          <button className="p-3 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all active:scale-90">
            <Settings size={20} />
          </button>
          <button className="p-3 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}
