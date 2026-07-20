"use client";

import { Settings as SettingsIcon, Save, Webhook, Database, Clock } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <SettingsIcon className="text-slate-400" size={24} />
            System Settings
          </h1>
          <p className="text-sm text-white/50 mt-1">Configure global dashboard and bot integrations.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-lg transition-colors border border-white/5">
          <Save size={16} /> Save Changes
        </button>
      </div>

      <div className="grid gap-6">
        {/* Discord Config */}
        <div className="glass-card rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
            <Webhook className="text-indigo-400" size={18} /> Discord Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Bot Token</label>
              <input type="password" value="*************************" readOnly className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white/50 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Signal Channel ID</label>
              <input type="text" defaultValue="123456789012345678" className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-lg px-4 py-2 text-sm text-white outline-none transition-colors" />
            </div>
          </div>
        </div>

        {/* Database Config */}
        <div className="glass-card rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
            <Database className="text-emerald-400" size={18} /> Database Connection
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">MongoDB URI</label>
              <input type="password" value="mongodb+srv://..." readOnly className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-4 py-2 text-sm text-emerald-400/50 outline-none" />
              <p className="text-xs text-emerald-400/60 mt-2">Connected successfully</p>
            </div>
          </div>
        </div>

        {/* Localization */}
        <div className="glass-card rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-4">
            <Clock className="text-amber-400" size={18} /> Localization
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Default Timezone</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white outline-none appearance-none">
                <option value="UTC">UTC (Universal Coordinated Time)</option>
                <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                <option value="America/New_York">America/New_York (EST)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
