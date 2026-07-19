import type { Metadata } from "next";
import { LayoutDashboard, TrendingUp, Zap, Users, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of your trading signal performance",
};

const placeholderStats = [
  { label: "Total Trades", value: "—", icon: LayoutDashboard, color: "cobalt" },
  { label: "Win Rate", value: "—", icon: TrendingUp, color: "emerald" },
  { label: "Net RR", value: "—", icon: ArrowUpRight, color: "violet" },
  { label: "Active Trades", value: "—", icon: Zap, color: "gold" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Dashboard</h1>
        <p className="text-text-muted text-sm mt-1">
          Overview of your trading signal performance and bot activity
        </p>
      </div>

      {/* Placeholder KPI grid — will be fully built in Phase 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {placeholderStats.map((stat) => (
          <div key={stat.label} className="card p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-${stat.color}-dim border border-${stat.color}-500/20 flex-shrink-0`}>
              <stat.icon size={18} className={`text-${stat.color}`} />
            </div>
            <div>
              <p className="text-text-faint text-[11px] font-semibold uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-text-primary num mt-0.5 shimmer w-16 h-7 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Coming soon notice */}
      <div className="glass-card rounded-2xl p-10 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cobalt/20 to-violet/20 border border-cobalt/20 flex items-center justify-center mb-5">
          <LayoutDashboard size={28} className="text-cobalt" />
        </div>
        <h2 className="text-lg font-bold text-text-primary mb-2">Phase 2 Coming Soon</h2>
        <p className="text-text-muted text-sm max-w-md mx-auto">
          KPI Cards with animated numbers, AI Insights widget, equity curve charts, and skeleton loaders will be built in Phase 2.
        </p>
        <div className="flex items-center justify-center gap-2 mt-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-dot" />
          <span className="text-emerald-400 text-sm font-medium">Phase 1 Complete — Layout & Navigation</span>
        </div>
      </div>
    </div>
  );
}
