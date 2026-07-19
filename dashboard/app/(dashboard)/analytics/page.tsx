import type { Metadata } from "next";
import { TrendingUp } from "lucide-react";
export const metadata: Metadata = { title: "Analytics", description: "Deep analytics: equity curve, heatmaps, and session analysis" };
export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Analytics</h1>
        <p className="text-text-muted text-sm mt-1">Equity curves, daily heatmaps, win/loss charts, and session analysis</p>
      </div>
      <div className="glass-card rounded-2xl p-16 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] flex items-center justify-center mb-5">
          <TrendingUp size={28} className="text-emerald-400" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">Analytics Unavailable</h2>
        <p className="text-text-muted text-sm max-w-sm mx-auto">Interactive Recharts including equity curve, GitHub-style heatmap, win/loss pie chart, and session radar chart will appear here.</p>
        <p className="text-text-faint text-xs mt-4">Phase 4 — Advanced Data Visualization</p>
      </div>
    </div>
  );
}
