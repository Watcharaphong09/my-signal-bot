"use client";

import { BarChart3, TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";

const performanceData = [
  { name: 'Jan', rr: 12 }, { name: 'Feb', rr: 28 }, { name: 'Mar', rr: 25 },
  { name: 'Apr', rr: 45 }, { name: 'May', rr: 42 }, { name: 'Jun', rr: 68 },
  { name: 'Jul', rr: 85 }
];

const winLossData = [
  { name: 'Wins', value: 68, color: '#10B981' },
  { name: 'Losses', value: 32, color: '#EF4444' }
];

export default function StatisticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="text-violet-400" size={24} />
            Advanced Statistics
          </h1>
          <p className="text-sm text-white/50 mt-1">Deep dive into performance metrics and equity curves.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Equity Curve */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-medium text-white/90 flex items-center gap-2">
                <TrendingUp size={16} className="text-violet-400" /> Net RR Trend
              </h3>
              <p className="text-xs text-white/40 mt-1">Cumulative Risk to Reward ratio over time</p>
            </div>
            <select className="bg-white/5 border border-white/10 text-xs text-white/70 rounded-md px-2 py-1 outline-none">
              <option>This Year</option>
              <option>Last 6 Months</option>
              <option>This Month</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `+${val}R`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0D1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#F0F6FC' }}
                />
                <Area type="monotone" dataKey="rr" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorRr)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Win/Loss Pie Chart */}
        <div className="glass-card rounded-xl p-6 border border-white/10 flex flex-col">
          <div className="mb-2">
            <h3 className="text-base font-medium text-white/90 flex items-center gap-2">
              <PieChartIcon size={16} className="text-emerald-400" /> Win Rate Distribution
            </h3>
          </div>
          
          <div className="flex-1 h-[250px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={winLossData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {winLossData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0D1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-3xl font-semibold text-white num">68%</span>
              <span className="text-[10px] text-white/40 uppercase tracking-wider">Win Rate</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5">
            <div className="text-center">
              <div className="text-[10px] text-white/40 uppercase">Wins</div>
              <div className="text-emerald-400 font-semibold num text-lg">68</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-white/40 uppercase">Losses</div>
              <div className="text-rose-400 font-semibold num text-lg">32</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
