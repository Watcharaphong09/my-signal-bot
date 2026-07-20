"use client";

import { Users, Activity, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

export default function ProvidersPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await fetch("/api/analytics");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }
  });

  const providersList = analytics?.providers || [];

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
        {providersList.map((p: any) => (
          <div key={p.id} className="glass-card rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-white text-lg">{p.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-white/40 mt-1">
                  <Activity size={12} className="text-blue-400" />
                  <span>{p.total} Total Signals</span>
                </div>
              </div>
              <span className={cn(
                "text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border",
                p.total > 0 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/5 text-white/40 border-white/10"
              )}>
                {p.total > 0 ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="text-xs text-white/50 mb-1">Win Rate</div>
                <div className="text-lg font-semibold text-white num">{p.winRate.toFixed(1)}%</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                <div className="text-xs text-white/50 mb-1">Net RR</div>
                <div className={cn("text-lg font-semibold num", p.rr > 0 ? "text-emerald-400" : p.rr < 0 ? "text-rose-400" : "text-white")}>
                  {p.rr > 0 ? `+${p.rr.toFixed(1)}` : p.rr.toFixed(1)}R
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
