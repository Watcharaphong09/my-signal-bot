"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { data: analytics } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await fetch("/api/analytics");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }
  });

  const calendarData = analytics?.calendarData || [];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long" });

  // Calendar logic
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Adjust so Monday is 0, Sunday is 6
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const totalSlots = Math.ceil((startOffset + daysInMonth) / 7) * 7;

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
          <button onClick={prevMonth} className="p-1 hover:bg-white/10 rounded transition-colors"><ChevronLeft size={20}/></button>
          <span className="font-medium min-w-[120px] text-center">{monthName} {year}</span>
          <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded transition-colors"><ChevronRight size={20}/></button>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden border border-white/10 p-6">
        <div className="grid grid-cols-7 gap-3 mb-2 text-center text-xs font-semibold text-white/40 uppercase tracking-wider">
          <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
        </div>
        
        <div className="grid grid-cols-7 gap-3">
          {Array.from({ length: totalSlots }).map((_, i) => {
            const dayNum = i - startOffset + 1;
            const isDay = dayNum > 0 && dayNum <= daysInMonth;
            
            const monthStr = String(month + 1).padStart(2, '0');
            const dayStr = String(dayNum).padStart(2, '0');
            const dateStr = `${year}-${monthStr}-${dayStr}`;
            
            const dayData = calendarData.find((d: any) => d.date === dateStr);
            const hasTrades = !!dayData;
            const isWin = hasTrades && dayData.rr > 0;
            const isLoss = hasTrades && dayData.rr < 0;

            const isToday = isDay && 
              new Date().getDate() === dayNum && 
              new Date().getMonth() === month && 
              new Date().getFullYear() === year;
            
            return (
              <div 
                key={i} 
                className={`min-h-[100px] rounded-lg p-2 flex flex-col ${isDay ? 'bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.04] transition-colors cursor-pointer' : 'opacity-0 pointer-events-none'}`}
              >
                {isDay && (
                  <span className={`text-xs font-medium mb-auto ${isToday ? 'text-emerald-400 bg-emerald-400/10 w-6 h-6 flex items-center justify-center rounded-full' : 'text-white/40'}`}>
                    {dayNum}
                  </span>
                )}
                
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
