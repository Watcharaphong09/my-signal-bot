"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Bell, ChevronDown, Wifi, WifiOff, User, LogOut, Settings, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TopNavProps {
  onMenuClick: () => void;
  onCommandPaletteOpen: () => void;
}

function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const day = now.toLocaleDateString("en-US", { weekday: "short" });
  const date = now.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
      <div className="text-right">
        <p className="text-[10px] text-text-faint font-medium uppercase tracking-wider">{day}, {date}</p>
        <p className="text-[13px] font-mono font-semibold text-text-primary tracking-tight tabular-nums leading-none mt-0.5">
          {time}
        </p>
      </div>
    </div>
  );
}

function DiscordStatus() {
  const [status] = useState<"online" | "offline">("online");

  return (
    <div className={cn(
      "hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-[12px] font-semibold transition-all",
      status === "online"
        ? "bg-emerald-dim border-emerald-500/20 text-emerald-400"
        : "bg-ruby-dim border-red-500/20 text-red-400"
    )}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        status === "online"
          ? "bg-emerald-400 animate-pulse-dot"
          : "bg-red-400"
      )} />
      {status === "online" ? "Bot Online" : "Bot Offline"}
    </div>
  );
}

function NotificationBell() {
  const [open, setOpen] = useState(false);
  const count = 3;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-[rgba(255,255,255,0.06)] transition-all border border-transparent hover:border-[rgba(255,255,255,0.06)]"
      >
        <Bell size={16} />
        {count > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-ruby border border-[#0A0E14]" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 w-80 z-50 glass-card rounded-xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
                <p className="text-[13px] font-semibold text-text-primary">Notifications</p>
                <span className="badge badge-ruby">{count} new</span>
              </div>
              <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                {[
                  { icon: "🎯", text: "XAUUSD TP1 Hit", time: "2m ago", color: "emerald" },
                  { icon: "⚡", text: "New signal: EURUSD BUY", time: "15m ago", color: "cobalt" },
                  { icon: "🛑", text: "GBPUSD Hit SL", time: "1h ago", color: "ruby" },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-[rgba(255,255,255,0.02)] cursor-pointer transition-colors">
                    <span className="text-base">{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-text-secondary truncate">{n.text}</p>
                      <p className="text-[11px] text-text-faint mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-[rgba(255,255,255,0.06)]">
                <button className="text-[12px] text-cobalt hover:text-cobalt/80 font-medium w-full text-center transition-colors">
                  View all notifications
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function AdminProfile() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.04)] border border-transparent hover:border-[rgba(255,255,255,0.06)] transition-all"
      >
        {/* Avatar */}
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center flex-shrink-0">
          <span className="text-[11px] font-bold text-white">A</span>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-[12px] font-semibold text-text-primary leading-none">Admin</p>
          <p className="text-[10px] text-text-faint mt-0.5">Administrator</p>
        </div>
        <ChevronDown
          size={12}
          className={cn("text-text-faint transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 w-52 z-50 glass-card rounded-xl overflow-hidden py-1.5"
            >
              <div className="px-4 py-2.5 border-b border-[rgba(255,255,255,0.06)] mb-1">
                <p className="text-[12px] font-semibold text-text-primary">Admin</p>
                <p className="text-[11px] text-text-faint">admin@signalbot.io</p>
              </div>
              {[
                { icon: User, label: "Profile" },
                { icon: Settings, label: "Settings" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-text-muted hover:text-text-primary hover:bg-[rgba(255,255,255,0.04)] transition-colors"
                >
                  <item.icon size={14} />
                  {item.label}
                </button>
              ))}
              <div className="my-1.5 mx-3 h-px bg-[rgba(255,255,255,0.05)]" />
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-400 hover:bg-red-500/08 transition-colors">
                <LogOut size={14} />
                Sign Out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TopNav({ onMenuClick, onCommandPaletteOpen }: TopNavProps) {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-[240px] h-[60px] z-30 flex items-center justify-between px-4 md:px-6 gap-4 bg-[rgba(8,11,15,0.9)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)] transition-all duration-300">
      {/* Left: Mobile menu + Clock */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-[rgba(255,255,255,0.06)] transition-colors"
        >
          <Menu size={16} />
        </button>

        <LiveClock />
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md">
        <button
          onClick={onCommandPaletteOpen}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.05)] transition-all group"
        >
          <Search size={13} className="text-text-faint group-hover:text-text-muted transition-colors flex-shrink-0" />
          <span className="text-[12.5px] text-text-faint group-hover:text-text-muted transition-colors flex-1 text-left">
            Search trades, providers...
          </span>
          <div className="hidden sm:flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[10px] font-mono text-text-faint">
              ⌘
            </kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[10px] font-mono text-text-faint">
              K
            </kbd>
          </div>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        <DiscordStatus />
        <NotificationBell />
        <div className="w-px h-5 bg-[rgba(255,255,255,0.06)] mx-1" />
        <AdminProfile />
      </div>
    </header>
  );
}
