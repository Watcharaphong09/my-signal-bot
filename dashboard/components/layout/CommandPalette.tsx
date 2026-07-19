"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Zap, History, Users, BarChart3,
  Trophy, Crown, TrendingUp, Calendar, Settings,
  Search, ArrowRight, Hash, Keyboard,
} from "lucide-react";

const commands = [
  {
    group: "Navigation",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/", shortcut: "G D" },
      { icon: Zap, label: "Live Trades", href: "/live-trades", shortcut: "G L" },
      { icon: History, label: "Trade History", href: "/history", shortcut: "G H" },
      { icon: Users, label: "Providers", href: "/providers" },
      { icon: BarChart3, label: "Statistics", href: "/statistics" },
      { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
      { icon: Crown, label: "VIP Members", href: "/vip-members" },
      { icon: TrendingUp, label: "Analytics", href: "/analytics" },
      { icon: Calendar, label: "Calendar", href: "/calendar" },
      { icon: Settings, label: "Settings", href: "/settings", shortcut: "G S" },
    ],
  },
  {
    group: "Quick Actions",
    items: [
      { icon: Zap, label: "New Signal", href: "/live-trades?action=new", shortcut: "N" },
      { icon: Crown, label: "Add VIP Member", href: "/vip-members?action=add" },
    ],
  },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // CTRL+K handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!open) {
          // Trigger open from parent — this is handled by parent
        }
      }
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Reset search on close
  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  const handleSelect = useCallback((href: string) => {
    router.push(href);
    onClose();
  }, [router, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[998] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Palette */}
          <motion.div
            key="palette"
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-[15vh] left-1/2 -translate-x-1/2 z-[999] w-full max-w-[580px] px-4"
          >
            <Command
              className="rounded-2xl overflow-hidden shadow-command"
              style={{
                background: "#0F1318",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              shouldFilter={true}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-[rgba(255,255,255,0.07)]">
                <Search size={15} className="text-text-faint flex-shrink-0" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search pages, actions..."
                  autoFocus
                  className="flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-faint outline-none caret-cobalt"
                />
                <kbd className="px-2 py-1 rounded bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[10px] text-text-faint font-mono flex-shrink-0">
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-[380px] overflow-y-auto p-2">
                <Command.Empty className="py-12 text-center text-[13px] text-text-faint">
                  <Search size={28} className="mx-auto mb-3 opacity-30" />
                  <p>No results for &quot;{search}&quot;</p>
                </Command.Empty>

                {commands.map((group) => (
                  <Command.Group
                    key={group.group}
                    heading={
                      <span className="px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.07em] text-text-faint">
                        {group.group}
                      </span>
                    }
                  >
                    {group.items.map((item) => (
                      <Command.Item
                        key={item.href}
                        value={item.label}
                        onSelect={() => handleSelect(item.href)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer group transition-colors data-[selected=true]:bg-[rgba(255,255,255,0.06)] outline-none"
                      >
                        {/* Icon box */}
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[rgba(255,255,255,0.04)] group-data-[selected=true]:bg-cobalt/10 border border-[rgba(255,255,255,0.06)] group-data-[selected=true]:border-cobalt/20 transition-all flex-shrink-0">
                          <item.icon size={14} className="text-text-faint group-data-[selected=true]:text-cobalt transition-colors" />
                        </div>

                        {/* Label */}
                        <span className="flex-1 text-[13px] font-medium text-text-secondary group-data-[selected=true]:text-text-primary transition-colors">
                          {item.label}
                        </span>

                        {/* Shortcut or arrow */}
                        <div className="flex items-center gap-1">
                          {item.shortcut ? (
                            item.shortcut.split(" ").map((key, i) => (
                              <kbd
                                key={i}
                                className="px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[10px] font-mono text-text-faint"
                              >
                                {key}
                              </kbd>
                            ))
                          ) : (
                            <ArrowRight size={12} className="text-text-faint opacity-0 group-data-[selected=true]:opacity-100 transition-opacity" />
                          )}
                        </div>
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}

                {/* Footer hint */}
                <div className="flex items-center justify-between px-3 py-2 mt-2 border-t border-[rgba(255,255,255,0.05)]">
                  <div className="flex items-center gap-3 text-[10px] text-text-faint">
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 rounded bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] font-mono">↑↓</kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1 py-0.5 rounded bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] font-mono">↵</kbd>
                      Open
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] font-mono">ESC</kbd>
                      Close
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-text-faint">
                    <Keyboard size={10} />
                    <span>⌘K</span>
                  </div>
                </div>
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
