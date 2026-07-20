"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LayoutDashboard, TrendingUp, Zap, Target, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

interface KPIData {
  totalTrades: number;
  activeTrades: number;
  winRate: number;
  netRR: number;
  netPoints: number;
}

const fetchKPIs = async (): Promise<KPIData> => {
  const res = await fetch("/api/dashboard/kpi");
  if (!res.ok) throw new Error("Failed to fetch KPIs");
  return res.json();
};

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-kpi"],
    queryFn: fetchKPIs,
  });

  const kpis = [
    { label: "Total Trades", value: data?.totalTrades ?? 0, suffix: "", icon: LayoutDashboard, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Win Rate", value: data?.winRate ?? 0, suffix: "%", icon: Target, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Net RR", value: data?.netRR ?? 0, suffix: "R", icon: TrendingUp, color: "text-violet-400", bg: "bg-violet-500/10" },
    { label: "Active Trades", value: data?.activeTrades ?? 0, suffix: "", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-sm text-white/50 mt-1">Monitor your trading signals, performance, and VIP member activity.</p>
      </div>

      {isError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-sm">
          <AlertCircle size={16} />
          Failed to load dashboard metrics. Ensure MongoDB is running and connected.
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="min-h-[140px] shimmer" />
            ))
          : kpis.map((kpi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="group hover:bg-white/[0.04] transition-all cursor-default">
                  {/* Glow Effect */}
                  <div className={cn("absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity", kpi.bg)} />
                  
                  <div className="flex flex-row items-center justify-between pb-2">
                    <p className="text-[11px] font-medium text-white/50 uppercase tracking-wider">{kpi.label}</p>
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center border border-white/5", kpi.bg)}>
                      <kpi.icon size={16} className={kpi.color} />
                    </div>
                  </div>
                  <CardContent className="pb-0 px-0">
                    <div className="flex items-baseline gap-1 mt-1">
                      <h3 className={cn("text-3xl font-semibold tracking-tight transition-colors num", kpi.color)}>
                        {kpi.value.toLocaleString()}
                      </h3>
                      <span className="text-sm font-medium text-white/40">{kpi.suffix}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="h-full min-h-[400px]">
            <CardHeader>
              <CardTitle>Performance Chart</CardTitle>
              <CardDescription>Equity curve and historical performance</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-[300px] text-center border-t border-white/5 pt-8">
              <TrendingUp size={32} className="text-white/20 mb-4" />
              <p className="text-sm text-white/40 max-w-sm">Recharts equity curve and historical performance data will be integrated here.</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="h-full min-h-[400px]">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Live feed of recent signals</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-[300px] text-center border-t border-white/5 pt-8">
              <Clock size={32} className="text-white/20 mb-4" />
              <p className="text-sm text-white/40 max-w-sm">Live feed of Discord bot signal creations, TP hits, and SL hits.</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
