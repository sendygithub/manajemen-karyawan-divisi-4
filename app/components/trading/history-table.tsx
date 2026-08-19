"use client";

// History — posisi tertutup (realized P/L) + riwayat order

import { useState } from "react";
import { useTrading } from "./trading-provider";
import { formatDateTime, formatPrice, formatSignedMoney } from "@/lib/trading/format";
import { cn } from "@/lib/utils";
import type { TradingPosition, TradingOrder } from "@/types/trading";

const STATUS_COLOR: Record<string, string> = {
  FILLED: "text-emerald-400",
  TRIGGERED: "text-emerald-400",
  CANCELLED: "text-slate-500",
  PENDING: "text-amber-400",
};

export function HistoryTable() {
  const { history } = useTrading();
  const [tab, setTab] = useState<"closed" | "orders">("closed");
  const closed: TradingPosition[] = history?.closed ?? [];
  const orders: TradingOrder[] = history?.orders ?? [];

  return (
    <div className="flex h-full flex-col">
      <div className="flex gap-1 border-b border-[#232a33] px-2">
        {(
          [
            ["closed", `Closed Positions (${closed.length})`],
            ["orders", `Order History (${orders.length})`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "border-b-2 px-3 py-2 text-[11px] font-semibold transition-colors",
              tab === key
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-500 hover:text-slate-300",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {tab === "closed" ? (
          closed.length === 0 ? (
            <div className="flex h-full min-h-[120px] items-center justify-center text-xs text-slate-600">
              Belum ada posisi tertutup.
            </div>
          ) : (
            <table className="w-full min-w-[820px] text-left text-[11px]">
              <thead className="sticky top-0 bg-[#11151b]">
                <tr className="border-b border-[#232a33] text-[10px] uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2 font-medium">Symbol</th>
                  <th className="px-3 py-2 font-medium">Side</th>
                  <th className="px-3 py-2 text-right font-medium">Qty</th>
                  <th className="px-3 py-2 text-right font-medium">Entry</th>
                  <th className="px-3 py-2 text-right font-medium">Exit</th>
                  <th className="px-3 py-2 text-right font-medium">Realized P/L</th>
                  <th className="px-3 py-2 text-right font-medium">Lev</th>
                  <th className="px-3 py-2 text-right font-medium">Closed At</th>
                </tr>
              </thead>
              <tbody>
                {closed.map((p) => (
                  <tr key={p.id} className="border-b border-[#1c222a] last:border-0 hover:bg-[#161c23]">
                    <td className="px-3 py-2 font-semibold text-slate-200">{p.symbol}</td>
                    <td className="px-3 py-2">
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-bold",
                          p.side === "LONG"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-red-500/10 text-red-400",
                        )}
                      >
                        {p.side}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-slate-300">
                      {p.qty.toLocaleString("en-US", { maximumFractionDigits: 6 })}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-slate-300">
                      {formatPrice(p.symbol, p.entryPrice)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-slate-300">
                      {p.closePrice != null ? formatPrice(p.symbol, p.closePrice) : "—"}
                    </td>
                    <td
                      className={cn(
                        "px-3 py-2 text-right font-semibold tabular-nums",
                        (p.realizedPnl ?? 0) > 0
                          ? "text-emerald-400"
                          : (p.realizedPnl ?? 0) < 0
                            ? "text-red-400"
                            : "text-slate-400",
                      )}
                    >
                      {formatSignedMoney(p.realizedPnl)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-slate-400">{p.leverage}x</td>
                    <td className="px-3 py-2 text-right tabular-nums text-slate-500">
                      {p.closedAt ? formatDateTime(new Date(p.closedAt)) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : orders.length === 0 ? (
          <div className="flex h-full min-h-[120px] items-center justify-center text-xs text-slate-600">
            Belum ada order.
          </div>
        ) : (
          <table className="w-full min-w-[820px] text-left text-[11px]">
            <thead className="sticky top-0 bg-[#11151b]">
              <tr className="border-b border-[#232a33] text-[10px] uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2 font-medium">Symbol</th>
                <th className="px-3 py-2 font-medium">Side</th>
                <th className="px-3 py-2 font-medium">Type</th>
                <th className="px-3 py-2 text-right font-medium">Qty</th>
                <th className="px-3 py-2 text-right font-medium">Price</th>
                <th className="px-3 py-2 text-right font-medium">Triggered</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-[#1c222a] last:border-0 hover:bg-[#161c23]">
                  <td className="px-3 py-2 font-semibold text-slate-200">{o.symbol}</td>
                  <td className="px-3 py-2">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-bold",
                        o.side === "LONG"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-red-500/10 text-red-400",
                      )}
                    >
                      {o.side}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="rounded bg-[#2b3139] px-1.5 py-0.5 text-[10px] font-medium text-slate-300">
                      {o.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-300">
                    {o.qty.toLocaleString("en-US", { maximumFractionDigits: 6 })}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-300">
                    {o.price != null ? formatPrice(o.symbol, o.price) : "—"}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-500">
                    {o.triggeredPrice != null ? formatPrice(o.symbol, o.triggeredPrice) : "—"}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={cn(
                        "font-semibold",
                        STATUS_COLOR[o.status] ?? "text-slate-400",
                      )}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-500">
                    {formatDateTime(new Date(o.createdAt))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
