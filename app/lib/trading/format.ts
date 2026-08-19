// ============================================================
// TRADING FORMAT — helper format angka untuk terminal
// ============================================================

import { getConfig } from "@/lib/market/symbols";

export function priceDecimals(symbol: string): number {
  return getConfig(symbol)?.decimals ?? 2;
}

export function formatPrice(symbol: string, price: number | undefined | null): string {
  if (price == null || !Number.isFinite(price)) return "-";
  return price.toLocaleString("en-US", {
    minimumFractionDigits: priceDecimals(symbol),
    maximumFractionDigits: priceDecimals(symbol),
  });
}

export function formatMoney(n: number | undefined | null, decimals = 2): string {
  if (n == null || !Number.isFinite(n)) return "-";
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatSignedMoney(n: number | undefined | null, decimals = 2): string {
  if (n == null || !Number.isFinite(n)) return "-";
  const sign = n > 0 ? "+" : n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatPercent(n: number | undefined | null, decimals = 2): string {
  if (n == null || !Number.isFinite(n)) return "-";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(decimals)}%`;
}

export function formatCompact(n: number | undefined | null): string {
  if (n == null || !Number.isFinite(n)) return "-";
  if (Math.abs(n) >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
  return n.toFixed(2);
}

export function formatTime(ts: number | Date): string {
  const d = typeof ts === "number" ? new Date(ts) : ts;
  return d.toLocaleTimeString("en-GB", { hour12: false });
}

export function formatDateTime(ts: number | Date): string {
  const d = typeof ts === "number" ? new Date(ts) : ts;
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function pnlClass(n: number): string {
  if (n > 0) return "text-emerald-400";
  if (n < 0) return "text-red-400";
  return "text-slate-400";
}
