import type { Metadata } from "next";
import { Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Live Trades",
  description: "Monitor active trading signals in real-time",
};

export default function LiveTradesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse-dot" />
          Live Trades
        </h1>
        <p className="text-text-muted text-sm mt-1">Monitor all active trading signals in real-time</p>
      </div>

      <div className="glass-card rounded-2xl p-16 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-dim border border-emerald-500/20 flex items-center justify-center mb-5">
          <Zap size={28} className="text-emerald-400" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">No Active Trades</h2>
        <p className="text-text-muted text-sm max-w-sm mx-auto">
          Live signal table with expandable rows, TP/SL action buttons, and real-time updates will appear here.
        </p>
        <p className="text-text-faint text-xs mt-4">Phase 3 — Signal Management</p>
      </div>
    </div>
  );
}
