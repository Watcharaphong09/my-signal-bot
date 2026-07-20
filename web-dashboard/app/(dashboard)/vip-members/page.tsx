"use client";

import { useQuery } from "@tanstack/react-query";
import { Crown, Search, Edit2, Trash2, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface User {
  _id: string;
  discordId: string;
  username?: string;
  roleId: string;
  startDate: string;
  expireDate: string;
  status: string;
}

export default function VIPMembersPage() {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof User>("expireDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const { data: members, isLoading } = useQuery<User[]>({
    queryKey: ["vip-members"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }
  });

  const handleSort = (field: keyof User) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedMembers = members?.filter(m => 
    (m.username?.toLowerCase().includes(search.toLowerCase()) || false) || 
    m.discordId.includes(search)
  ).sort((a, b) => {
    let valA: any = a[sortField] || "";
    let valB: any = b[sortField] || "";
    if (sortField === "startDate" || sortField === "expireDate") {
      valA = new Date(valA as string).getTime();
      valB = new Date(valB as string).getTime();
    }
    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  }) || [];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <Crown className="text-amber-400" size={24} />
            VIP Members
          </h1>
          <p className="text-sm text-white/50 mt-1">Manage Discord VIP subscriptions and roles.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <Input 
            type="text" 
            placeholder="Search username or ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/[0.02] border-b border-white/10 text-white/50 font-medium">
              <tr>
                <th className="px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("username")}>
                  <div className="flex items-center gap-1">Discord User <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-4 py-3">Discord ID</th>
                <th className="px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("startDate")}>
                  <div className="flex items-center gap-1">Join Date <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("expireDate")}>
                  <div className="flex items-center gap-1">Expiry Date <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort("status")}>
                  <div className="flex items-center gap-1">Status <ArrowUpDown size={12} /></div>
                </th>
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
              ) : filteredAndSortedMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-white/40">
                    No VIP members found.
                  </td>
                </tr>
              ) : filteredAndSortedMembers.map((m) => {
                const isActive = m.status === 'active' && new Date(m.expireDate) > new Date();
                return (
                  <tr key={m._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-4 font-medium text-white flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs">
                        {(m.username || m.discordId).substring(0, 2).toUpperCase()}
                      </div>
                      {m.username || 'Unknown User'}
                    </td>
                    <td className="px-4 py-4 text-white/70 font-mono text-xs">{m.discordId}</td>
                    <td className="px-4 py-4 text-white/70">{new Date(m.startDate).toLocaleDateString()}</td>
                    <td className="px-4 py-4 text-white/70">{new Date(m.expireDate).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <Badge variant={isActive ? "success" : "destructive"}>
                        {isActive ? 'Active' : 'Expired'}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit2 size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-400 hover:bg-red-500/10">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
