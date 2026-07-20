"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Zap, History, Users, Trophy, BarChart3,
  Crown, Calendar, Bell, Settings, ChevronLeft, ChevronRight, Bot, LogOut, PlusCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  {
    group: "Dashboard",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Create Signal", href: "/create-signal", icon: PlusCircle },
      { name: "Live Trades", href: "/live-trades", icon: Zap },
      { name: "Trade History", href: "/history", icon: History },
    ],
  },
  {
    group: "Analytics & Ranking",
    items: [
      { name: "Statistics", href: "/statistics", icon: BarChart3 },
      { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
      { name: "Providers", href: "/providers", icon: Users },
    ],
  },
  {
    group: "Management",
    items: [
      { name: "VIP Members", href: "/vip-members", icon: Crown },
      { name: "Calendar", href: "/calendar", icon: Calendar },
      { name: "Notifications", href: "/notifications", icon: Bell },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (val: boolean) => void }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.aside
      initial={{ width: 260 }}
      animate={{ width: collapsed ? 72 : 260 }}
      className="hidden md:flex flex-col h-screen flex-shrink-0 border-r border-white/5 bg-[#080B0F]/95 backdrop-blur-xl z-40 relative"
    >
      {/* Brand */}
      <div className={cn("flex items-center h-[64px] border-b border-white/5 px-4", collapsed ? "justify-center" : "gap-3")}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
          <Bot size={18} className="text-emerald-400" />
        </div>
        {!collapsed && (
          <span className="font-semibold tracking-tight text-white/90">TradeAdmin</span>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-hide">
        {navigation.map((section, i) => (
          <div key={i}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[11px] font-medium tracking-widest text-white/40 uppercase">
                {section.group}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={collapsed ? item.name : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/50 hover:bg-white/5 hover:text-white/80",
                      collapsed && "justify-center"
                    )}
                  >
                    <item.icon size={18} className={cn(isActive ? "text-white" : "text-white/50")} />
                    {!collapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer toggle & Logout */}
      <div className="p-3 border-t border-white/5 space-y-1">
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center w-full px-3 py-2 rounded-lg text-rose-400/70 hover:bg-rose-500/10 hover:text-rose-400 transition-colors",
            collapsed ? "justify-center" : "gap-3"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex items-center w-full px-3 py-2 rounded-lg text-white/40 hover:bg-white/5 hover:text-white/80 transition-colors",
            collapsed ? "justify-center" : "gap-3"
          )}
          title={collapsed ? "Collapse" : undefined}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span className="text-sm font-medium">Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}
