import type { Metadata } from "next";
import { Trophy } from "lucide-react";
export const metadata: Metadata = { title: "Leaderboard", description: "Top performing signal providers ranked by win rate and RR" };
export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Leaderboard</h1>
        <p className="text-text-muted text-sm mt-1">Top performing signal providers ranked by win rate and RR</p>
      </div>
      <div className="glass-card rounded-2xl p-16 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] flex items-center justify-center mb-5">
          <Trophy size={28} className="text-amber-400" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">Leaderboard Empty</h2>
        <p className="text-text-muted text-sm max-w-sm mx-auto">Animated ranking cards with Gold/Silver/Bronze medals, win rate, RR, and streak indicators will appear here.</p>
        <p className="text-text-faint text-xs mt-4">Phase 5 — User Management & Leaderboard</p>
      </div>
    </div>
  );
}
