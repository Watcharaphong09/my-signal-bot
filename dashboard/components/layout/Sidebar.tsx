"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Zap,
  History,
  Users,
  BarChart3,
  Trophy,
  Crown,
  TrendingUp,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bot,
  Circle,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    group: "Overview",
    items: [
      { href: "/", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/live-trades", icon: Zap, label: "Live Trades", badge: "LIVE" },
      { href: "/history", icon: History, label: "Trade History" },
    ],
  },
  {
    group: "Providers",
    items: [
      { href: "/providers", icon: Users, label: "Providers" },
      { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    ],
  },
  {
    group: "Analytics",
    items: [
      { href: "/statistics", icon: BarChart3, label: "Statistics" },
      { href: "/analytics", icon: TrendingUp, label: "Analytics" },
      { href: "/calendar", icon: Calendar, label: "Calendar" },
    ],
  },
  {
    group: "Management",
    items: [
      { href: "/vip-members", icon: Crown, label: "VIP Members" },
      { href: "/settings", icon: Settings, label: "Settings" },
    ],
  },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [botStatus] = useState<"online" | "offline">("online");

  // Close mobile sidebar on route change
  useEffect(() => {
    onMobileClose();
  }, [pathname, onMobileClose]);

  const sidebarVariants = {
    expanded: { width: 240 },
    collapsed: { width: 68 },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.04, duration: 0.2, ease: "easeOut" },
    }),
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-4 py-5 border-b border-[rgba(255,255,255,0.06)]",
        collapsed && "justify-center px-2"
      )}>
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg glow-emerald">
            <Bot className="w-4.5 h-4.5 text-white" size={18} />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#080B0F] animate-pulse-dot" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="font-bold text-[13px] text-text-primary tracking-tight leading-none">Signal Bot</p>
              <p className="text-[10px] text-text-faint mt-0.5 font-medium tracking-wider uppercase">Dashboard</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5">
        {navItems.map((group, groupIdx) => (
          <div key={group.group} className={groupIdx > 0 ? "mt-1" : ""}>
            {/* Group label */}
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-3 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-text-faint"
                >
                  {group.group}
                </motion.p>
              )}
            </AnimatePresence>
            {collapsed && groupIdx > 0 && (
              <div className="my-2 mx-2 h-px bg-[rgba(255,255,255,0.05)]" />
            )}

            {/* Nav items */}
            {group.items.map((item, itemIdx) => {
              const isActive = item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

              return (
                <motion.div
                  key={item.href}
                  custom={groupIdx * 3 + itemIdx}
                  initial="hidden"
                  animate="visible"
                  variants={itemVariants}
                >
                  <Link
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "nav-item group relative",
                      collapsed ? "justify-center px-0 py-2.5" : "",
                      isActive ? "active" : ""
                    )}
                  >
                    <item.icon
                      size={16}
                      className={cn(
                        "flex-shrink-0 transition-colors",
                        isActive ? "text-emerald-400" : "text-text-faint group-hover:text-text-muted"
                      )}
                    />

                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden whitespace-nowrap flex-1"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Badge */}
                    {item.badge && !collapsed && (
                      <span className="ml-auto text-[9px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-dim text-emerald-400 border border-emerald-500/20 animate-pulse-dot">
                        {item.badge}
                      </span>
                    )}

                    {/* Collapsed tooltip indicator */}
                    {collapsed && item.badge && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-[rgba(255,255,255,0.06)] p-3 space-y-2">
        {/* Bot Status */}
        <div className={cn(
          "flex items-center gap-2.5 px-2 py-2 rounded-lg bg-[rgba(255,255,255,0.02)]",
          collapsed && "justify-center"
        )}>
          <div className="relative flex-shrink-0">
            <Circle
              size={8}
              className={cn(
                "fill-current",
                botStatus === "online" ? "text-emerald-400" : "text-red-400"
              )}
            />
            {botStatus === "online" && (
              <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-40 animate-ping" />
            )}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <p className="text-[11px] font-medium text-text-secondary whitespace-nowrap">Bot Status</p>
                <p className={cn(
                  "text-[10px] font-semibold whitespace-nowrap",
                  botStatus === "online" ? "text-emerald-400" : "text-red-400"
                )}>
                  {botStatus === "online" ? "● Online" : "● Offline"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-full flex items-center gap-2 px-2 py-2 rounded-lg text-text-faint hover:text-text-muted hover:bg-[rgba(255,255,255,0.04)] transition-all text-[12px] font-medium",
            collapsed && "justify-center"
          )}
        >
          {collapsed ? (
            <ChevronRight size={14} />
          ) : (
            <>
              <ChevronLeft size={14} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={collapsed ? "collapsed" : "expanded"}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40 bg-[#0A0E14] border-r border-[rgba(255,255,255,0.06)] overflow-hidden"
        style={{ willChange: "width" }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-[240px] bg-[#0A0E14] border-r border-[rgba(255,255,255,0.06)] md:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-[rgba(255,255,255,0.06)] transition-colors"
    >
      <Menu size={18} />
    </button>
  );
}
