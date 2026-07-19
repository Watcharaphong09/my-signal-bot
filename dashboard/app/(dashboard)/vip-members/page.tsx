import type { Metadata } from "next";
import { Crown } from "lucide-react";
export const metadata: Metadata = { title: "VIP Members", description: "Manage VIP member subscriptions and access" };
export default function VipMembersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">VIP Members</h1>
        <p className="text-text-muted text-sm mt-1">Manage VIP member subscriptions, expiry dates, and access</p>
      </div>
      <div className="glass-card rounded-2xl p-16 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.2)] flex items-center justify-center mb-5">
          <Crown size={28} className="text-amber-400" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">No VIP Members</h2>
        <p className="text-text-muted text-sm max-w-sm mx-auto">Member table with Discord ID, role, expiry date, payment status, and renew/revoke action buttons will appear here.</p>
        <p className="text-text-faint text-xs mt-4">Phase 5 — User Management</p>
      </div>
    </div>
  );
}
