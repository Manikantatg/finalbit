import React from 'react';
import { Sidebar } from './Sidebar';
import { useEnergy } from '../../context/EnergyContext';
import { Activity, Wifi, Bell } from 'lucide-react';

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { reading } = useEnergy();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-64">
        {/* Global Command Bar */}
        <div className="h-14 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-8 sticky top-0 z-40 shadow-sm">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
                 <Activity size={16} className="text-emerald-500" />
                 <span>Grid Freq: <span className="text-zinc-900 dark:text-white font-mono">{reading.frequency.toFixed(2)} Hz</span></span>
              </div>
              <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-700" />
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
                 <Wifi size={16} className="text-blue-500" />
                 <span>Comms: <span className="text-emerald-500">Online</span></span>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                 <Bell size={18} className="text-zinc-500" />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-zinc-900" />
              </button>
              <div className="text-xs text-right hidden md:block">
                 <p className="font-bold text-zinc-900 dark:text-white">{new Date().toLocaleTimeString()}</p>
                 <p className="text-zinc-500">{new Date().toLocaleDateString()}</p>
              </div>
           </div>
        </div>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
