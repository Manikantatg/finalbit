import React from 'react';
import { useEnergy } from '../context/EnergyContext';
import { Card } from '../components/ui/Card';
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';
import { formatCurrency } from '../lib/utils';

export const Marketplace = () => {
  const { market, tradeCarbon } = useEnergy();

  return (
    <div className="space-y-6">
      <header className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Carbon Marketplace</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Peer-to-Peer Trading • Spot Price {formatCurrency(market.price)}</p>
          </div>
          <button className="bg-zinc-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl font-bold transition-transform hover:scale-105 flex items-center gap-2 shadow-lg">
             <Wallet size={18} /> Wallet Connected
          </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Wallet & Balance */}
         <Card className="bg-emerald-500 text-white border-none relative overflow-hidden">
            <div className="relative z-10">
               <p className="text-emerald-100 font-medium mb-1">Carbon Credits Balance</p>
               <h3 className="text-5xl font-bold">{formatCurrency(market.walletBalance)}</h3>
               <p className="mt-4 text-sm flex items-center gap-1 bg-white/20 w-fit px-2 py-1 rounded-lg">
                  <TrendingUp size={14} /> Portfolio: {formatCurrency(market.portfolioValue)}
               </p>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-20">
               <Wallet size={150} />
            </div>
         </Card>

         {/* Price Chart */}
         <Card title="Carbon Spot Price (Live)" className="lg:col-span-2">
            <div className="h-[150px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={market.history}>
                     <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
                     <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#10b981" 
                        strokeWidth={2} 
                        fill="url(#colorPrice)" 
                        isAnimationActive={false}
                     />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </Card>
      </div>

      {/* Trading Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card>
            <h3 className="font-bold text-lg mb-4">Quick Trade</h3>
            <div className="flex gap-4">
               <button 
                  onClick={() => tradeCarbon(10, 'buy')}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
               >
                  <ArrowDownLeft size={18} /> Buy 10 Credits
               </button>
               <button 
                  onClick={() => tradeCarbon(10, 'sell')}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
               >
                  <ArrowUpRight size={18} /> Sell 10 Credits
               </button>
            </div>
            <p className="text-xs text-zinc-500 mt-3 text-center">Estimated transaction fee: £0.05</p>
         </Card>

         <Card title="Live Order Book">
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800/50">
                     <tr>
                        <th className="px-4 py-3 rounded-l-lg">Type</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3 text-right rounded-r-lg">Total</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                     {[
                        { type: 'sell', amount: 50, price: (market.price + 0.03).toFixed(2) },
                        { type: 'sell', amount: 120, price: market.price.toFixed(2) },
                        { type: 'buy', amount: 200, price: (market.price - 0.04).toFixed(2) },
                     ].map((order, i) => (
                        <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                           <td className="px-4 py-3 font-bold">
                              <span className={order.type === 'buy' ? 'text-emerald-500' : 'text-red-500'}>
                                 {order.type.toUpperCase()}
                              </span>
                           </td>
                           <td className="px-4 py-3 text-zinc-900 dark:text-white">{order.amount}</td>
                           <td className="px-4 py-3 text-zinc-500">£{order.price}</td>
                           <td className="px-4 py-3 text-right font-medium text-zinc-900 dark:text-white">
                              £{(order.amount * parseFloat(order.price as string)).toFixed(2)}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </Card>
      </div>
    </div>
  );
};
