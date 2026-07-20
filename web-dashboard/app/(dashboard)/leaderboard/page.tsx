"use client";

import { Trophy, Medal, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export default function LeaderboardPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await fetch("/api/analytics");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }
  });

  const providers = analytics?.providers || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
          <Trophy className="text-gold" size={24} />
          Provider Leaderboard
        </h1>
        <p className="text-sm text-white/50 mt-1">Ranking based on Win Rate and Net Risk-Reward (RR).</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {providers.length === 0 && (
          <div className="md:col-span-3 py-16 flex flex-col items-center justify-center text-center glass-card rounded-xl border border-white/5">
            <Trophy size={48} className="text-white/10 mb-4" />
            <h3 className="text-lg font-medium text-white/80">Leaderboard Empty</h3>
            <p className="text-sm text-white/40 mt-1">Ranking will appear here once trade data is available.</p>
          </div>
        )}
        {providers.map((p: any, index: number) => {
          const rank = index + 1;
          let color = "text-white/60";
          let bg = "bg-white/5";
          let border = "border-white/10";
          if (rank === 1) { color = "text-amber-400"; bg = "bg-amber-500/10"; border = "border-amber-500/20"; }
          if (rank === 2) { color = "text-slate-300"; bg = "bg-slate-400/10"; border = "border-slate-400/20"; }
          if (rank === 3) { color = "text-orange-400"; bg = "bg-orange-500/10"; border = "border-orange-500/20"; }

          return (
          <div key={p.id} className={cn("glass-card rounded-xl p-6 relative overflow-hidden group border", border)}>
            <div className={cn("absolute -right-10 -top-10 w-32 h-32 blur-3xl opacity-20", bg)} />
            
            <div className="flex justify-between items-start mb-6 relative">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg", bg, color)}>
                  #{rank}
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-white/90 transition-colors">{p.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-white/50 mt-1">
                    <Trophy size={12} className={color} />
                    <span>Rank {rank} Provider</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative">
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="text-xs text-white/50 mb-1">Win Rate</div>
                <div className="text-lg font-semibold text-white num">{p.winRate.toFixed(1)}%</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="text-xs text-white/50 mb-1">Net RR</div>
                <div className={cn("text-lg font-semibold num", p.rr > 0 ? "text-emerald-400" : p.rr < 0 ? "text-rose-400" : "text-white")}>
                  {p.rr > 0 ? `+${p.rr.toFixed(1)}` : p.rr.toFixed(1)}R
                </div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="text-xs text-white/50 mb-1">Total Trades</div>
                <div className="text-lg font-semibold text-white num">{p.total}</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="text-xs text-white/50 mb-1">Current Streak</div>
                <div className="text-lg font-semibold text-white num flex items-center gap-1">
                  {p.currentStreak}W <Star size={12} className="text-amber-400" />
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
