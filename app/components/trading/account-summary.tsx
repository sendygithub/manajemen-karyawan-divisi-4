"use client";

// Account summary — balance, equity, margin, free margin, P/L unrealized

import { useMemo } from "react";
import { useTrading } from "./trading-provider";
import { formatMoney, formatSignedMoney } from "@/lib/trading/format";
import { cn } from "@/lib/utils";

export function AccountSummary() {
  const { account, positions } = useTrading();

  const { equity, usedMargin, freeMargin, unrealized, marginPercent } = useMemo(() => {
    const balance = account?.balance ?? 0;
    const unrealized = positions.reduce((s, p) => s + p.pnl, 0);
    const usedMargin = positions.reduce((s, p) => s + p.margin, 0);
    const equity = balance + unrealized;
    const freeMargin = equity - usedMargin;
    const marginPercent = equity > 0 ? (usedMargin / equity) * 100 : 0;
    return { equity, usedMargin, freeMargin, unrealized, marginPercent };
  }, [account, positions]);

  const rows = [
    { label: "Balance", value: formatMoney(account?.balance ?? 0), cls: "text-slate-200" },
    { label: "Equity", value: formatMoney(equity), cls: "text-slate-200" },
    { label: "Unrealized P/L", value: formatSignedMoney(unrealized), cls: unrealized > 0 ? "text-emerald-400" : unrealized < 0 ? "text-red-400" : "text-slate-400" },
    { label: "Margin Used", value: formatMoney(usedMargin), cls: "text-slate-300" },
    { label: "Free Margin", value: formatMoney(freeMargin), cls: freeMargin < 0 ? "text-red-400" : "text-slate-300" },
  ];

  return (
    <div className="rounded-lg border border-[#232a33] bg-[#11151b] p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300">Account</span>
        <span className="text-[10px] text-slate-500">
          {positions.length} open · demo
        </span>
      </div>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">{r.label}</span>
            <span className={cn("font-medium tabular-nums", r.cls)}>{r.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-2.5">
        <div className="mb-1 flex justify-between text-[10px] text-slate-500">
          <span>Margin usage</span>
          <span className="tabular-nums">{marginPercent.toFixed(1)}%</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-[#1a2027]">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              marginPercent > 70 ? "bg-red-500" : marginPercent > 40 ? "bg-amber-400" : "bg-emerald-500",
            )}
            style={{ width: `${Math.min(100, marginPercent)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
