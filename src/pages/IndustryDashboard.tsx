import React from 'react';
import { useEnergy } from '../context/EnergyContext';
import { Card } from '../components/ui/Card';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Activity, AlertOctagon, Gauge, Zap } from 'lucide-react';

export const IndustryDashboard = () => {
  const { machines, voltageSpikes } = useEnergy();

  return (
    <div className="space-y-6">
      <header className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Industrial Operations</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Plant A • Heavy Machinery Monitoring</p>
          </div>
          <div className="flex gap-2">
             <button className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-bold rounded-lg">
                Export Logs
             </button>
          </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Machinery Radar */}
         <Card title="Machinery Load Radar" className="h-[400px]">
            <div className="h-full w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={machines}>
                     <PolarGrid stroke="#3f3f46" />
                     <PolarAngleAxis dataKey="subject" tick={{ fill: '#71717a', fontSize: 12 }} />
                     <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                     <Radar
                        name="Current Load"
                        dataKey="load"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="#10b981"
                        fillOpacity={0.4}
                        isAnimationActive={false}
                     />
                     <Radar
                        name="Capacity"
                        dataKey="fullMark"
                        stroke="#3f3f46"
                        strokeWidth={1}
                        fill="transparent"
                        strokeDasharray="3 3"
                     />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                        itemStyle={{ color: '#10b981' }}
                     />
                  </RadarChart>
               </ResponsiveContainer>
            </div>
         </Card>

         {/* Spike Map / Voltage Stability */}
         <Card title="Voltage Stability & Spikes (Oscilloscope View)" className="lg:col-span-2 h-[400px] bg-zinc-950 border-zinc-800">
            <div className="h-full w-full pb-6">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={voltageSpikes}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
                     <XAxis dataKey="time" stroke="#555" hide />
                     <YAxis 
                        yAxisId="left" 
                        stroke="#ef4444" 
                        domain={[350, 450]} 
                        label={{ value: 'Voltage (V)', angle: -90, position: 'insideLeft', fill: '#ef4444' }} 
                        tick={{fill: '#ef4444'}}
                     />
                     <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        stroke="#3b82f6" 
                        domain={[0, 1200]}
                        label={{ value: 'Load (kW)', angle: 90, position: 'insideRight', fill: '#3b82f6' }} 
                        tick={{fill: '#3b82f6'}}
                     />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#000', borderColor: '#333', color: '#fff' }}
                        labelFormatter={() => ''}
                     />
                     <Line 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="voltage" 
                        stroke="#ef4444" 
                        strokeWidth={2} 
                        dot={false} 
                        isAnimationActive={false} 
                     />
                     <Line 
                        yAxisId="right" 
                        type="step" 
                        dataKey="load" 
                        stroke="#3b82f6" 
                        strokeWidth={2} 
                        dot={false} 
                        isAnimationActive={false} 
                     />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </Card>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/10">
            <div className="flex items-center gap-4">
               <AlertOctagon className="text-red-500" size={32} />
               <div>
                  <p className="text-sm font-bold text-red-700 dark:text-red-400">Surge Detected</p>
                  <p className="text-xs text-red-600/80 dark:text-red-400/80">Pump B - Recent</p>
               </div>
            </div>
         </Card>
         <Card className="border-l-4 border-l-emerald-500">
            <div className="flex items-center gap-4">
               <Activity className="text-emerald-500" size={32} />
               <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">Power Factor</p>
                  <p className="text-2xl font-bold">0.98</p>
               </div>
            </div>
         </Card>
         <Card className="border-l-4 border-l-blue-500">
            <div className="flex items-center gap-4">
               <Zap className="text-blue-500" size={32} />
               <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-white">Peak Demand</p>
                  <p className="text-2xl font-bold">1.2 MW</p>
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
};
