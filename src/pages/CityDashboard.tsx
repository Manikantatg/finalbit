import React from 'react';
import { useEnergy } from '../context/EnergyContext';
import { Card } from '../components/ui/Card';
import { motion } from 'framer-motion';
import { Zap, CloudLightning, Map } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

export const CityDashboard = () => {
  const { wards, dailyStats } = useEnergy();

  return (
    <div className="space-y-6">
      <header className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Smart City Grid</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Metropolitan Load & Stress Map</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* Ward Heatmap */}
         <Card title="Ward Load Intensity" noPadding className="overflow-hidden">
            <div className="p-6 bg-zinc-100 dark:bg-zinc-900">
               <div className="grid grid-cols-6 gap-2">
                  {wards.map((ward) => (
                     <motion.div
                        key={ward.id}
                        layout
                        whileHover={{ scale: 1.1, zIndex: 10 }}
                        className="aspect-square rounded-md flex flex-col items-center justify-center relative cursor-pointer shadow-sm transition-colors duration-500"
                        style={{
                           backgroundColor: ward.load > 80 ? '#ef4444' : ward.load > 50 ? '#f59e0b' : '#10b981',
                           opacity: 0.6 + (ward.load / 200)
                        }}
                     >
                        <span className="text-white font-bold text-lg">{ward.id}</span>
                        <span className="text-white/80 text-xs">{ward.load.toFixed(0)}%</span>
                     </motion.div>
                  ))}
               </div>
               <div className="flex justify-between mt-4 text-xs text-zinc-500">
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded"/> Low Load</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-500 rounded"/> Moderate</div>
                  <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded"/> Critical</div>
               </div>
            </div>
         </Card>

         {/* Transformer Stress Map & Timeline */}
         <div className="space-y-6">
            <Card title="Transformer Stress Map">
               <div className="grid grid-cols-4 gap-4">
                  {wards.slice(0, 12).map((ward) => (
                     <div key={ward.id} className="flex flex-col items-center gap-2">
                        <div className={`relative w-12 h-12 rounded-full border-4 flex items-center justify-center transition-colors duration-500 ${
                           ward.stress > 0.8 ? 'border-red-500 text-red-500' : 'border-blue-500 text-blue-500'
                        }`}>
                           <Zap size={16} fill="currentColor" />
                           {ward.stress > 0.8 && (
                              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                           )}
                        </div>
                        <span className="text-xs text-zinc-500">TR-{ward.id}</span>
                     </div>
                  ))}
               </div>
            </Card>

            {/* City Timeline Chart */}
            <Card title="City Load Timeline (24h)">
               <div className="h-[150px] w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyStats}>
                       <defs>
                          <linearGradient id="cityLoad" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="time" hide />
                       <Tooltip 
                          contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                       />
                       <Area type="monotone" dataKey="load" stroke="#8b5cf6" fill="url(#cityLoad)" strokeWidth={2} />
                    </AreaChart>
                 </ResponsiveContainer>
               </div>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white border-none">
               <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-lg">
                     <CloudLightning size={24} />
                  </div>
                  <div>
                     <h3 className="font-bold text-lg">Weather Impact Alert</h3>
                     <p className="text-indigo-200 text-sm mt-1">
                        Approaching storm front may cause load spikes in Northern Wards (1-6). Grid balancing active.
                     </p>
                  </div>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
};
