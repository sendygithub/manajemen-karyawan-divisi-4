// ============================================================
// TRADING CALCULATOR — rumus murni (pure functions, tanpa UI)
// ============================================================
// Semua fungsi di file ini murni: angka masuk → angka keluar.
// Komponen UI (components/trading/trading-calculator.tsx) hanya
// memakai hasilnya — logic & tampilan terpisah (separation of
// concern). Konvensi ukuran kontrak mengikuti standar retail:
//   - XAU/USD : 1 lot = 100 oz · pip = 0.10
//   - Forex   : 1 lot = 100.000 unit · pip = 0.0001 (JPY: 0.01)
//   - Crypto  : 1 lot = 1 koin · point = 1 USD
// CATATAN JUJUR: XAU/USD adalah pasar OTC. Konvensi lot/pip di
// sini mengikuti standar broker umum dan bersifat indikatif.
// ============================================================

import type { SymbolConfig } from "@/lib/market/types";

export type CalculatorSide = "LONG" | "SHORT";

export interface CalculatorParams {
  symbol: string;
  side: CalculatorSide;
  /** Saldo akun (USD) */
  balance: number;
  /** Risiko dalam persen saldo (0–100) */
  riskPct: number;
  entry: number;
  stop: number;
  /** Target profit / TP (<= 0 = tidak diisi) */
  target: number;
  leverage: number;
}

export interface CalculatorResult {
  /** Ukuran posisi dalam lot */
  lots: number;
  /** Ukuran posisi dalam unit base (lot × contractSize) */
  units: number;
  /** Nilai nosional = entry × units */
  notional: number;
  /** Risiko dalam USD = balance × riskPct% */
  riskAmount: number;
  /** Risiko aktual dalam % saldo (harus ≈ riskPct jika valid) */
  riskPctActual: number;
  /** Rasio risk:reward (null jika TP kosong / tidak valid) */
  rr: number | null;
  /** Margin yang dibutuhkan = notional ÷ leverage */
  margin: number;
  /** Nilai 1 pip/point dalam USD */
  pipValueUsd: number;
  /** P&L jika harga menyentuh TP (null jika TP kosong) */
  pnlAtTarget: number | null;
  /** P&L jika harga menyentuh SL (selalu negatif saat input valid) */
  pnlAtStop: number;
  /** Harga likuidasi (loss = 90% margin, sama dengan execution engine) */
  liqPrice: number;
}

/** Rasio loss margin sebelum likuidasi (0.9 = 90% margin habis) */
const LIQ_MARGIN_LOSS = 0.9;

/** Units dari jumlah lot */
export function contractUnits(cfg: SymbolConfig, lots: number): number {
  return lots * cfg.contractSize;
}

/** Nilai nosional posisi */
export function notionalValue(price: number, units: number): number {
  return price * units;
}

/** Margin yang dibutuhkan */
export function marginRequired(price: number, units: number, leverage: number): number {
  if (leverage <= 0) return 0;
  return (price * units) / leverage;
}

/**
 * Nilai 1 pip/point dalam USD untuk jumlah lot tertentu.
 * Untuk pasangan dengan quote non-USD (USD/JPY, USD/CHF, USD/CAD)
 * nilai pip dalam mata uang quote dibagi harga → USD.
 */
export function pipValueUsd(cfg: SymbolConfig, lots: number, price: number): number {
  if (price <= 0) return 0;
  const perLot = cfg.contractSize * cfg.pipSize;
  const perLotUsd = cfg.quoteCurrency === "USD" ? perLot : perLot / price;
  return perLotUsd * lots;
}

/** Risiko dalam USD dari persen saldo */
export function riskAmountUsd(balance: number, riskPct: number): number {
  return (balance * riskPct) / 100;
}

/**
 * Jumlah lot agar risiko = riskAmount USD.
 * Risiko per lot = |entry − stop| × contractSize.
 */
export function positionSizeLots(params: {
  entry: number;
  stop: number;
  contractSize: number;
  riskAmount: number;
}): number {
  const { entry, stop, contractSize, riskAmount } = params;
  const riskPerLot = Math.abs(entry - stop) * contractSize;
  if (riskPerLot <= 0) return 0;
  return riskAmount / riskPerLot;
}

/** P&L: LONG = (exit − entry) × units · SHORT = (entry − exit) × units */
export function pnl(side: CalculatorSide, entry: number, exit: number, units: number): number {
  return side === "LONG" ? (exit - entry) * units : (entry - exit) * units;
}

/** Rasio risk:reward = |TP − entry| ÷ |entry − SL| */
export function riskRewardRatio(entry: number, stop: number, target: number): number | null {
  const risk = Math.abs(entry - stop);
  const reward = Math.abs(target - entry);
  if (risk <= 0 || !Number.isFinite(reward) || reward <= 0) return null;
  return reward / risk;
}

/** Harga likuidasi — formula sama dengan execution engine di trading-provider */
export function liqPrice(side: CalculatorSide, entry: number, leverage: number): number {
  if (leverage <= 0) return 0;
  return side === "LONG"
    ? entry * (1 - LIQ_MARGIN_LOSS / leverage)
    : entry * (1 + LIQ_MARGIN_LOSS / leverage);
}

/** Validasi posisi SL relatif entry */
export function isStopValid(side: CalculatorSide, entry: number, stop: number): boolean {
  return side === "LONG" ? stop < entry : stop > entry;
}

/**
 * Agregator: semua hitungan dari satu set input.
 * Return null jika input tidak valid (bukan angka, SL salah arah, dll).
 */
export function calculate(cfg: SymbolConfig, p: CalculatorParams): CalculatorResult | null {
  const { side, balance, riskPct, entry, stop, target, leverage } = p;

  const required = [balance, riskPct, entry, stop, leverage];
  if (!required.every((n) => Number.isFinite(n) && n > 0)) return null;
  if (!isStopValid(side, entry, stop)) return null;

  const riskAmount = riskAmountUsd(balance, riskPct);
  const lots = positionSizeLots({
    entry,
    stop,
    contractSize: cfg.contractSize,
    riskAmount,
  });
  const units = contractUnits(cfg, lots);
  const notional = notionalValue(entry, units);
  const margin = marginRequired(entry, units, leverage);
  const pipValue = pipValueUsd(cfg, lots, entry);
  const rr = riskRewardRatio(entry, stop, target);
  const pnlAtTarget = target > 0 ? pnl(side, entry, target, units) : null;
  const pnlAtStop = pnl(side, entry, stop, units);
  const liq = liqPrice(side, entry, leverage);
  const riskPctActual = balance > 0 ? (Math.abs(pnlAtStop) / balance) * 100 : 0;

  return {
    lots,
    units,
    notional,
    riskAmount,
    riskPctActual,
    rr,
    margin,
    pipValueUsd: pipValue,
    pnlAtTarget,
    pnlAtStop,
    liqPrice: liq,
  };
}

/** Daftar rumus untuk panel edukasi di UI */
export const FORMULAS: { name: string; formula: string; note?: string }[] = [
  { name: "Notional", formula: "harga × contract × lots" },
  { name: "Margin", formula: "notional ÷ leverage" },
  { name: "Risiko (USD)", formula: "|entry − SL| × contract × lots" },
  { name: "Nilai pip", formula: "contract × pipSize × lots", note: "÷ harga untuk quote non-USD (JPY/CHF/CAD)" },
  { name: "R:R", formula: "|TP − entry| ÷ |entry − SL|" },
  { name: "Liq. price", formula: "LONG: entry × (1 − 0.9/lev) · SHORT: entry × (1 + 0.9/lev)" },
];
