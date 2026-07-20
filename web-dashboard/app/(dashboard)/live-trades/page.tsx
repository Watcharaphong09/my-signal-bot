"use client";

import { useQuery } from "@tanstack/react-query";
import { Zap, CheckCircle2, XCircle, TrendingUp, TrendingDown, Clock, Search } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

interface Trade {
  _id: string;
  asset: string;
  direction: "BUY" | "SELL";
  entry: number;
  sl: number;
  tp1: number;
  tp2: number;
  status: string;
  providerName: string;
  createdAt: string;
}

export default function LiveTradesPage() {
  const { data: trades, isLoading } = useQuery<Trade[]>({
    queryKey: ["live-trades"],
    queryFn: async () => {
      const res = await fetch("/api/trades?status=active");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <Zap className="text-amber-400" size={24} />
            Live Trades
          </h1>
          <p className="text-sm text-white/50 mt-1">Manage currently active signals across all providers.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text" 
            placeholder="Search active trades..." 
            className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-emerald-500/50 w-full sm:w-64 transition-colors"
          />
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/[0.02] border-b border-white/10 text-white/50 font-medium">
              <tr>
                <th className="px-4 py-3">Asset</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3 text-right">Entry</th>
                <th className="px-4 py-3 text-right">Targets (TP1/TP2)</th>
                <th className="px-4 py-3 text-right">Stop Loss</th>
                <th className="px-4 py-3">Time Running</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-16"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-24"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-16 ml-auto"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-20 ml-auto"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-16 ml-auto"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-16"></div></td>
                    <td className="px-4 py-4"><div className="h-6 bg-white/10 rounded w-32 ml-auto"></div></td>
                  </tr>
                ))
              ) : trades?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-white/40">
                    No active trades currently.
                  </td>
                </tr>
              ) : (
                trades?.map((trade) => (
                  <tr key={trade._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                      <span className={cn("w-1.5 h-1.5 rounded-full", trade.direction === "BUY" ? "bg-emerald-400" : "bg-rose-400")} />
                      {trade.asset}
                      <span className={cn("text-[10px] px-1.5 py-0.5 rounded border", 
                        trade.direction === "BUY" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                      )}>
                        {trade.direction}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/70">{trade.providerName}</td>
                    <td className="px-4 py-3 text-right num text-white/90">{trade.entry || "-"}</td>
                    <td className="px-4 py-3 text-right num text-emerald-400/80">{trade.tp1 || "-"} / {trade.tp2 || "-"}</td>
                    <td className="px-4 py-3 text-right num text-rose-400/80">{trade.sl || "-"}</td>
                    <td className="px-4 py-3 text-white/50 text-xs">
                      {new Date(trade.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs rounded border border-emerald-500/20 transition-colors">TP1</button>
                        <button className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs rounded border border-emerald-500/20 transition-colors">TP2</button>
                        <button className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs rounded border border-rose-500/20 transition-colors">SL</button>
                        <button className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white/70 text-xs rounded border border-white/10 transition-colors">BE</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
