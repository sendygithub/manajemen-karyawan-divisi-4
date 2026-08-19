"use client";

// Order pending (limit/stop) — dipantau execution engine, bisa dibatalkan

import { useTrading } from "./trading-provider";
import { formatPrice, formatTime } from "@/lib/trading/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

export function OrdersTable() {
  const { pendingOrders, cancelOrder } = useTrading();
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const doCancel = async (id: string) => {
    setCancellingId(id);
    const res = await cancelOrder(id);
    setCancellingId(null);
    if (res.ok) toast.success("Order dibatalkan");
    else toast.error(res.message ?? "Gagal membatalkan");
  };

  if (pendingOrders.length === 0) {
    return (
      <div className="flex h-full min-h-[120px] items-center justify-center text-xs text-slate-600">
        Tidak ada order pending. Pasang Limit/Stop dari panel Order.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-[11px]">
        <thead>
          <tr className="border-b border-[#232a33] text-[10px] uppercase tracking-wide text-slate-500">
            <th className="px-3 py-2 font-medium">Symbol</th>
            <th className="px-3 py-2 font-medium">Side</th>
            <th className="px-3 py-2 font-medium">Type</th>
            <th className="px-3 py-2 text-right font-medium">Qty</th>
            <th className="px-3 py-2 text-right font-medium">Trigger Price</th>
            <th className="px-3 py-2 text-right font-medium">SL / TP</th>
            <th className="px-3 py-2 text-right font-medium">Lev</th>
            <th className="px-3 py-2 text-right font-medium">Placed</th>
            <th className="px-3 py-2 text-right font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingOrders.map((o) => (
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
              <td className="px-3 py-2 text-right font-medium tabular-nums text-amber-400">
                {o.price != null ? formatPrice(o.symbol, o.price) : "—"}
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-slate-400">
                {o.slPrice != null ? formatPrice(o.symbol, o.slPrice) : "—"} /{" "}
                {o.tpPrice != null ? formatPrice(o.symbol, o.tpPrice) : "—"}
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-slate-400">{o.leverage}x</td>
              <td className="px-3 py-2 text-right tabular-nums text-slate-500">
                {formatTime(new Date(o.createdAt))}
              </td>
              <td className="px-3 py-2 text-right">
                <button
                  type="button"
                  disabled={cancellingId === o.id}
                  onClick={() => void doCancel(o.id)}
                  className="rounded bg-[#2b3139] px-2 py-1 text-[10px] font-semibold text-slate-300 transition-colors hover:bg-amber-500/20 hover:text-amber-400 disabled:opacity-50"
                >
                  {cancellingId === o.id ? "..." : "Cancel"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
