"use client";

// ============================================================
// MARKET DEPTH — order book + recent trades
// ============================================================
// - Crypto & Gold (PAXG): order book ASLI dari Binance WebSocket
//   (depth 10 level) + trades agregat realtime.
// - Forex: pasar OTC — kutipan indikatif (bid/ask) + riwayat
//   perubahan harga dari polling. Ditampilkan jujur sebagai
//   "indicative" karena order book retail forex tidak publik.
// ============================================================

import { useEffect, useState } from "react";
import { marketEngine } from "@/lib/market/engine";
import { getConfig } from "@/lib/market/symbols";
import type { OrderBook, TradeTick } from "@/lib/market/types";
import { useTrading } from "./trading-provider";
import { formatPrice, formatTime } from "@/lib/trading/format";
import { cn } from "@/lib/utils";

export function MarketDepth({ symbol }: { symbol: string }) {
  const [tab, setTab] = useState<"book" | "trades">("book");
  const [book, setBook] = useState<OrderBook | null>(null);
  const [trades, setTrades] = useState<TradeTick[]>([]);
  const { quotes } = useTrading();

  const cfg = getConfig(symbol);
  const hasRealBook = Boolean(cfg?.binanceSymbol);
  const quote = quotes[symbol];

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset book/trades saat ganti simbol, disengaja
    setBook(null);
    setTrades([]);
    const unsub = marketEngine.subscribe((e) => {
      if (e.type === "book" && e.book.symbol === symbol) setBook(e.book);
      if (e.type === "trades" && e.symbol === symbol) setTrades(e.trades);
    });
    return unsub;
  }, [symbol]);

  const maxBidQty = Math.max(...(book?.bids.map((b) => b.qty) ?? [1]));
  const maxAskQty = Math.max(...(book?.asks.map((a) => a.qty) ?? [1]));

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-[#232a33] bg-[#11151b]">
      {/* Tabs */}
      <div className="flex border-b border-[#232a33]">
        {(["book", "trades"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-colors",
              tab === t
                ? "border-b-2 border-amber-400 text-amber-400"
                : "text-slate-500 hover:text-slate-300",
            )}
          >
            {t === "book" ? "Order Book" : "Recent Trades"}
          </button>
        ))}
      </div>

      {tab === "book" ? (
        hasRealBook ? (
          <div className="flex-1 overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 px-3 py-1.5 text-[10px] uppercase tracking-wide text-slate-500">
              <span>Price (USDT)</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Total</span>
            </div>
            {/* Asks (sell) — inverted */}
            <div className="max-h-[190px] overflow-hidden">
              {[...(book?.asks ?? [])].reverse().map((a, i) => (
                <div key={`a${i}`} className="relative grid grid-cols-3 px-3 py-[3px] text-[11px]">
                  <div
                    className="absolute inset-y-0 right-0 bg-red-500/[0.07]"
                    style={{ width: `${(a.qty / maxAskQty) * 100}%` }}
                  />
                  <span className="relative text-red-400 tabular-nums">
                    {formatPrice(symbol, a.price)}
                  </span>
                  <span className="relative text-right text-slate-400 tabular-nums">
                    {a.qty.toLocaleString("en-US", { maximumFractionDigits: 4 })}
                  </span>
                  <span className="relative text-right text-slate-500 tabular-nums">
                    {(a.price * a.qty).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </span>
                </div>
              ))}
            </div>
            {/* Spread */}
            <div className="border-y border-[#232a33] bg-[#161c23] px-3 py-1.5 text-center text-[11px]">
              <span className="text-slate-400">Spread </span>
              <span className="font-semibold tabular-nums text-slate-200">
                {book?.bids[0] && book?.asks[0]
                  ? formatPrice(symbol, book.asks[0].price - book.bids[0].price)
                  : "-"}
              </span>
            </div>
            {/* Bids (buy) */}
            <div className="max-h-[190px] overflow-hidden">
              {(book?.bids ?? []).map((b, i) => (
                <div key={`b${i}`} className="relative grid grid-cols-3 px-3 py-[3px] text-[11px]">
                  <div
                    className="absolute inset-y-0 right-0 bg-emerald-500/[0.07]"
                    style={{ width: `${(b.qty / maxBidQty) * 100}%` }}
                  />
                  <span className="relative text-emerald-400 tabular-nums">
                    {formatPrice(symbol, b.price)}
                  </span>
                  <span className="relative text-right text-slate-400 tabular-nums">
                    {b.qty.toLocaleString("en-US", { maximumFractionDigits: 4 })}
                  </span>
                  <span className="relative text-right text-slate-500 tabular-nums">
                    {(b.price * b.qty).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#232a33] px-3 py-1.5 text-[10px] text-slate-600">
              Live depth · Binance (via data-stream)
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-2 p-4">
            {/* Kutipan indikatif OTC */}
            <div className="rounded-md bg-[#161c23] p-3">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Indicative Quote (OTC)
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded bg-red-500/10 py-2">
                  <div className="text-[10px] text-slate-500">Bid</div>
                  <div className="text-sm font-bold tabular-nums text-red-400">
                    {quote?.bid ? formatPrice(symbol, quote.bid) : "-"}
                  </div>
                </div>
                <div className="rounded bg-[#1a2027] py-2">
                  <div className="text-[10px] text-slate-500">Mid</div>
                  <div className="text-sm font-bold tabular-nums text-slate-200">
                    {quote?.price ? formatPrice(symbol, quote.price) : "-"}
                  </div>
                </div>
                <div className="rounded bg-emerald-500/10 py-2">
                  <div className="text-[10px] text-slate-500">Ask</div>
                  <div className="text-sm font-bold tabular-nums text-emerald-400">
                    {quote?.ask ? formatPrice(symbol, quote.ask) : "-"}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-center text-[10px] text-slate-600">
                Spread indikatif · {cfg?.sourceLabel}
              </div>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              {symbol} adalah pasar OTC (over-the-counter). Order book ritel
              tidak dipublikasikan — broker menampilkan kutipan indikatif
              seperti di atas. Data harga tetap real dari {cfg?.sourceLabel}.
            </p>
          </div>
        )
      ) : hasRealBook ? (
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-4 px-3 py-1.5 text-[10px] uppercase tracking-wide text-slate-500">
            <span>Time</span>
            <span>Price</span>
            <span className="text-right">Qty</span>
            <span className="text-right">Side</span>
          </div>
          {trades.length === 0 && (
            <div className="px-3 py-6 text-center text-[11px] text-slate-600">
              Waiting for trades...
            </div>
          )}
          {trades.map((t) => (
            <div key={t.id} className="grid grid-cols-4 px-3 py-[3px] text-[11px]">
              <span className="text-slate-500 tabular-nums">{formatTime(t.time)}</span>
              <span
                className={cn(
                  "tabular-nums",
                  t.side === "buy" ? "text-emerald-400" : "text-red-400",
                )}
              >
                {formatPrice(symbol, t.price)}
              </span>
              <span className="text-right text-slate-400 tabular-nums">
                {t.qty.toLocaleString("en-US", { maximumFractionDigits: 4 })}
              </span>
              <span
                className={cn(
                  "text-right text-[10px] font-semibold uppercase",
                  t.side === "buy" ? "text-emerald-400" : "text-red-400",
                )}
              >
                {t.side}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="rounded-md bg-[#161c23] p-3">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
              Quote Updates
            </div>
            <div className="flex items-center justify-between py-1 text-[12px]">
              <span className="text-slate-400">Last price</span>
              <span className="font-bold tabular-nums text-slate-200">
                {quote?.price ? formatPrice(symbol, quote.price) : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 text-[12px]">
              <span className="text-slate-400">Updated</span>
              <span className="tabular-nums text-slate-300">
                {quote?.updatedAt ? formatTime(quote.updatedAt) : "-"}
              </span>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Trade-by-trade (tick) data tidak tersedia publik untuk pasar OTC
            tanpa langganan. Harga {symbol} diperbarui berkala dari{" "}
            {cfg?.sourceLabel} — data real, bukan simulasi.
          </p>
        </div>
      )}
    </div>
  );
}
