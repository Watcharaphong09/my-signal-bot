"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LayoutDashboard, Zap, History, Users, BarChart3, Trophy, Crown, Calendar, Settings } from "lucide-react";

export function CommandPalette({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="w-full max-w-2xl relative z-10 px-4"
          >
            <Command
              className="w-full bg-[#0D1117] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
              shouldFilter={true}
            >
              <div className="flex items-center px-4 border-b border-white/5">
                <Search size={18} className="text-white/40 mr-3" />
                <Command.Input
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent py-4 outline-none text-white placeholder:text-white/30 text-sm"
                />
                <kbd className="font-mono text-[10px] text-white/40 bg-white/5 px-2 py-1 rounded border border-white/10">ESC</kbd>
              </div>

              <Command.List className="max-h-[350px] overflow-y-auto p-2">
                <Command.Empty className="py-12 text-center text-sm text-white/40">
                  No results found.
                </Command.Empty>

                <Command.Group heading={<span className="text-[11px] font-medium text-white/40 px-2 uppercase tracking-wider">Navigation</span>}>
                  {[
                    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
                    { name: "Live Trades", icon: Zap, href: "/live-trades" },
                    { name: "Trade History", icon: History, href: "/history" },
                    { name: "Statistics", icon: BarChart3, href: "/statistics" },
                    { name: "Leaderboard", icon: Trophy, href: "/leaderboard" },
                    { name: "Providers", icon: Users, href: "/providers" },
                    { name: "VIP Members", icon: Crown, href: "/vip-members" },
                    { name: "Calendar", icon: Calendar, href: "/calendar" },
                    { name: "Settings", icon: Settings, href: "/settings" },
                  ].map((item) => (
                    <Command.Item
                      key={item.href}
                      onSelect={() => runCommand(() => router.push(item.href))}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm text-white/70 aria-selected:bg-white/10 aria-selected:text-white outline-none"
                    >
                      <item.icon size={16} />
                      {item.name}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
