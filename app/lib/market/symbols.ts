// ============================================================
// MARKET SYMBOLS — konfigurasi semua simbol yang ditradingkan
// ============================================================
// Sumber data (semua REAL, tanpa API key):
//  - Crypto (BTC/ETH) & Gold chart : Binance data-stream (WebSocket realtime)
//  - Gold spot XAU/USD             : gold-api.com (polling 3 detik)
//  - Forex 6 pasangan              : Yahoo Finance chart API (polling 30 detik)
// ============================================================

import type { SymbolConfig, Timeframe } from "./types";

export const SYMBOLS: SymbolConfig[] = [
  {
    symbol: "BTC/USDT",
    name: "Bitcoin",
    category: "crypto",
    decimals: 2,
    binanceSymbol: "BTCUSDT",
    sourceLabel: "Binance",
    contractSize: 1,
    pipSize: 1,
    quoteCurrency: "USD",
  },
  {
    symbol: "ETH/USDT",
    name: "Ethereum",
    category: "crypto",
    decimals: 2,
    binanceSymbol: "ETHUSDT",
    sourceLabel: "Binance",
    contractSize: 1,
    pipSize: 1,
    quoteCurrency: "USD",
  },
  {
    symbol: "XAU/USD",
    name: "Gold Spot",
    category: "gold",
    decimals: 2,
    binanceSymbol: "PAXGUSDT",
    goldSpot: true,
    sourceLabel: "gold-api + Binance (PAXG)",
    indicativeSpread: 0.5,
    contractSize: 100,
    pipSize: 0.1,
    quoteCurrency: "USD",
  },
  {
    symbol: "EUR/USD",
    name: "Euro",
    category: "forex",
    decimals: 4,
    yahooSymbol: "EURUSD=X",
    sourceLabel: "Yahoo · ECB fallback",
    indicativeSpread: 0.00012,
    contractSize: 100000,
    pipSize: 0.0001,
    quoteCurrency: "USD",
  },
  {
    symbol: "GBP/USD",
    name: "British Pound",
    category: "forex",
    decimals: 4,
    yahooSymbol: "GBPUSD=X",
    sourceLabel: "Yahoo · ECB fallback",
    indicativeSpread: 0.00016,
    contractSize: 100000,
    pipSize: 0.0001,
    quoteCurrency: "USD",
  },
  {
    symbol: "USD/JPY",
    name: "Japanese Yen",
    category: "forex",
    decimals: 2,
    yahooSymbol: "JPY=X",
    sourceLabel: "Yahoo · ECB fallback",
    indicativeSpread: 0.012,
    contractSize: 100000,
    pipSize: 0.01,
    quoteCurrency: "JPY",
  },
  {
    symbol: "USD/CHF",
    name: "Swiss Franc",
    category: "forex",
    decimals: 4,
    yahooSymbol: "CHF=X",
    sourceLabel: "Yahoo · ECB fallback",
    indicativeSpread: 0.00018,
    contractSize: 100000,
    pipSize: 0.0001,
    quoteCurrency: "CHF",
  },
  {
    symbol: "AUD/USD",
    name: "Australian Dollar",
    category: "forex",
    decimals: 4,
    yahooSymbol: "AUDUSD=X",
    sourceLabel: "Yahoo · ECB fallback",
    indicativeSpread: 0.00014,
    contractSize: 100000,
    pipSize: 0.0001,
    quoteCurrency: "USD",
  },
  {
    symbol: "USD/CAD",
    name: "Canadian Dollar",
    category: "forex",
    decimals: 4,
    yahooSymbol: "CAD=X",
    sourceLabel: "Yahoo · ECB fallback",
    indicativeSpread: 0.00016,
    contractSize: 100000,
    pipSize: 0.0001,
    quoteCurrency: "CAD",
  },
];

export const TIMEFRAMES: Timeframe[] = ["1m", "5m", "15m", "1h", "4h", "1d"];

const SYMBOL_MAP = new Map(SYMBOLS.map((s) => [s.symbol, s]));
const BINANCE_MAP = new Map(
  SYMBOLS.filter((s) => s.binanceSymbol).map((s) => [
    s.binanceSymbol!.toLowerCase(),
    s,
  ]),
);
const YAHOO_MAP = new Map(
  SYMBOLS.filter((s) => s.yahooSymbol).map((s) => [s.yahooSymbol!, s]),
);

export function getConfig(symbol: string): SymbolConfig | undefined {
  return SYMBOL_MAP.get(symbol);
}

export function getConfigByBinance(raw: string): SymbolConfig | undefined {
  return BINANCE_MAP.get(raw.toLowerCase());
}

export function getConfigByYahoo(raw: string): SymbolConfig | undefined {
  return YAHOO_MAP.get(raw);
}

export function isSupportedSymbol(symbol: string): boolean {
  return SYMBOL_MAP.has(symbol);
}

/** Rentang history Yahoo per timeframe (di luar rentang, Yahoo menolak) */
export const YAHOO_RANGE: Record<Timeframe, string> = {
  "1m": "1d",
  "5m": "5d",
  "15m": "1mo",
  "1h": "1mo",
  "4h": "3mo",
  "1d": "1y",
};

/** Jumlah candle history yang dimuat */
export const HISTORY_LIMIT = 300;
