import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, HeartPulse, Flame, MessageSquare, IndianRupee } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Health Score', path: '/health', icon: HeartPulse },
    { name: 'FIRE Planner', path: '/fire', icon: Flame },
    { name: 'AI Mentor', path: '/chat', icon: MessageSquare },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-100 h-screen sticky top-0 flex flex-col">
      <div className="p-6 flex items-center gap-2">
        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200">
          <IndianRupee size={24} strokeWidth={3} />
        </div>
        <h1 className="text-xl font-black tracking-tighter text-gray-800">
          RUPEE<span className="text-green-600">GURU</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                isActive 
                  ? "bg-green-50 text-green-700 shadow-sm" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <div className="bg-green-600 rounded-2xl p-4 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Pro Tip</p>
            <p className="text-sm font-medium leading-snug">Diversify your portfolio with Index Funds for long-term growth.</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
        </div>
      </div>
    </div>
  );
}
