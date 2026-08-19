"use client";

// ============================================================
// CHART PANEL — candlestick profesional (lightweight-charts)
// ============================================================
// Data candle ASLI dari Binance (crypto & gold via PAXG) atau
// Yahoo Finance (forex). Live update via WebSocket untuk crypto,
// polling untuk forex. Lengkap: volume + MA20 + crosshair.
// ============================================================

import { useEffect, useRef, useState } from "react";
import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  HistogramSeries,
  LineSeries,
  createChart,
} from "lightweight-charts";
import type { IChartApi, ISeriesApi, UTCTimestamp } from "lightweight-charts";
import { marketEngine } from "@/lib/market/engine";
import { TIMEFRAMES, getConfig } from "@/lib/market/symbols";
import type { Candle, Timeframe } from "@/lib/market/types";
import { cn } from "@/lib/utils";
import { useTrading } from "./trading-provider";
import {
  formatCompact,
  formatPercent,
  formatPrice,
} from "@/lib/trading/format";

const UP = "#0ecb81";
const DOWN = "#f6465d";

function computeMA(candles: Candle[], period: number) {
  const out: { time: UTCTimestamp; value: number }[] = [];
  let sum = 0;
  for (let i = 0; i < candles.length; i++) {
    sum += candles[i].close;
    if (i >= period) sum -= candles[i - period].close;
    if (i >= period - 1) {
      out.push({ time: candles[i].time as UTCTimestamp, value: sum / period });
    }
  }
  return out;
}

interface Props {
  symbol: string;
  timeframe: Timeframe;
  onTimeframeChange: (tf: Timeframe) => void;
}

export function ChartPanel({ symbol, timeframe, onTimeframeChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const maRef = useRef<ISeriesApi<"Line"> | null>(null);
  const dataRef = useRef<Candle[]>([]);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { quotes } = useTrading();

  const cfg = getConfig(symbol);
  const quote = quotes[symbol];

  // init chart
  useEffect(() => {
    if (!containerRef.current) return;
    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#7a8595",
        fontSize: 11,
        fontFamily:
          "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
      },
      grid: {
        vertLines: { color: "rgba(148,163,184,0.06)" },
        horzLines: { color: "rgba(148,163,184,0.06)" },
      },
      rightPriceScale: {
        borderColor: "rgba(148,163,184,0.12)",
        scaleMargins: { top: 0.08, bottom: 0.24 },
      },
      timeScale: {
        borderColor: "rgba(148,163,184,0.12)",
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 4,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: "#4b5563", width: 1, style: 2, labelBackgroundColor: "#2b3139" },
        horzLine: { color: "#4b5563", width: 1, style: 2, labelBackgroundColor: "#2b3139" },
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: UP,
      downColor: DOWN,
      borderUpColor: UP,
      borderDownColor: DOWN,
      wickUpColor: UP,
      wickDownColor: DOWN,
    });
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "vol",
      lastValueVisible: false,
      priceLineVisible: false,
    });
    chart.priceScale("vol").applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
    });
    const maSeries = chart.addSeries(LineSeries, {
      color: "#f0b90b",
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    });

    chartRef.current = chart;
    candleRef.current = candleSeries;
    volumeRef.current = volumeSeries;
    maRef.current = maSeries;

    return () => {
      chart.remove();
      chartRef.current = null;
      candleRef.current = null;
      volumeRef.current = null;
      maRef.current = null;
      dataRef.current = [];
    };
  }, []);

  // symbol / timeframe change → load history + subscribe WS
  useEffect(() => {
    dataRef.current = [];
    if (candleRef.current) candleRef.current.setData([]);
    if (volumeRef.current) volumeRef.current.setData([]);
    if (maRef.current) maRef.current.setData([]);
    marketEngine.setActive(symbol, timeframe);

    const unsub = marketEngine.subscribe((e) => {
      if (e.type === "candles" && e.symbol === symbol && e.timeframe === timeframe) {
        dataRef.current = e.candles;
        if (candleRef.current) {
          candleRef.current.setData(
            e.candles.map((c) => ({
              time: c.time as UTCTimestamp,
              open: c.open,
              high: c.high,
              low: c.low,
              close: c.close,
            })),
          );
        }
        if (volumeRef.current) {
          volumeRef.current.setData(
            e.candles.map((c) => ({
              time: c.time as UTCTimestamp,
              value: c.volume ?? 0,
              color: c.close >= c.open ? "rgba(14,203,129,0.30)" : "rgba(246,70,93,0.30)",
            })),
          );
        }
        if (maRef.current) maRef.current.setData(computeMA(e.candles, 20));
        if (chartRef.current) chartRef.current.timeScale().scrollToRealTime();
      }
      if (e.type === "candle-update" && e.symbol === symbol && e.timeframe === timeframe) {
        const arr = dataRef.current;
        const last = arr[arr.length - 1];
        if (!last || e.candle.time >= last.time) {
          if (last && last.time === e.candle.time) {
            arr[arr.length - 1] = e.candle;
          } else {
            arr.push(e.candle);
            if (arr.length > 500) arr.shift();
          }
          const c = e.candle;
          candleRef.current?.update({
            time: c.time as UTCTimestamp,
            open: c.open,
            high: c.high,
            low: c.low,
            close: c.close,
          });
          volumeRef.current?.update({
            time: c.time as UTCTimestamp,
            value: c.volume ?? 0,
            color: c.close >= c.open ? "rgba(14,203,129,0.30)" : "rgba(246,70,93,0.30)",
          });
          const ma = computeMA(arr, 20);
          const lastMa = ma[ma.length - 1];
          if (lastMa) maRef.current?.update(lastMa);
        }
      }
    });

    return () => {
      unsub();
    };
  }, [symbol, timeframe]);

  // flash saat harga berubah
  useEffect(() => {
    if (!quote?.price) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- flash visual sinkron harga, disengaja
    setFlash(quote.change24h >= 0 ? "up" : "down");
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(null), 1200);
  }, [quote?.price, quote?.change24h]);

  const isPositive = (quote?.changePercent24h ?? 0) >= 0;
  const hasFeed = Boolean(cfg?.binanceSymbol || cfg?.yahooSymbol);

  return (
    <div className="flex h-full min-h-[420px] flex-col rounded-lg border border-[#232a33] bg-[#11151b]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#232a33] px-3 py-2">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-200">{symbol}</span>
              <span className="rounded bg-[#2b3139] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                {cfg?.category}
              </span>
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-medium",
                  quote?.streaming
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-amber-500/10 text-amber-400",
                )}
              >
                {quote?.streaming ? "● LIVE" : "◐ POLL"}
              </span>
            </div>
            <div className="text-[10px] text-slate-500">
              {cfg?.name} · Data: {cfg?.sourceLabel}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-4 text-[11px] text-slate-500 md:flex">
            <span>
              24h High{" "}
              <span className="font-medium tabular-nums text-emerald-400">
                {quote?.high24h ? formatPrice(symbol, quote.high24h) : "-"}
              </span>
            </span>
            <span>
              24h Low{" "}
              <span className="font-medium tabular-nums text-red-400">
                {quote?.low24h ? formatPrice(symbol, quote.low24h) : "-"}
              </span>
            </span>
            <span>
              Vol{" "}
              <span className="font-medium tabular-nums text-slate-300">
                {quote?.volume24h ? `$${formatCompact(quote.volume24h)}` : "-"}
              </span>
            </span>
          </div>

          {/* Timeframes */}
          <div className="flex items-center gap-0.5 rounded-md bg-[#1a2027] p-0.5">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => onTimeframeChange(tf)}
                className={cn(
                  "rounded px-2 py-1 text-[11px] font-medium transition-colors",
                  timeframe === tf
                    ? "bg-[#2b3139] text-slate-100"
                    : "text-slate-500 hover:text-slate-300",
                )}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Price row */}
      <div className="flex flex-wrap items-center gap-3 border-b border-[#232a33] px-3 py-1.5">
        <span
          className={cn(
            "text-xl font-bold tabular-nums transition-colors",
            flash === "up" && "text-emerald-400",
            flash === "down" && "text-red-400",
          )}
        >
          {quote?.price ? formatPrice(symbol, quote.price) : "—"}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-semibold tabular-nums",
            isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400",
          )}
        >
          {formatPercent(quote?.changePercent24h)}
        </span>
        <span className="text-[11px] text-slate-500">
          {quote?.bid ? `Bid ${formatPrice(symbol, quote.bid)}` : ""}
          {quote?.ask ? ` / Ask ${formatPrice(symbol, quote.ask)}` : ""}
        </span>
        <span className="ml-auto hidden text-[10px] text-slate-600 sm:block">
          {hasFeed ? "candles: real market data" : ""}
        </span>
      </div>

      {/* Chart */}
      <div className="min-h-0 flex-1">
        <div ref={containerRef} className="h-[380px] w-full" />
      </div>
    </div>
  );
}
