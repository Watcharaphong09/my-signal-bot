"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Zap, Search, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface Trade {
  _id: string;
  asset: string;
  action: "BUY" | "SELL";
  entry: number;
  sl: number;
  tp1: number;
  tp2: number;
  status: string;
  providerName: string;
  createdAt: string;
}

export default function LiveTradesPage() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: trades, isLoading, isError } = useQuery<Trade[]>({
    queryKey: ["live-trades"],
    queryFn: async () => {
      const res = await fetch("/api/trades?status=active");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const filteredTrades = trades?.filter(trade => 
    trade.asset.toLowerCase().includes(search.toLowerCase()) || 
    trade.providerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <Zap className="text-amber-400" size={24} />
            Live Trades
          </h1>
          <p className="text-sm text-white/50 mt-1">Manage currently active signals across all providers.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <Input 
            type="text" 
            placeholder="Search trades..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white/5"
          />
        </div>
      </div>

      {isError && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 text-sm">
          <AlertCircle size={16} />
          Failed to load live trades.
        </div>
      )}

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/[0.02] border-b border-white/10 text-white/50 font-medium">
              <tr>
                <th className="px-4 py-3 w-8"></th>
                <th className="px-4 py-3">Asset</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3 text-right">Entry</th>
                <th className="px-4 py-3 text-right">Targets (TP1/TP2)</th>
                <th className="px-4 py-3 text-right">Stop Loss</th>
                <th className="px-4 py-3">Time Running</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-16"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-24"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-16 ml-auto"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-20 ml-auto"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-16 ml-auto"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-16"></div></td>
                    <td className="px-4 py-4"><div className="h-6 bg-white/10 rounded w-32 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredTrades?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-white/40">
                    No active trades match your search.
                  </td>
                </tr>
              ) : (
                filteredTrades?.map((trade) => (
                  <React.Fragment key={trade._id}>
                    <tr 
                      className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                      onClick={() => setExpandedId(expandedId === trade._id ? null : trade._id)}
                    >
                      <td className="px-4 py-3 text-white/40">
                        {expandedId === trade._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </td>
                      <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                        {trade.asset}
                        <Badge variant={trade.action === "BUY" ? "success" : "destructive"}>
                          {trade.action}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-white/70">{trade.providerName}</td>
                      <td className="px-4 py-3 text-right num text-white/90">{trade.entry || "-"}</td>
                      <td className="px-4 py-3 text-right num text-emerald-400/80">{trade.tp1 || "-"} / {trade.tp2 || "-"}</td>
                      <td className="px-4 py-3 text-right num text-rose-400/80">{trade.sl || "-"}</td>
                      <td className="px-4 py-3 text-white/50 text-xs">
                        {new Date(trade.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="sm" variant="success" onClick={() => toast("TP1 Feature Coming Soon!")}>TP1</Button>
                          <Button size="sm" variant="success" onClick={() => toast("TP2 Feature Coming Soon!")}>TP2</Button>
                          <Button size="sm" variant="destructive" onClick={() => toast("SL Feature Coming Soon!")}>SL</Button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === trade._id && (
                      <tr className="bg-white/[0.01]">
                        <td colSpan={8} className="px-4 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-white/40 mb-1">Status</p>
                              <p className="text-white">{trade.status}</p>
                            </div>
                            <div>
                              <p className="text-white/40 mb-1">Trade ID</p>
                              <p className="text-white font-mono text-xs">{(trade as any).tradeId || trade._id}</p>
                            </div>
                            {/* Expandable details can go here */}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
