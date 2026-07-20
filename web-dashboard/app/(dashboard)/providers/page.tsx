"use client";

import { Users, Activity, Target } from "lucide-react";

const providersList: any[] = [];

export default function ProvidersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <Users className="text-blue-400" size={24} />
            Signal Providers
          </h1>
          <p className="text-sm text-white/50 mt-1">Manage discord signal providers and view individual performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providersList.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 py-16 flex flex-col items-center justify-center text-center glass-card rounded-xl border border-white/5">
            <Users size={48} className="text-white/10 mb-4" />
            <h3 className="text-lg font-medium text-white/80">No Signal Providers</h3>
            <p className="text-sm text-white/40 mt-1">Provider data will appear here once connected to the database.</p>
          </div>
        )}
        {providersList.map((p) => (
          <div key={p.id} className="glass-card rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-semibold text-lg">
                {p.name.charAt(0)}
              </div>
              <span className="text-[10px] px-2 py-1 rounded-full uppercase font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-1">{p.name}</h3>
            <p className="text-sm text-white/40 mb-6 flex items-center gap-2">
              <Users size={14} /> {p.members} Active Subscribers
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <div className="text-[10px] text-white/40 uppercase mb-1 flex items-center gap-1"><Target size={12}/> Win Rate</div>
                <div className="text-lg font-semibold text-emerald-400">{p.winRate}%</div>
              </div>
              <div>
                <div className="text-[10px] text-white/40 uppercase mb-1 flex items-center gap-1"><Activity size={12}/> Total Signals</div>
                <div className="text-lg font-semibold text-white num">{p.totalTrades}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
