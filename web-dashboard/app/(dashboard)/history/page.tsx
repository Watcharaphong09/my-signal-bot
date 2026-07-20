"use client";

import { useQuery } from "@tanstack/react-query";
import { History, Download, Filter, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Trade {
  _id: string;
  asset: string;
  action: "BUY" | "SELL";
  status: string;
  providerName: string;
  rr: number;
  points: number;
  createdAt: string;
}

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { data: trades, isLoading } = useQuery<Trade[]>({
    queryKey: ["history-trades"],
    queryFn: async () => {
      const res = await fetch("/api/trades?status=closed");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const filteredTrades = trades?.filter(trade => 
    trade.asset.toLowerCase().includes(search.toLowerCase()) || 
    trade.providerName.toLowerCase().includes(search.toLowerCase()) ||
    trade.status.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filteredTrades.length / itemsPerPage) || 1;
  const paginatedTrades = filteredTrades.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const exportCSV = () => {
    if (!trades) return;
    const headers = ["Date", "Asset", "Direction", "Provider", "Status", "Points", "Net RR"];
    const csvContent = [
      headers.join(","),
      ...filteredTrades.map(t => 
        `"${new Date(t.createdAt).toISOString()}","${t.asset}","${t.action}","${t.providerName}","${t.status}",${t.points || 0},${t.rr || 0}`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trade-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <History className="text-blue-400" size={24} />
            Trade History
          </h1>
          <p className="text-sm text-white/50 mt-1">Review and analyze all closed trading signals.</p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <Input 
              type="text" 
              placeholder="Search history..." 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter size={16} />
          </Button>
          <Button variant="outline" size="icon" onClick={exportCSV}>
            <Download size={16} />
          </Button>
        </div>
      </div>

      {/* Advanced Data Table */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-white/[0.02] border-b border-white/10 text-white/50 font-medium">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Asset</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Points</th>
                <th className="px-4 py-3 text-right">Net RR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-24"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-16"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-20"></div></td>
                    <td className="px-4 py-4"><div className="h-6 bg-white/10 rounded-full w-16"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-12 ml-auto"></div></td>
                    <td className="px-4 py-4"><div className="h-4 bg-white/10 rounded w-12 ml-auto"></div></td>
                  </tr>
                ))
              ) : paginatedTrades.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-white/40">
                    No closed trades found.
                  </td>
                </tr>
              ) : (
                paginatedTrades.map((trade) => {
                  const isWin = trade.rr > 0 || trade.points > 0 || trade.status === "WIN" || trade.status.includes("TP");
                  return (
                    <tr key={trade._id} className="hover:bg-white/[0.02] transition-colors cursor-pointer">
                      <td className="px-4 py-3 text-white/50 text-xs">
                        {new Date(trade.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                      </td>
                      <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                        {trade.action === "BUY" ? <ArrowUpRight size={14} className="text-emerald-400" /> : <ArrowDownRight size={14} className="text-rose-400" />}
                        {trade.asset}
                      </td>
                      <td className="px-4 py-3 text-white/70">{trade.providerName}</td>
                      <td className="px-4 py-3">
                        <Badge variant={isWin ? "success" : "destructive"}>
                          {trade.status}
                        </Badge>
                      </td>
                      <td className={cn("px-4 py-3 text-right num font-medium", isWin ? "text-emerald-400" : "text-rose-400")}>
                        {trade.points > 0 ? `+${trade.points}` : trade.points}
                      </td>
                      <td className={cn("px-4 py-3 text-right num font-medium", isWin ? "text-emerald-400" : "text-rose-400")}>
                        {trade.rr > 0 ? `+${trade.rr.toFixed(2)}` : (trade.rr || 0).toFixed(2)} R
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
          <span>Showing {(page - 1) * itemsPerPage + 1} to {Math.min(page * itemsPerPage, filteredTrades.length)} of {filteredTrades.length} entries</span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Prev
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
