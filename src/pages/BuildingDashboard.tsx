import React from 'react';
import { useEnergy } from '../context/EnergyContext';
import { Card } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Zap, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const getStatusColor = (status: string) => {
  switch(status) {
    case 'critical': return 'bg-red-500';
    case 'high': return 'bg-orange-500';
    case 'warning': return 'bg-yellow-500';
    default: return 'bg-emerald-500';
  }
};

export const BuildingDashboard = () => {
  const { floors, dailyStats } = useEnergy();
  const totalLoad = floors.reduce((acc, f) => acc + f.load, 0);

  return (
    <div className="space-y-6">
       <header className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Building Intelligence</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Tower A • Commercial Complex</p>
          </div>
          <div className="flex gap-3">
             <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm font-medium">
                Total Load: <span className="text-zinc-900 dark:text-white font-bold">{totalLoad.toFixed(1)} kW</span>
             </div>
          </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Visual Floor Stack (Heatmap) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           <Card title="Vertical Load Heatmap" className="flex-1" noPadding>
              <div className="p-4 space-y-2 bg-zinc-50 dark:bg-zinc-900/50 h-full">
                 {floors.map((floor) => (
                    <motion.div 
                      key={floor.id}
                      layout
                      className="relative group cursor-pointer"
                    >
                       <div className="flex items-center gap-4 p-3 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all">
                          <div className={`w-1.5 h-10 rounded-full ${getStatusColor(floor.status)}`} />
                          <div className="w-8 h-8 flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 rounded font-bold text-zinc-600 dark:text-zinc-400">
                             {floor.id}
                          </div>
                          <div className="flex-1">
                             <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm text-zinc-900 dark:text-white">{floor.name}</span>
                                <span className="text-xs font-bold text-zinc-500">{floor.load} kW</span>
                             </div>
                             {/* Load Bar */}
                             <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                                <motion.div 
                                  className={`h-full rounded-full ${getStatusColor(floor.status)}`} 
                                  animate={{ width: `${(floor.load / floor.capacity) * 100}%` }}
                                  transition={{ duration: 1 }}
                                />
                             </div>
                          </div>
                       </div>
                    </motion.div>
                 ))}
              </div>
           </Card>
        </div>

        {/* System Map & Analytics */}
        <div className="lg:col-span-8 space-y-6">
           {/* System Status Cards */}
           <div className="grid grid-cols-3 gap-4">
              <Card className="bg-zinc-900 text-white border-zinc-800">
                 <div className="flex flex-col h-full justify-between">
                    <div className="p-2 bg-zinc-800 w-fit rounded-lg"><Layers size={20}/></div>
                    <div>
                       <p className="text-zinc-400 text-xs uppercase tracking-wider">Elevators</p>
                       <p className="text-2xl font-bold mt-1">4 Active</p>
                       <p className="text-emerald-400 text-xs mt-1">Regen active</p>
                    </div>
                 </div>
              </Card>
              <Card className="bg-white dark:bg-zinc-900">
                 <div className="flex flex-col h-full justify-between">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 w-fit rounded-lg text-blue-500"><Zap size={20}/></div>
                    <div>
                       <p className="text-zinc-500 text-xs uppercase tracking-wider">HVAC Load</p>
                       <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white">45%</p>
                       <p className="text-zinc-400 text-xs mt-1">Optimized</p>
                    </div>
                 </div>
              </Card>
              <Card className="bg-white dark:bg-zinc-900">
                 <div className="flex flex-col h-full justify-between">
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 w-fit rounded-lg text-amber-500"><AlertTriangle size={20}/></div>
                    <div>
                       <p className="text-zinc-500 text-xs uppercase tracking-wider">Alerts</p>
                       <p className="text-2xl font-bold mt-1 text-zinc-900 dark:text-white">1 Warning</p>
                       <p className="text-zinc-400 text-xs mt-1">Floor 4 Surge</p>
                    </div>
                 </div>
              </Card>
           </div>

           {/* Main Chart - Now using Daily Stats */}
           <Card title="Building Load Profile (24h)">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" opacity={0.1} />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} stroke="#71717a" fontSize={12} tickFormatter={(val, i) => i % 4 === 0 ? val : ''} />
                    <YAxis axisLine={false} tickLine={false} stroke="#71717a" fontSize={12} />
                    <Tooltip 
                       cursor={{fill: '#27272a', opacity: 0.1}}
                       contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                    />
                    <Bar dataKey="load" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};
