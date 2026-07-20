"use client";

import { useQuery } from "@tanstack/react-query";
import { History, Download, Filter, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Trade {
  _id: string;
  asset: string;
  direction: "BUY" | "SELL";
  status: string;
  providerName: string;
  rr: number;
  points: number;
  createdAt: string;
}

export default function HistoryPage() {
  const { data: trades, isLoading } = useQuery<Trade[]>({
    queryKey: ["history-trades"],
    queryFn: async () => {
      const res = await fetch("/api/trades?status=closed");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <History className="text-blue-400" size={24} />
            Trade History
          </h1>
          <p className="text-sm text-white/50 mt-1">Review and analyze all closed trading signals.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input 
              type="text" 
              placeholder="Search history..." 
              className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 w-full sm:w-64 transition-colors"
            />
          </div>
          <button className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <Filter size={16} />
          </button>
          <button className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Advanced Data Table */}
      <div className="glass-card rounded-xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/[0.02] border-b border-white/10 text-white/50 font-medium">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Asset</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Points</th>
                <th className="px-4 py-3 text-right">Net RR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-24"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-16"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-20"></div></td>
                    <td className="px-4 py-4"><div className="h-6 bg-white/10 rounded-full w-16"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-12 ml-auto"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-12 ml-auto"></div></td>
                  </tr>
                ))
              ) : trades?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-white/40">
                    No closed trades found.
                  </td>
                </tr>
              ) : (
                trades?.map((trade) => {
                  const isWin = trade.rr > 0 || trade.points > 0 || trade.status === "WIN" || trade.status.includes("TP");
                  return (
                    <tr key={trade._id} className="hover:bg-white/[0.02] transition-colors cursor-pointer">
                      <td className="px-4 py-3 text-white/50 text-xs">
                        {new Date(trade.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                      </td>
                      <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                        {trade.direction === "BUY" ? <ArrowUpRight size={14} className="text-emerald-400" /> : <ArrowDownRight size={14} className="text-rose-400" />}
                        {trade.asset}
                      </td>
                      <td className="px-4 py-3 text-white/70">{trade.providerName}</td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full border uppercase tracking-wider font-semibold",
                          isWin ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                        )}>
                          {trade.status}
                        </span>
                      </td>
                      <td className={cn("px-4 py-3 text-right num font-medium", isWin ? "text-emerald-400" : "text-rose-400")}>
                        {trade.points > 0 ? `+${trade.points}` : trade.points}
                      </td>
                      <td className={cn("px-4 py-3 text-right num font-medium", isWin ? "text-emerald-400" : "text-rose-400")}>
                        {trade.rr > 0 ? `+${trade.rr.toFixed(2)}` : (trade.rr || 0).toFixed(2)} R
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
          <span>Showing 1 to {trades?.length || 0} of {trades?.length || 0} entries</span>
          <div className="flex gap-1">
            <button className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50" disabled>Prev</button>
            <button className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
