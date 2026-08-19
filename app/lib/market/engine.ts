// ============================================================
// MARKET ENGINE — satu sumber data pasar untuk seluruh terminal
// ============================================================
// - Binance data-stream WebSocket (ticker, kline, depth, aggTrade)
//   untuk BTC/ETH dan chart gold (PAXG). Realtime penuh.
// - gold-api.com untuk harga spot XAU/USD (polling 3 detik).
// - Yahoo Finance untuk harga + candle OHLC forex (polling 30 detik).
//
// Pola: singleton + subscribe. Semua komponen UI berbagi SATU
// koneksi yang sama, jadi tidak ada request duplikat.
// ============================================================

import {
  HISTORY_LIMIT,
  SYMBOLS,
  YAHOO_RANGE,
  getConfig,
  getConfigByBinance,
} from "./symbols";
import type {
  Candle,
  EngineEvent,
  FeedStatus,
  OrderBook,
  Quote,
  SymbolConfig,
  Timeframe,
  TradeTick,
} from "./types";

const WS_BASE = "wss://data-stream.binance.vision";
const REST_BASE = "https://data-api.binance.vision";
const GOLD_API = "https://api.gold-api.com/price/XAU";
const YAHOO_BASE = "https://query1.finance.yahoo.com/v8/finance/chart";

// Payload Binance (tipe minimal — field lain tidak dipakai)
type BinanceTickerMsg = {
  c: string;
  p: string;
  P: string;
  h: string;
  l: string;
  q: string;
  b: string;
  a: string;
};
type BinanceKlineMsg = {
  t: number;
  o: string;
  h: string;
  l: string;
  c: string;
  v: string;
  x: boolean;
};
type BinanceDepthMsg = { b: [string, string][]; a: [string, string][] };
type BinanceAggTradeMsg = { a: number; T: number; p: string; q: string; m: boolean };

const SPARK_SIZE = 80;
const GOLD_POLL_MS = 3_000;
const YAHOO_POLL_MS = 30_000;
const WS_RECONNECT_MS = 3_000;
const MAX_CANDLES = 500;

/** Durasi tiap timeframe dalam detik (untuk candle forex live) */
const TF_SECONDS: Record<Timeframe, number> = {
  "1m": 60,
  "5m": 300,
  "15m": 900,
  "1h": 3600,
  "4h": 14400,
  "1d": 86400,
};

/** Mapping simbol → kode mata uang untuk API ECB (frankfurter) */
function forexCode(symbol: string): string | null {
  const map: Record<string, string> = {
    "EUR/USD": "EUR",
    "GBP/USD": "GBP",
    "USD/JPY": "JPY",
    "USD/CHF": "CHF",
    "AUD/USD": "AUD",
    "USD/CAD": "CAD",
  };
  return map[symbol] ?? null;
}

function seedQuote(cfg: SymbolConfig): Quote {
  return {
    symbol: cfg.symbol,
    price: 0,
    change24h: 0,
    changePercent24h: 0,
    high24h: 0,
    low24h: 0,
    bid: undefined,
    ask: undefined,
    source: cfg.goldSpot ? "gold-api" : cfg.binanceSymbol ? "binance" : "yahoo",
    streaming: Boolean(cfg.binanceSymbol && !cfg.goldSpot),
    updatedAt: 0,
    spark: [],
  };
}

class MarketEngine {
  private started = false;
  private ws: WebSocket | null = null;
  private wsConnected = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  private listeners = new Set<(e: EngineEvent) => void>();
  private quotes = new Map<string, Quote>();
  private book: OrderBook | null = null;
  private trades: TradeTick[] = [];
  private klineCache = new Map<string, Candle[]>();

  private goldTimer: ReturnType<typeof setInterval> | null = null;
  private yahooTimer: ReturnType<typeof setInterval> | null = null;

  private status: FeedStatus = { binance: false, gold: false, yahoo: false };

  activeSymbol = "BTC/USDT";
  activeTimeframe: Timeframe = "5m";

  constructor() {
    for (const cfg of getSymbols()) {
      this.quotes.set(cfg.symbol, seedQuote(cfg));
    }
  }

  // ---------- public API ----------

  subscribe(fn: (e: EngineEvent) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  getQuote(symbol: string): Quote | undefined {
    return this.quotes.get(symbol);
  }

  getQuotes(): Quote[] {
    return Array.from(this.quotes.values());
  }

  getBook(): OrderBook | null {
    return this.book;
  }

  getTrades(): TradeTick[] {
    return this.trades;
  }

  getStatus(): FeedStatus {
    return { ...this.status };
  }

  start(): void {
    if (this.started) return;
    this.started = true;
    this.connectWS();
    this.startGoldPolling();
    this.startYahooPolling();
  }

  /** Ganti simbol / timeframe aktif. Koneksi WS dibangun ulang sesuai kebutuhan. */
  setActive(symbol: string, timeframe?: Timeframe): void {
    const cfg = getConfig(symbol);
    if (!cfg) return;
    this.activeSymbol = symbol;
    if (timeframe) this.activeTimeframe = timeframe;
    this.connectWS();
    void this.loadCandles(symbol, this.activeTimeframe);
  }

  /** Muat history candle (REST), emit event "candles". */
  async loadCandles(symbol: string, timeframe: Timeframe): Promise<Candle[]> {
    const cfg = getConfig(symbol);
    if (!cfg) return [];
    const key = `${symbol}|${timeframe}`;
    const cached = this.klineCache.get(key);
    if (cached && cached.length > 0) {
      this.emit({ type: "candles", symbol, timeframe, candles: cached });
      return cached;
    }
    try {
      const candles = cfg.binanceSymbol
        ? await this.fetchBinanceKlines(cfg.binanceSymbol, timeframe)
        : cfg.yahooSymbol
          ? await this.fetchYahooCandles(cfg.yahooSymbol, timeframe).catch(
              () => [],
            )
          : [];
      if (candles.length > 0) {
        this.klineCache.set(key, candles.slice(-MAX_CANDLES));
        this.emit({ type: "candles", symbol, timeframe, candles });
        return candles;
      }
      // Yahoo gagal (rate limit dsb.) → fallback data harian ECB untuk forex
      if (cfg.yahooSymbol) {
        const fallback = await this.fetchFrankfurterDaily(symbol, timeframe);
        if (fallback.length > 0) {
          this.klineCache.set(key, fallback.slice(-MAX_CANDLES));
          this.emit({ type: "candles", symbol, timeframe, candles: fallback });
          return fallback;
        }
      }
      return [];
    } catch (err) {
      console.error(`[market] failed to load candles ${symbol} ${timeframe}:`, err);
      return [];
    }
  }

  // ---------- internals ----------

  private emit(e: EngineEvent): void {
    this.listeners.forEach((fn) => {
      try {
        fn(e);
      } catch (err) {
        console.error("[market] listener error:", err);
      }
    });
  }

  private updateQuote(symbol: string, patch: Partial<Quote>): void {
    const prev = this.quotes.get(symbol);
    if (!prev) return;
    const quote: Quote = { ...prev, ...patch, updatedAt: Date.now() };
    if (patch.price !== undefined && Number.isFinite(patch.price)) {
      quote.spark = [...prev.spark, patch.price].slice(-SPARK_SIZE);
      // forex: bangun candle live dari tiap update harga
      if (getConfig(symbol)?.yahooSymbol) {
        this.buildForexCandle(symbol, patch.price);
      }
    }
    this.quotes.set(symbol, quote);
    this.emit({ type: "quote", quote });
  }

  // ---------- Binance WebSocket ----------

  private wsStreams(): string[] {
    const streams: string[] = [];
    for (const cfg of getSymbols()) {
      if (cfg.binanceSymbol) {
        streams.push(`${cfg.binanceSymbol.toLowerCase()}@ticker`);
      }
    }
    const active = getConfig(this.activeSymbol);
    if (active?.binanceSymbol) {
      const b = active.binanceSymbol.toLowerCase();
      streams.push(`${b}@kline_${this.activeTimeframe}`);
      streams.push(`${b}@depth10@100ms`);
      streams.push(`${b}@aggTrade`);
    }
    return streams;
  }

  private connectWS(): void {
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        /* noop */
      }
      this.ws = null;
    }
    const streams = this.wsStreams();
    try {
      this.ws = new WebSocket(`${WS_BASE}/stream?streams=${streams.join("/")}`);
    } catch {
      this.scheduleReconnect();
      return;
    }
    this.ws.onopen = () => {
      this.wsConnected = true;
      this.setStatus({ binance: true });
    };
    this.ws.onmessage = (ev) => {
      try {
        this.handleWSMessage(JSON.parse(ev.data as string));
      } catch (err) {
        console.error("[market] ws parse error:", err);
      }
    };
    this.ws.onclose = () => {
      this.wsConnected = false;
      this.setStatus({ binance: false });
      this.scheduleReconnect();
    };
    this.ws.onerror = () => {
      try {
        this.ws?.close();
      } catch {
        /* noop */
      }
    };
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connectWS();
    }, WS_RECONNECT_MS);
  }

  private setStatus(patch: Partial<FeedStatus>): void {
    this.status = { ...this.status, ...patch };
    this.emit({ type: "status", status: { ...this.status } });
  }

  private handleWSMessage(msg: { stream?: string; data?: unknown }): void {
    if (!msg.stream || msg.data === undefined) return;
    const [rawSymbol, event] = msg.stream.split("@");
    if (event === "ticker") {
      this.applyBinanceTicker(rawSymbol, msg.data as BinanceTickerMsg);
    } else if (event.startsWith("kline_")) {
      this.applyKline(msg.data as BinanceKlineMsg);
    } else if (event.startsWith("depth")) {
      this.applyDepth(msg.data as BinanceDepthMsg);
    } else if (event === "aggTrade") {
      this.applyTrade(msg.data as BinanceAggTradeMsg);
    }
  }

  private applyBinanceTicker(rawSymbol: string, t: BinanceTickerMsg): void {
    const cfg = getConfigByBinance(rawSymbol);
    if (!cfg) return;
    const price = Number(t.c);
    if (!Number.isFinite(price) || price <= 0) return;
    const change24h = Number(t.p);
    const changePercent24h = Number(t.P);
    const high24h = Number(t.h);
    const low24h = Number(t.l);
    const volume24h = Number(t.q);
    const bid = Number(t.b);
    const ask = Number(t.a);

    if (cfg.goldSpot) {
      // Gold spot: harga dari gold-api, statistik 24h dari PAXG (tokenized gold).
      this.updateQuote(cfg.symbol, {
        change24h,
        changePercent24h,
        high24h,
        low24h,
        volume24h,
        bid,
        ask,
        source: "gold-api",
      });
      return;
    }
    this.updateQuote(cfg.symbol, {
      price,
      change24h,
      changePercent24h,
      high24h,
      low24h,
      volume24h,
      bid,
      ask,
      source: "binance",
      streaming: true,
    });
  }

  private applyKline(k: BinanceKlineMsg): void {
    if (!k) return;
    const cfg = getConfig(this.activeSymbol);
    if (!cfg) return;
    const candle: Candle = {
      time: Math.floor(Number(k.t) / 1000),
      open: Number(k.o),
      high: Number(k.h),
      low: Number(k.l),
      close: Number(k.c),
      volume: Number(k.v),
    };
    if (
      !Number.isFinite(candle.time) ||
      !Number.isFinite(candle.close) ||
      candle.close <= 0
    ) {
      return;
    }
    const key = `${this.activeSymbol}|${this.activeTimeframe}`;
    const arr = this.klineCache.get(key);
    if (arr) {
      const last = arr[arr.length - 1];
      if (last && last.time === candle.time) {
        arr[arr.length - 1] = candle;
      } else if (!last || candle.time > last.time) {
        arr.push(candle);
        if (arr.length > MAX_CANDLES) arr.shift();
      }
      this.klineCache.set(key, arr);
    }
    this.emit({
      type: "candle-update",
      symbol: this.activeSymbol,
      timeframe: this.activeTimeframe,
      candle,
      isClosed: Boolean(k.x),
    });
  }

  private applyDepth(d: BinanceDepthMsg): void {
    if (!d || !Array.isArray(d.b) || !Array.isArray(d.a)) return;
    const bids = d.b
      .slice(0, 10)
      .map(([p, q]: [string, string]) => ({ price: Number(p), qty: Number(q) }));
    const asks = d.a
      .slice(0, 10)
      .map(([p, q]: [string, string]) => ({ price: Number(p), qty: Number(q) }));
    this.book = { symbol: this.activeSymbol, bids, asks };
    this.emit({ type: "book", book: this.book });
  }

  private applyTrade(t: BinanceAggTradeMsg): void {
    if (!t) return;
    const trade: TradeTick = {
      id: String(t.a),
      time: Number(t.T),
      price: Number(t.p),
      qty: Number(t.q),
      side: t.m ? "sell" : "buy",
    };
    if (!Number.isFinite(trade.price) || trade.price <= 0) return;
    this.trades = [trade, ...this.trades].slice(0, 30);
    this.emit({ type: "trades", symbol: this.activeSymbol, trades: this.trades });
  }

  // ---------- polling: gold spot ----------

  private startGoldPolling(): void {
    const poll = async () => {
      try {
        const res = await fetch(GOLD_API, { cache: "no-store" });
        if (!res.ok) return;
        const j = await res.json();
        const price = Number(j.price);
        if (!Number.isFinite(price) || price <= 0) return;
        const cfg = getConfig("XAU/USD");
        if (!cfg) return;
        this.setStatus({ gold: true });
        const spread = cfg.indicativeSpread ?? 0.5;
        this.updateQuote("XAU/USD", {
          price,
          bid: price - spread / 2,
          ask: price + spread / 2,
        });
      } catch (err) {
        console.error("[market] gold poll error:", err);
      }
    };
    void poll();
    this.goldTimer = setInterval(poll, GOLD_POLL_MS);
  }

  // ---------- polling: forex (Yahoo Finance + fallback ECB) ----------

  private startYahooPolling(): void {
    const poll = async () => {
      const yahooOk = await this.pollYahooForex();
      // Yahoo kena rate-limit / error → fallback frankfurter (ECB, 1 request untuk semua pair)
      if (!yahooOk) {
        await this.pollFrankfurterForex();
      }
    };
    void poll();
    this.yahooTimer = setInterval(poll, YAHOO_POLL_MS);
  }

  /** Poll semua pair forex via Yahoo. Return true jika semua sukses. */
  private async pollYahooForex(): Promise<boolean> {
    let allOk = true;
    await Promise.all(
      getSymbols()
        .filter((c) => c.yahooSymbol)
        .map(async (cfg) => {
          try {
            const res = await fetch(
              `${YAHOO_BASE}/${cfg.yahooSymbol}?interval=1d&range=5d`,
              { cache: "no-store" },
            );
            if (!res.ok) {
              allOk = false;
              return;
            }
            const j = await res.json();
            const meta = j?.chart?.result?.[0]?.meta;
            if (!meta) {
              allOk = false;
              return;
            }
            const price = Number(meta.regularMarketPrice);
            if (!Number.isFinite(price) || price <= 0) {
              allOk = false;
              return;
            }
            const prevClose = Number(
              meta.chartPreviousClose ?? meta.previousClose ?? price,
            );
            const change24h = prevClose > 0 ? price - prevClose : 0;
            const changePercent24h =
              prevClose > 0 ? (change24h / prevClose) * 100 : 0;
            const high = Number(meta.regularMarketDayHigh) || price;
            const low = Number(meta.regularMarketDayLow) || price;
            const spread = cfg.indicativeSpread ?? price * 0.0001;
            this.setStatus({ yahoo: true });
            this.updateQuote(cfg.symbol, {
              price,
              change24h,
              changePercent24h,
              high24h: high,
              low24h: low,
              bid: price - spread / 2,
              ask: price + spread / 2,
              source: "yahoo",
            });
          } catch {
            allOk = false;
          }
        }),
    );
    return allOk;
  }

  /** Fallback: bank sentral Eropa (ECB) via frankfurter.dev — data real, 1 request. */
  private async pollFrankfurterForex(): Promise<void> {
    try {
      const end = new Date();
      const start = new Date(end.getTime() - 5 * 24 * 60 * 60 * 1000);
      const fmt = (d: Date) => d.toISOString().slice(0, 10);
      const res = await fetch(
        `https://api.frankfurter.dev/v1/${fmt(start)}..${fmt(end)}?from=USD`,
        { cache: "no-store" },
      );
      if (!res.ok) return;
      const j = await res.json();
      const dates = Object.keys(j?.rates ?? {}).sort();
      if (dates.length < 2) return;
      const current = j.rates[dates[dates.length - 1]];
      const prev = j.rates[dates[dates.length - 2]];
      if (!current || !prev) return;
      this.setStatus({ yahoo: true });

      for (const cfg of getSymbols().filter((c) => c.category === "forex")) {
        const ccy = forexCode(cfg.symbol);
        if (!ccy) continue;
        const cur = Number(current[ccy]);
        const pv = Number(prev[ccy]);
        if (!Number.isFinite(cur) || cur <= 0) continue;
        // pair yang base-nya USD (USD/JPY, USD/CHF, USD/CAD) → langsung.
        // pasangan quote-nya USD (EUR/USD, GBP/USD, AUD/USD) → inverse.
        const inverse = cfg.symbol.endsWith("/USD");
        const price = inverse ? 1 / cur : cur;
        const prevPrice = inverse && pv > 0 ? 1 / pv : pv;
        const change24h = prevPrice > 0 ? price - prevPrice : 0;
        const changePercent24h =
          prevPrice > 0 ? (change24h / prevPrice) * 100 : 0;
        const spread = cfg.indicativeSpread ?? price * 0.0001;
        this.updateQuote(cfg.symbol, {
          price,
          change24h,
          changePercent24h,
          high24h: price,
          low24h: price,
          bid: price - spread / 2,
          ask: price + spread / 2,
          source: "frankfurter",
        });
      }
    } catch (err) {
      console.error("[market] frankfurter poll error:", err);
    }
  }

  /** Bangun candle live untuk forex dari tiap update quote (polling). */
  private buildForexCandle(symbol: string, price: number): void {
    if (symbol !== this.activeSymbol) return;
    const cfg = getConfig(symbol);
    if (!cfg || !cfg.yahooSymbol) return;
    const intervalSec = TF_SECONDS[this.activeTimeframe];
    const bucket = Math.floor(Date.now() / 1000 / intervalSec) * intervalSec;
    const key = `${symbol}|${this.activeTimeframe}`;
    const arr = this.klineCache.get(key) ?? [];
    const last = arr[arr.length - 1];
    if (last && last.time === bucket) {
      last.high = Math.max(last.high, price);
      last.low = Math.min(last.low, price);
      last.close = price;
    } else if (!last || bucket > last.time) {
      arr.push({
        time: bucket,
        open: price,
        high: price,
        low: price,
        close: price,
      });
      if (arr.length > MAX_CANDLES) arr.shift();
    } else {
      return; // candle lama, abaikan
    }
    this.klineCache.set(key, arr);
    this.emit({
      type: "candle-update",
      symbol,
      timeframe: this.activeTimeframe,
      candle: arr[arr.length - 1],
      isClosed: false,
    });
  }

  // ---------- REST: history candles ----------

  private async fetchBinanceKlines(
    binanceSymbol: string,
    timeframe: Timeframe,
  ): Promise<Candle[]> {
    const res = await fetch(
      `${REST_BASE}/api/v3/klines?symbol=${binanceSymbol}&interval=${timeframe}&limit=${HISTORY_LIMIT}`,
      { cache: "no-store" },
    );
    if (!res.ok) throw new Error(`binance klines ${res.status}`);
    const rows = (await res.json()) as Array<
      [number, string, string, string, string, string]
    >;
    return rows
      .map((k) => ({
        time: Math.floor(Number(k[0]) / 1000),
        open: Number(k[1]),
        high: Number(k[2]),
        low: Number(k[3]),
        close: Number(k[4]),
        volume: Number(k[5]),
      }))
      .filter((c) => Number.isFinite(c.close) && c.close > 0);
  }

  private async fetchYahooCandles(
    yahooSymbol: string,
    timeframe: Timeframe,
  ): Promise<Candle[]> {
    const range = YAHOO_RANGE[timeframe];
    const res = await fetch(
      `${YAHOO_BASE}/${yahooSymbol}?interval=${timeframe}&range=${range}`,
      { cache: "no-store" },
    );
    if (!res.ok) throw new Error(`yahoo chart ${res.status}`);
    const j = await res.json();
    const result = j?.chart?.result?.[0];
    if (!result) return [];
    const ts: number[] = result.timestamp ?? [];
    const q = result.indicators?.quote?.[0] ?? {};
    return ts
      .map((t, i) => ({
        time: t,
        open: Number(q.open?.[i]),
        high: Number(q.high?.[i]),
        low: Number(q.low?.[i]),
        close: Number(q.close?.[i]),
        volume: Number(q.volume?.[i]) || undefined,
      }))
      .filter((c) => Number.isFinite(c.close) && c.close > 0);
  }

  /** Fallback history forex 1D: ECB via frankfurter (harga penutupan harian real). */
  private async fetchFrankfurterDaily(
    symbol: string,
    timeframe: Timeframe,
  ): Promise<Candle[]> {
    if (timeframe !== "1d") return [];
    const ccy = forexCode(symbol);
    if (!ccy) return [];
    const end = new Date();
    const start = new Date(end.getTime() - 200 * 24 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    const res = await fetch(
      `https://api.frankfurter.dev/v1/${fmt(start)}..${fmt(end)}?from=USD`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    const j = await res.json();
    const dates = Object.keys(j?.rates ?? {}).sort();
    const inverse = symbol.endsWith("/USD");
    return dates
      .map((date) => {
        const v = Number(j.rates[date]?.[ccy]);
        if (!Number.isFinite(v) || v <= 0) return null;
        const price = inverse ? 1 / v : v;
        const t = Math.floor(new Date(date).getTime() / 1000);
        return { time: t, open: price, high: price, low: price, close: price };
      })
      .filter((c): c is Candle => c !== null);
  }

  destroy(): void {
    if (this.ws) {
      try {
        this.ws.close();
      } catch {
        /* noop */
      }
      this.ws = null;
    }
    if (this.goldTimer) clearInterval(this.goldTimer);
    if (this.yahooTimer) clearInterval(this.yahooTimer);
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.listeners.clear();
  }
}

function getSymbols(): SymbolConfig[] {
  return SYMBOLS;
}

export const marketEngine = new MarketEngine();
