import React from 'react';
import { useEnergy } from '../context/EnergyContext';
import { Card } from '../components/ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Zap, Thermometer, DollarSign, Leaf, Power, Activity, CloudSun, BatteryCharging, Flame, Fan, Gauge, AlertTriangle } from 'lucide-react';
import { formatWatts, formatCurrency, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Device Icon Helper
const DeviceIcon = ({ type, isOn }: { type: string; isOn: boolean }) => {
  const colorClass = isOn ? "text-white" : "text-zinc-500";
  
  switch (type) {
    case 'ac': return <Fan className={`${colorClass} ${isOn ? 'animate-spin-slow' : ''}`} size={20} />;
    case 'ev': return <BatteryCharging className={colorClass} size={20} />;
    case 'heater': return <Flame className={`${colorClass} ${isOn ? 'animate-pulse' : ''}`} size={20} />;
    default: return <Power className={colorClass} size={20} />;
  }
};

export const HomeDashboard = () => {
  const { reading, history, devices, toggleDevice, weather, isPeakHour } = useEnergy();

  // Derived State
  const gridStatus = reading.voltage < 220 ? 'Unstable' : 'Stable';
  
  // Data for Pie Chart
  const deviceData = devices.filter(d => d.isOn).map(d => ({
    name: d.name,
    value: d.baseLoad
  }));
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Peak Hour Banner */}
      <AnimatePresence>
        {isPeakHour && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-4 text-white shadow-lg flex items-center justify-between overflow-hidden"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-white/20 rounded-lg animate-pulse">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Peak Hour Tariff Active</h3>
                <p className="text-white/90 text-sm">Electricity costs are 50% higher. Reduce load to save.</p>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold uppercase opacity-75">Current Rate</p>
              <p className="text-2xl font-bold">£0.35 <span className="text-sm font-normal">/ kWh</span></p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
              Live Simulation
            </span>
            <span className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs font-bold uppercase tracking-wider">
              v7.0 Impact
            </span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Home Energy Twin</h2>
          <p className="text-zinc-500 dark:text-zinc-400">Real-time physics engine • Weather-aware • 1s Resolution</p>
        </div>
        
        {/* Weather Widget */}
        <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-500">
            <CloudSun size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-white">
              {weather ? `${weather.temp.toFixed(1)}°C` : '--'}
            </p>
            <p className="text-xs text-zinc-500">{weather?.condition || 'Fetching...'}</p>
          </div>
          <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-2" />
          <div>
             <p className="text-xs text-zinc-500">Grid Status</p>
             <p className={cn("text-sm font-medium", gridStatus === 'Stable' ? 'text-emerald-500' : 'text-amber-500')}>
               {gridStatus}
             </p>
          </div>
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-l-4 border-l-emerald-500">
          <div className="relative z-10">
            <p className="text-sm text-zinc-500 font-medium">Real-time Load</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-zinc-900 dark:text-white">{formatWatts(reading.power)}</span>
            </div>
            <div className="mt-2 h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-500"
                animate={{ width: `${Math.min((reading.power / 10000) * 100, 100)}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          </div>
          <Zap className="absolute right-4 top-4 text-emerald-500/10" size={64} />
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-blue-500">
          <div className="relative z-10">
            <p className="text-sm text-zinc-500 font-medium">Voltage Stability</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-zinc-900 dark:text-white">{reading.voltage.toFixed(1)}</span>
              <span className="text-sm text-zinc-500">V</span>
            </div>
            <p className="text-xs text-zinc-400 mt-2">Target: 230V ±6%</p>
          </div>
          <Activity className="absolute right-4 top-4 text-blue-500/10" size={64} />
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-amber-500">
          <div className="relative z-10">
            <p className="text-sm text-zinc-500 font-medium">Session Cost</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-zinc-900 dark:text-white">{formatCurrency(reading.cost)}</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
               <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", isPeakHour ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600")}>
                 {isPeakHour ? 'PEAK TARIFF' : 'OFF-PEAK'}
               </span>
            </div>
          </div>
          <DollarSign className="absolute right-4 top-4 text-amber-500/10" size={64} />
        </Card>

        <Card className="relative overflow-hidden border-l-4 border-l-zinc-500">
          <div className="relative z-10">
            <p className="text-sm text-zinc-500 font-medium">Carbon Emitted</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-zinc-900 dark:text-white">{reading.co2.toFixed(3)}</span>
              <span className="text-sm text-zinc-500">kg</span>
            </div>
            <p className="text-xs text-zinc-400 mt-2">Intensity: {isPeakHour ? 'High' : 'Moderate'}</p>
          </div>
          <Leaf className="absolute right-4 top-4 text-zinc-500/10" size={64} />
        </Card>
      </div>

      {/* Main Visualization Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live Graph */}
        <Card title="Live Power Consumption (1s Resolution)" className="lg:col-span-2 min-h-[400px] flex flex-col">
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" opacity={0.1} />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(ts) => new Date(ts).toLocaleTimeString([], {minute: '2-digit', second: '2-digit'})} 
                  stroke="#71717a"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  minTickGap={30}
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${(val/1000).toFixed(1)}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981' }}
                  labelFormatter={(label) => new Date(label).toLocaleTimeString()}
                  formatter={(value: number) => [`${value.toFixed(0)} W`, 'Power']}
                />
                <Area 
                  type="monotone" 
                  dataKey="power" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPower)" 
                  isAnimationActive={false} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Interactive Device Control */}
        <Card title="Device Control & Audit" className="flex flex-col">
          <div className="space-y-3 overflow-y-auto pr-2 max-h-[250px] mb-4">
            {devices.map((device) => (
              <motion.div 
                key={device.id} 
                layout
                className={cn(
                  "group relative flex items-center justify-between p-4 rounded-xl border transition-all duration-200",
                  device.isOn 
                    ? "bg-zinc-900 border-zinc-800 shadow-lg shadow-emerald-500/10" 
                    : "bg-zinc-50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-3 rounded-lg transition-colors",
                    device.isOn ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"
                  )}>
                    <DeviceIcon type={device.type} isOn={device.isOn} />
                  </div>
                  <div>
                    <p className={cn("font-semibold text-sm", device.isOn ? "text-white" : "text-zinc-700 dark:text-zinc-300")}>
                      {device.name}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {device.isOn ? `${formatWatts(device.baseLoad)} • Active` : 'Standby'}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => toggleDevice(device.id)}
                  className={cn(
                    "relative w-12 h-7 rounded-full transition-colors focus:outline-none",
                    device.isOn ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"
                  )}
                >
                  <motion.span
                    layout
                    className="block w-5 h-5 bg-white rounded-full shadow-md m-1"
                    animate={{ x: device.isOn ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Device Breakdown Pie Chart */}
          <div className="h-[150px] w-full border-t border-zinc-100 dark:border-zinc-800 pt-4">
             <p className="text-xs text-zinc-500 mb-2 font-medium uppercase">Load Distribution</p>
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', fontSize: '12px' }}
                     formatter={(val: number) => formatWatts(val)}
                  />
                </PieChart>
             </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Tech Specs Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="flex items-center gap-4">
             <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full">
               <Gauge size={24} className="text-zinc-500" />
             </div>
             <div>
               <p className="text-sm text-zinc-500">Power Factor</p>
               <p className="text-xl font-bold text-zinc-900 dark:text-white">{reading.powerFactor.toFixed(2)}</p>
             </div>
         </Card>
         <Card className="flex items-center gap-4">
             <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full">
               <Activity size={24} className="text-zinc-500" />
             </div>
             <div>
               <p className="text-sm text-zinc-500">Frequency</p>
               <p className="text-xl font-bold text-zinc-900 dark:text-white">{reading.frequency.toFixed(2)} Hz</p>
             </div>
         </Card>
         <Card className="flex items-center gap-4">
             <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full">
               <Zap size={24} className="text-zinc-500" />
             </div>
             <div>
               <p className="text-sm text-zinc-500">Current</p>
               <p className="text-xl font-bold text-zinc-900 dark:text-white">{reading.current.toFixed(1)} A</p>
             </div>
         </Card>
      </div>
    </div>
  );
};
