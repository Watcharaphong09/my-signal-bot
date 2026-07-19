import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, decimals = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${seconds}s`;
}

export function getStatusColor(status: string): string {
  if (status.includes("TP") || status.includes("WIN")) return "emerald";
  if (status.includes("SL") || status.includes("LOSS")) return "ruby";
  if (status.includes("BE") || status.includes("Break")) return "muted";
  if (status.includes("ON GOING")) return "cobalt";
  if (status.includes("CANCELED")) return "muted";
  return "muted";
}

export function getRRColor(rr: number): string {
  if (rr > 0) return "text-emerald-400";
  if (rr < 0) return "text-ruby";
  return "text-text-muted";
}

export function getDirectionColor(direction: "BUY" | "SELL"): string {
  return direction === "BUY" ? "text-emerald-400" : "text-red-400";
}
