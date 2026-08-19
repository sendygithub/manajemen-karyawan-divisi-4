// ============================================================
// MARKET TYPES — tipe bersama untuk data pasar realtime
// ============================================================

export type MarketCategory = "crypto" | "gold" | "forex";

export type Timeframe = "1m" | "5m" | "15m" | "1h" | "4h" | "1d";

export interface SymbolConfig {
  /** Simbol yang ditampilkan, mis. "BTC/USDT" */
  symbol: string;
  /** Nama pasar, mis. "Bitcoin" */
  name: string;
  category: MarketCategory;
  /** Jumlah desimal harga */
  decimals: number;
  /** Simbol Binance (kline/ticker/depth/trades). Crypto + gold(PAXG) */
  binanceSymbol?: string;
  /** Simbol Yahoo Finance untuk candle OHLC forex (mis. "EURUSD=X") */
  yahooSymbol?: string;
  /** true = harga diambil dari gold-api spot, statistik dari Binance (PAXG) */
  goldSpot?: boolean;
  /** Label sumber data untuk UI */
  sourceLabel: string;
  /** Spread indikatif (OTC) dalam unit harga untuk bid/ask */
  indicativeSpread?: number;
  /** Ukuran kontrak per 1.0 lot (unit base). XAU: 100 oz · forex: 100000 unit · crypto: 1 koin */
  contractSize: number;
  /** Ukuran 1 pip/point dalam satuan harga. XAU: 0.1 · JPY pair: 0.01 · forex lain: 0.0001 · crypto: 1 */
  pipSize: number;
  /** Mata uang kuotasi — dipakai konversi pip value ke USD */
  quoteCurrency: "USD" | "JPY" | "CHF" | "CAD";
}

export type QuoteSource = "binance" | "gold-api" | "yahoo" | "frankfurter";

export interface Quote {
  symbol: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  volume24h?: number;
  bid?: number;
  ask?: number;
  source: QuoteSource;
  /** true = streaming WebSocket, false = polling */
  streaming: boolean;
  updatedAt: number;
  /** Riwayat harga terakhir untuk sparkline watchlist */
  spark: number[];
}

export interface Candle {
  /** Unix seconds */
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface BookLevel {
  price: number;
  qty: number;
}

export interface OrderBook {
  symbol: string;
  bids: BookLevel[];
  asks: BookLevel[];
}

export interface TradeTick {
  id: string;
  time: number;
  price: number;
  qty: number;
  side: "buy" | "sell";
}

export interface FeedStatus {
  binance: boolean;
  gold: boolean;
  yahoo: boolean;
}

export type EngineEvent =
  | { type: "quote"; quote: Quote }
  | { type: "candles"; symbol: string; timeframe: Timeframe; candles: Candle[] }
  | {
      type: "candle-update";
      symbol: string;
      timeframe: Timeframe;
      candle: Candle;
      isClosed: boolean;
    }
  | { type: "book"; book: OrderBook }
  | { type: "trades"; symbol: string; trades: TradeTick[] }
  | { type: "status"; status: FeedStatus };
