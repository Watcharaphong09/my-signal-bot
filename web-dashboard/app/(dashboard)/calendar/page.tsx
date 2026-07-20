"use client";

import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            <CalendarIcon className="text-emerald-400" size={24} />
            Performance Calendar
          </h1>
          <p className="text-sm text-white/50 mt-1">Daily overview of trades, win rates, and points.</p>
        </div>
        
        <div className="flex items-center gap-4 glass-card px-2 py-1 rounded-lg">
          <button className="p-2 text-white/40 hover:text-white transition-colors"><ChevronLeft size={18} /></button>
          <span className="text-sm font-medium text-white/80 w-24 text-center">July 2026</span>
          <button className="p-2 text-white/40 hover:text-white transition-colors"><ChevronRight size={18} /></button>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 border border-white/10">
        <div className="grid grid-cols-7 gap-4 text-center mb-4 text-xs font-medium text-white/40 uppercase tracking-wider">
          <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
        </div>
        <div className="grid grid-cols-7 gap-3">
          {Array.from({ length: 35 }).map((_, i) => {
            const isDay = i > 1 && i < 33;
            const dayNum = isDay ? i - 1 : "";
            const isWin = i % 5 === 0;
            const isLoss = i % 8 === 0;
            const hasTrades = isDay && (isWin || isLoss || i % 3 === 0);
            
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
                      {isWin ? '+45R' : isLoss ? '-12R' : '+5R'}
                    </div>
                    <div className="text-[9px] text-white/30 text-left pl-1">
                      {isWin ? '4 Trades' : '2 Trades'}
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
