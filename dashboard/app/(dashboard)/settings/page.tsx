import type { Metadata } from "next";
import { Settings } from "lucide-react";
export const metadata: Metadata = { title: "Settings", description: "Configure bot settings, webhooks, and system preferences" };
export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">Settings</h1>
        <p className="text-text-muted text-sm mt-1">Configure Discord webhooks, MongoDB, bot behavior, and system preferences</p>
      </div>
      <div className="glass-card rounded-2xl p-16 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.2)] flex items-center justify-center mb-5">
          <Settings size={28} className="text-violet-400" />
        </div>
        <h2 className="text-lg font-semibold text-text-primary mb-2">Settings</h2>
        <p className="text-text-muted text-sm max-w-sm mx-auto">Theme, Discord Webhook URLs, MongoDB URI, bot status controls, and timezone settings will appear here.</p>
        <p className="text-text-faint text-xs mt-4">Phase 6 — Calendar &amp; Settings</p>
      </div>
    </div>
  );
}
