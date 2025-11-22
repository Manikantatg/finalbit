import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Factory, Map, Leaf, Settings, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Home', path: '/' },
  { icon: Building2, label: 'Building', path: '/building' },
  { icon: Factory, label: 'Industry', path: '/industry' },
  { icon: Map, label: 'Smart City', path: '/city' },
  { icon: Leaf, label: 'Marketplace', path: '/marketplace' },
  { icon: Settings, label: 'Admin', path: '/admin' },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
          <Zap size={20} fill="currentColor" />
        </div>
        <h1 className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white">Energy OS</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200"
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-white">Demo User</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
