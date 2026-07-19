import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
export const metadata: Metadata = { title: "Statistics", description: "In-depth trading performance statistics and metrics" };
export default function StatisticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Statistics</h1>
        <p className="text-text-muted text-sm mt-1">In-depth performance metrics and data analysis</p>
      </div>
      <div className="glass-card rounded-2xl p-16 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] flex items-center justify-center mb-5">
          <BarChart3 size={28} className="text-amber-400" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">Statistics Unavailable</h2>
        <p className="text-text-muted text-sm max-w-sm mx-auto">Best/worst assets, average trade duration, provider distribution, and session analysis charts will appear here.</p>
        <p className="text-text-faint text-xs mt-4">Phase 4 — Analytics & Visualization</p>
      </div>
    </div>
  );
}
