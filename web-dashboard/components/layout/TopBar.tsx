"use client";

import { useEffect, useState } from "react";
import { Search, Bell, Monitor, User } from "lucide-react";
import toast from "react-hot-toast";

export function TopBar({ onOpenCommand }: { onOpenCommand: () => void }) {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-[64px] border-b border-white/5 bg-[#080B0F]/80 backdrop-blur-xl sticky top-0 z-30 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {mounted && (
          <div className="text-sm font-medium text-white/50">
            {time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            <span className="mx-2">•</span>
            <span className="font-mono">{time.toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search / Command Palette Trigger */}
        <button
          onClick={onOpenCommand}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors text-sm w-64"
        >
          <Search size={14} />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded border border-white/10">⌘K</kbd>
        </button>

        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* Discord Status */}
        <div className="flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Bot Online
        </div>

        {/* Actions */}
        <button onClick={() => toast('Notifications feature coming soon!')} className="p-2 text-white/50 hover:text-white transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
        </button>

        <button onClick={() => toast('Display settings coming soon!')} className="p-2 text-white/50 hover:text-white transition-colors">
          <Monitor size={18} />
        </button>

        {/* Profile */}
        <button onClick={() => toast('Profile settings coming soon!')} className="flex items-center gap-2 pl-2 cursor-pointer transition-transform hover:scale-105">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center text-white font-medium text-sm border border-white/10 shadow-lg">
            A
          </div>
        </button>
      </div>
    </header>
  );
}
