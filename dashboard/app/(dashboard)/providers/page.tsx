import type { Metadata } from "next";
import { Users } from "lucide-react";
export const metadata: Metadata = { title: "Providers", description: "Manage and view all signal providers" };
export default function ProvidersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Providers</h1>
        <p className="text-text-muted text-sm mt-1">Manage and view all signal providers and their performance</p>
      </div>
      <div className="glass-card rounded-2xl p-16 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.2)] flex items-center justify-center mb-5">
          <Users size={28} className="text-violet-400" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">No Providers Yet</h2>
        <p className="text-text-muted text-sm max-w-sm mx-auto">Provider cards with win rates, RR metrics, streak counters, and profile links will appear here.</p>
        <p className="text-text-faint text-xs mt-4">Phase 5 — User Management</p>
      </div>
    </div>
  );
}
