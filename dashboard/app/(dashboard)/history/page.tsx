import type { Metadata } from "next";
import { History } from "lucide-react";

export const metadata: Metadata = {
  title: "Trade History",
  description: "Browse and filter all completed trading signals",
};

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Trade History</h1>
        <p className="text-text-muted text-sm mt-1">Browse and filter all completed trading signals</p>
      </div>
      <div className="glass-card rounded-2xl p-16 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.2)] flex items-center justify-center mb-5">
          <History size={28} className="text-cobalt" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">No Trade History</h2>
        <p className="text-text-muted text-sm max-w-sm mx-auto">Paginated history table with date filtering, asset filtering, CSV/PDF export, and advanced search will appear here.</p>
        <p className="text-text-faint text-xs mt-4">Phase 3 — Signal Management</p>
      </div>
    </div>
  );
}
