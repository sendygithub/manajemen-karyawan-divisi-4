"use client";

// Posisi terbuka — P/L live dari harga pasar real, tombol close

import { useTrading, type PositionRow } from "./trading-provider";
import { formatMoney, formatPercent, formatPrice, formatTime, pnlClass } from "@/lib/trading/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

export function PositionsTable() {
  const { positions, quotes, closePosition } = useTrading();
  const [closingId, setClosingId] = useState<string | null>(null);

  const doClose = async (p: PositionRow) => {
    const mark = quotes[p.symbol]?.price;
    if (!mark || mark <= 0) {
      toast.error("Harga pasar belum tersedia");
      return;
    }
    setClosingId(p.id);
    const res = await closePosition(p.id, mark);
    setClosingId(null);
    if (res.ok) {
      toast.success(`Posisi ${p.symbol} ditutup @ ${formatPrice(p.symbol, mark)}`);
    } else {
      toast.error(res.message ?? "Gagal menutup posisi");
    }
  };

  if (positions.length === 0) {
    return (
      <div className="flex h-full min-h-[120px] items-center justify-center text-xs text-slate-600">
        Belum ada posisi terbuka. Buka posisi dari panel Order di kanan.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-left text-[11px]">
        <thead>
          <tr className="border-b border-[#232a33] text-[10px] uppercase tracking-wide text-slate-500">
            <th className="px-3 py-2 font-medium">Symbol</th>
            <th className="px-3 py-2 font-medium">Side</th>
            <th className="px-3 py-2 text-right font-medium">Qty</th>
            <th className="px-3 py-2 text-right font-medium">Entry</th>
            <th className="px-3 py-2 text-right font-medium">Mark</th>
            <th className="px-3 py-2 text-right font-medium">P/L</th>
            <th className="px-3 py-2 text-right font-medium">SL / TP</th>
            <th className="px-3 py-2 text-right font-medium">Lev</th>
            <th className="px-3 py-2 text-right font-medium">Margin</th>
            <th className="px-3 py-2 text-right font-medium">Liq. Est</th>
            <th className="px-3 py-2 text-right font-medium">Opened</th>
            <th className="px-3 py-2 text-right font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((p) => (
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
              <td className="px-3 py-2 text-right tabular-nums text-slate-200">
                {formatPrice(p.symbol, p.markPrice)}
              </td>
              <td className="px-3 py-2 text-right">
                <div className={cn("font-semibold tabular-nums", pnlClass(p.pnl))}>
                  {formatMoney(p.pnl)}
                </div>
                <div className={cn("text-[10px] tabular-nums", pnlClass(p.pnl))}>
                  {formatPercent(p.pnlPercent)}
                </div>
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-slate-400">
                {p.slPrice ? formatPrice(p.symbol, p.slPrice) : "—"} /{" "}
                {p.tpPrice ? formatPrice(p.symbol, p.tpPrice) : "—"}
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-slate-400">{p.leverage}x</td>
              <td className="px-3 py-2 text-right tabular-nums text-slate-300">
                {formatMoney(p.margin)}
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-slate-500">
                {p.liqPrice ? formatPrice(p.symbol, p.liqPrice) : "—"}
              </td>
              <td className="px-3 py-2 text-right tabular-nums text-slate-500">
                {formatTime(new Date(p.openedAt))}
              </td>
              <td className="px-3 py-2 text-right">
                <button
                  type="button"
                  disabled={closingId === p.id}
                  onClick={() => void doClose(p)}
                  className="rounded bg-[#2b3139] px-2 py-1 text-[10px] font-semibold text-slate-300 transition-colors hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50"
                >
                  {closingId === p.id ? "..." : "Close"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
