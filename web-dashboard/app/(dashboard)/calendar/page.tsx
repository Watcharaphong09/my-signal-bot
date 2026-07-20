"use client";

import { useQuery } from "@tanstack/react-query";

import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPage() {
  const { data: analytics } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await fetch("/api/analytics");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }
  });

  const calendarData = analytics?.calendarData || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <CalendarIcon className="text-emerald-400" size={24} />
            Performance Calendar
          </h1>
          <p className="text-sm text-white/50 mt-1">Daily overview of trades, win rates, and points.</p>
        </div>
        
        <div className="flex items-center gap-4 text-white">
          <button className="p-1 hover:bg-white/10 rounded transition-colors"><ChevronLeft size={20}/></button>
          <span className="font-medium min-w-[120px] text-center">July 2026</span>
          <button className="p-1 hover:bg-white/10 rounded transition-colors"><ChevronRight size={20}/></button>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden border border-white/10 p-6">
        <div className="grid grid-cols-7 gap-3 mb-2 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">
          <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
        </div>
        
        <div className="grid grid-cols-7 gap-3">
          {Array.from({ length: 35 }).map((_, i) => {
            const isDay = i > 1 && i < 33;
            const dayNum = isDay ? i - 1 : "";
            
            // Note: Since this is a static mock calendar layout for July 2026, 
            // we will try to match the dayNum with the dates from the DB
            // In a real implementation we would generate the grid dynamically based on the current month.
            const dateStr = `2026-07-${String(dayNum).padStart(2, '0')}`;
            const dayData = calendarData.find((d: any) => d.date === dateStr);
            const hasTrades = !!dayData;
            const isWin = hasTrades && dayData.rr > 0;
            const isLoss = hasTrades && dayData.rr < 0;
            
            return (
              <div 
                key={i} 
                className={`min-h-[100px] rounded-lg p-2 flex flex-col ${isDay ? 'bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.04] transition-colors cursor-pointer' : 'opacity-0 pointer-events-none'}`}
              >
                <span className={`text-xs font-medium mb-auto ${i === 15 ? 'text-emerald-400 bg-emerald-400/10 w-6 h-6 flex items-center justify-center rounded-full' : 'text-white/40'}`}>
                  {dayNum}
                </span>
                
                {hasTrades && (
                  <div className="mt-2 space-y-1">
                    <div className={`text-[10px] px-1 py-0.5 rounded ${isWin ? 'bg-emerald-500/20 text-emerald-400' : isLoss ? 'bg-rose-500/20 text-rose-400' : 'bg-white/10 text-white/70'}`}>
                      {dayData.rr > 0 ? '+' : ''}{dayData.rr.toFixed(1)}R
                    </div>
                    <div className="text-[9px] text-white/30 text-left pl-1">
                      {dayData.trades} Trades
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
