"use client";

import { useQuery } from "@tanstack/react-query";
import { Crown, Search, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface User {
  _id: string;
  discordId: string;
  roleId: string;
  startDate: string;
  expireDate: string;
  status: string;
}

export default function VIPMembersPage() {
  const { data: members, isLoading } = useQuery<User[]>({
    queryKey: ["vip-members"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }
  });
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <Crown className="text-gold" size={24} />
            VIP Members
          </h1>
          <p className="text-sm text-white/50 mt-1">Manage Discord VIP subscriptions and roles.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text" 
            placeholder="Search username or ID..." 
            className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-gold/50 w-full sm:w-64 transition-colors"
          />
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden border border-white/10">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/[0.02] border-b border-white/10 text-white/50 font-medium">
            <tr>
              <th className="px-4 py-3">Discord User</th>
              <th className="px-4 py-3">Discord ID</th>
              <th className="px-4 py-3">Join Date</th>
              <th className="px-4 py-3">Expiry Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-32"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-24"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-20"></div></td>
                  <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-20"></div></td>
                  <td className="px-4 py-4"><div className="h-6 bg-white/10 rounded-full w-16"></div></td>
                  <td className="px-4 py-4"><div className="h-6 bg-white/10 rounded w-16 ml-auto"></div></td>
                </tr>
              ))
            ) : !members || members.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-white/40">
                  No VIP members found.
                </td>
              </tr>
            ) : members.map((m) => {
              const isActive = m.status === 'active' && new Date(m.expireDate) > new Date();
              return (
                <tr key={m._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-4 font-medium text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs">
                      {m.discordId.substring(0, 2)}
                    </div>
                    {m.discordId}
                  </td>
                  <td className="px-4 py-4 text-white/70">{m.discordId}</td>
                  <td className="px-4 py-4 text-white/70">{new Date(m.startDate).toLocaleDateString()}</td>
                  <td className="px-4 py-4 text-white/70">{new Date(m.expireDate).toLocaleDateString()}</td>
                  <td className="px-4 py-4">
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold border",
                      isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    )}>
                      {isActive ? 'Active' : 'Expired'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-1.5 text-white/40 hover:text-white/80 hover:bg-white/10 rounded transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-1.5 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
