"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { LayoutDashboard, TrendingUp, Zap, Target, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="space-y-8 animate-fade-in">
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
              <div key={i} className="glass-card rounded-xl p-5 shimmer min-h-[140px]" />
            ))
          : kpis.map((kpi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass-card rounded-xl p-5 hover:bg-white/[0.02] transition-colors group relative overflow-hidden"
              >
                {/* Glow Effect */}
                <div className={cn("absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity", kpi.bg)} />
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center border border-white/5", kpi.bg)}>
                    <kpi.icon size={18} className={kpi.color} />
                  </div>
                </div>
                <div className="relative z-10">
                  <p className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-1">{kpi.label}</p>
                  <div className="flex items-baseline gap-1">
                    <motion.h3 
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className={cn("text-3xl font-semibold num tracking-tight transition-colors", kpi.color)}
                    >
                      {kpi.value.toLocaleString()}
                    </motion.h3>
                    <span className="text-sm font-medium text-white/40">{kpi.suffix}</span>
                  </div>
                </div>
              </motion.div>
            ))}
      </div>

      {/* Main Content Area Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="lg:col-span-2 glass-card rounded-xl p-6 min-h-[400px] flex flex-col items-center justify-center text-center"
        >
          <TrendingUp size={32} className="text-white/20 mb-4" />
          <h3 className="text-lg font-medium text-white/80">Performance Chart</h3>
          <p className="text-sm text-white/40 max-w-sm mt-2">Recharts equity curve and historical performance data will be integrated here in Phase 4.</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="glass-card rounded-xl p-6 min-h-[400px] flex flex-col items-center justify-center text-center"
        >
          <Clock size={32} className="text-white/20 mb-4" />
          <h3 className="text-lg font-medium text-white/80">Recent Activity</h3>
          <p className="text-sm text-white/40 max-w-sm mt-2">Live feed of Discord bot signal creations, TP hits, and SL hits.</p>
        </motion.div>
      </div>
    </div>
  );
}
