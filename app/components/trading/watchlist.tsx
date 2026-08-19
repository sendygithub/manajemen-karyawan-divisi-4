"use client";

// Watchlist — daftar simbol dengan harga live + sparkline mini

import { useMemo } from "react";
import { SYMBOLS } from "@/lib/market/symbols";
import { useTrading } from "./trading-provider";
import { formatPercent, formatPrice } from "@/lib/trading/format";
import { cn } from "@/lib/utils";

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (!data || data.length < 2) {
    return <div className="h-6 w-16" />;
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 64;
  const h = 24;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="shrink-0 opacity-80">
      <polyline
        points={pts}
        fill="none"
        stroke={positive ? "#0ecb81" : "#f6465d"}
        strokeWidth="1.2"
      />
    </svg>
  );
}

interface Props {
  activeSymbol: string;
  onSelect: (symbol: string) => void;
}

export function Watchlist({ activeSymbol, onSelect }: Props) {
  const { quotes } = useTrading();

  const rows = useMemo(
    () =>
      SYMBOLS.map((s) => {
        const q = quotes[s.symbol];
        return { cfg: s, q };
      }),
    [quotes],
  );

  return (
    <div className="overflow-hidden rounded-lg border border-[#232a33] bg-[#11151b]">
      <div className="border-b border-[#232a33] px-3 py-2">
        <div className="text-xs font-semibold text-slate-300">Watchlist</div>
        <div className="text-[10px] text-slate-500">Market prices · realtime</div>
      </div>
      <div className="max-h-[520px] overflow-y-auto">
        {rows.map(({ cfg, q }) => {
          const active = cfg.symbol === activeSymbol;
          const positive = (q?.changePercent24h ?? 0) >= 0;
          return (
            <button
              key={cfg.symbol}
              type="button"
              onClick={() => onSelect(cfg.symbol)}
              className={cn(
                "flex w-full items-center justify-between gap-2 border-b border-[#1c222a] px-3 py-2 text-left transition-colors last:border-0",
                active ? "bg-[#1c242e]" : "hover:bg-[#161c23]",
              )}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      active ? "text-amber-400" : "text-slate-300",
                    )}
                  >
                    {cfg.symbol}
                  </span>
                  <span className="rounded bg-[#2b3139] px-1 text-[9px] font-medium uppercase text-slate-500">
                    {cfg.category === "crypto" ? "C" : cfg.category === "gold" ? "G" : "F"}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">{cfg.name}</div>
              </div>
              <div className="flex items-center gap-2">
                <Sparkline data={q?.spark ?? []} positive={positive} />
                <div className="text-right">
                  <div className="text-xs font-medium tabular-nums text-slate-200">
                    {q?.price ? formatPrice(cfg.symbol, q.price) : "—"}
                  </div>
                  <div
                    className={cn(
                      "text-[10px] font-medium tabular-nums",
                      !q?.price
                        ? "text-slate-600"
                        : positive
                          ? "text-emerald-400"
                          : "text-red-400",
                    )}
                  >
                    {formatPercent(q?.changePercent24h)}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
