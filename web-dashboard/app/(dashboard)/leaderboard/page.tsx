"use client";

import { Trophy, Medal, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const providers: any[] = [];

export default function LeaderboardPage() {
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
        {providers.map((p) => (
          <div key={p.rank} className={cn("glass-card rounded-xl p-6 relative overflow-hidden group border", p.border)}>
            <div className={cn("absolute -right-10 -top-10 w-32 h-32 blur-3xl opacity-20", p.bg)} />
            
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl", p.bg, p.color)}>
                #{p.rank}
              </div>
              <Medal size={24} className={p.color} />
            </div>

            <div className="relative z-10">
              <h3 className="text-xl font-semibold text-white mb-4">{p.name}</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/40">Win Rate</span>
                  <span className="text-sm font-semibold text-emerald-400">{p.winRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/40">Net RR</span>
                  <span className="text-sm font-semibold text-violet-400">{p.rr}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/40">Total Trades</span>
                  <span className="text-sm font-medium text-white/80 num">{p.trades}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/40">Current Streak</span>
                  <span className="text-sm font-medium text-amber-400 flex items-center gap-1">
                    {p.streak} <Star size={12} className="fill-amber-400" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
