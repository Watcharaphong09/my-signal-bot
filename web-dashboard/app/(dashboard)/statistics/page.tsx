"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Activity, BarChart as BarChartIcon, Clock } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

export default function StatisticsPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await fetch("/api/analytics");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }
  });

  const performanceData = analytics?.performanceData || [];
  const winLossData = analytics?.winLossData || [];
  const buySellData = analytics?.buySellData || [];
  const assetData = analytics?.assetData || [];
  const durationData = analytics?.durationData || [];
  const providers = analytics?.providers?.slice(0, 5) || []; // Top 5 providers

  const winRate = winLossData.length > 0 && (winLossData[0].value + winLossData[1].value > 0)
    ? Math.round((winLossData[0].value / (winLossData[0].value + winLossData[1].value)) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-white/10 rounded w-64 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="h-[400px]"></Card>
          <Card className="h-[400px]"></Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <BarChart3 className="text-violet-400" size={24} />
            Advanced Statistics
          </h1>
          <p className="text-sm text-white/50 mt-1">Deep dive into performance metrics across various dimensions.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Equity Curve (Net RR & Points) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp size={16} className="text-violet-400" /> Equity Curve
              </CardTitle>
              <CardDescription>Cumulative Net RR and Net Points over time</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full pt-4">
              {performanceData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-white/40">No data available</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}R`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0D1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#F0F6FC' }}
                    />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="rr" name="Net RR" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorRr)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Win/Loss Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon size={16} className="text-emerald-400" /> Win Rate Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full relative">
              {winLossData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-white/40">No data available</div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={winLossData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                        {winLossData.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0D1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-3xl font-semibold text-white num">{winRate}%</span>
                    <span className="text-[10px] text-white/40 uppercase tracking-wider">Win Rate</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Buy vs Sell Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity size={16} className="text-blue-400" /> BUY vs SELL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full flex items-center justify-center relative">
              {buySellData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-white/40">No data available</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={buySellData} cx="50%" cy="50%" outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                      {buySellData.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0D1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Asset Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChartIcon size={16} className="text-amber-400" /> Top Assets by Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={assetData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0D1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="trades" name="Total Trades" fill="#FBBF24" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Trade Duration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={16} className="text-pink-400" /> Trade Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={durationData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0D1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                  <Bar dataKey="count" name="Count" fill="#F472B6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
