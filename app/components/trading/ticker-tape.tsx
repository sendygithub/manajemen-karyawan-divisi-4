"use client";

// Ticker tape berjalan — harga realtime semua simbol (marquee style)

import { useMemo } from "react";
import { SYMBOLS } from "@/lib/market/symbols";
import { useTrading } from "./trading-provider";
import { formatPercent, formatPrice } from "@/lib/trading/format";
import { cn } from "@/lib/utils";

export function TickerTape() {
  const { quotes } = useTrading();

  const items = useMemo(() => {
    const list = SYMBOLS.map((s) => {
      const q = quotes[s.symbol];
      return {
        symbol: s.symbol,
        price: q?.price ?? 0,
        change: q?.changePercent24h ?? 0,
        hasData: (q?.price ?? 0) > 0,
      };
    });
    return [...list, ...list]; // duplikat untuk loop mulus
  }, [quotes]);

  return (
    <div className="group relative overflow-hidden border-b border-[#232a33] bg-[#0d1116]">
      <div className="flex w-max animate-[ticker_45s_linear_infinite] gap-8 px-4 py-1.5 group-hover:[animation-play-state:paused]">
        {items.map((item, i) => (
          <div key={`${item.symbol}-${i}`} className="flex items-center gap-2 text-[11px] whitespace-nowrap">
            <span className="font-semibold text-slate-300">{item.symbol}</span>
            <span className="tabular-nums text-slate-400">
              {item.hasData ? formatPrice(item.symbol, item.price) : "—"}
            </span>
            <span
              className={cn(
                "tabular-nums font-medium",
                !item.hasData
                  ? "text-slate-600"
                  : item.change > 0
                    ? "text-emerald-400"
                    : item.change < 0
                      ? "text-red-400"
                      : "text-slate-500",
              )}
            >
              {item.hasData ? formatPercent(item.change) : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
