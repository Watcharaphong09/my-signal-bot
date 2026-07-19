import type { Metadata } from "next";
import { Calendar } from "lucide-react";
export const metadata: Metadata = { title: "Calendar", description: "Monthly trading calendar with daily P&L and win rate" };
export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Trading Calendar</h1>
        <p className="text-text-muted text-sm mt-1">Monthly view of daily P&amp;L, win rate, and trade activity</p>
      </div>
      <div className="glass-card rounded-2xl p-16 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] flex items-center justify-center mb-5">
          <Calendar size={28} className="text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">Calendar Empty</h2>
        <p className="text-text-muted text-sm max-w-sm mx-auto">Full-month calendar with green/red day indicators, clickable day modals showing trade lists, and P&amp;L summaries will appear here.</p>
        <p className="text-text-faint text-xs mt-4">Phase 6 — Calendar &amp; Settings</p>
      </div>
    </div>
  );
}
