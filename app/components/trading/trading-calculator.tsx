"use client";

// ============================================================
// TRADING CALCULATOR — hitung ukuran posisi, margin, pip value,
// P&L & risk:reward dengan harga live + saldo akun real.
// Semua rumus murni ada di lib/trading/calculator.ts (SoC:
// komponen ini hanya menampilkan hasil, tidak menghitung).
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { SYMBOLS, getConfig } from "@/lib/market/symbols";
import { useTrading } from "./trading-provider";
import {
  formatMoney,
  formatPercent,
  formatPrice,
  pnlClass,
} from "@/lib/trading/format";
import { cn } from "@/lib/utils";
import {
  calculate,
  FORMULAS,
  isStopValid,
  type CalculatorSide,
} from "@/lib/trading/calculator";

function Row({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span
        className={cn(
          "text-xs font-semibold tabular-nums text-slate-200",
          valueClass,
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function TradingCalculator() {
  const { quotes, account } = useTrading();

  const [symbol, setSymbol] = useState("XAU/USD");
  const [side, setSide] = useState<CalculatorSide>("LONG");
  const [entry, setEntry] = useState("");
  const [stop, setStop] = useState("");
  const [target, setTarget] = useState("");
  const [balance, setBalance] = useState("");
  const [riskPct, setRiskPct] = useState("1");
  const [leverage, setLeverage] = useState(10);

  const cfg = getConfig(symbol);
  const base = symbol.split("/")[0];
  const live = quotes[symbol]?.price;

  // ganti simbol → isi ulang entry dari harga live (jika sudah ada)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill entry saat ganti simbol, disengaja
    setEntry(live && live > 0 ? live.toFixed(cfg?.decimals ?? 2) : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol]);

  // harga live pertama masuk & entry masih kosong → isi otomatis
  useEffect(() => {
    if (live && live > 0 && entry === "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill entry dari harga live, disengaja
      setEntry(live.toFixed(cfg?.decimals ?? 2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, cfg?.decimals]);

  // prefill saldo dari akun trading
  useEffect(() => {
    if (account?.balance != null && balance === "") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill saldo dari akun, disengaja
      setBalance(String(account.balance));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account?.balance]);

  const result = useMemo(() => {
    if (!cfg) return null;
    const nEntry = Number(entry);
    const nStop = Number(stop);
    const nTarget = Number(target);
    const nBalance = Number(balance);
    const nRisk = Number(riskPct);
    const nLev = Number(leverage);
    if (![nEntry, nStop, nBalance, nRisk].every((n) => Number.isFinite(n) && n > 0)) {
      return null;
    }
    if (nLev <= 0) return null;
    return calculate(cfg, {
      symbol,
      side,
      balance: nBalance,
      riskPct: nRisk,
      entry: nEntry,
      stop: nStop,
      target: nTarget > 0 ? nTarget : 0,
      leverage: nLev,
    });
  }, [cfg, symbol, side, entry, stop, target, balance, riskPct, leverage]);

  const nEntry = Number(entry);
  const nStop = Number(stop);
  const stopDirectionOk =
    Number.isFinite(nEntry) &&
    Number.isFinite(nStop) &&
    nEntry > 0 &&
    nStop > 0 &&
    isStopValid(side, nEntry, nStop);

  const fmtNum = (n: number, max = 4) =>
    n.toLocaleString("en-US", { maximumFractionDigits: max });

  const useLive = () => {
    if (live && live > 0) setEntry(live.toFixed(cfg?.decimals ?? 2));
  };

  const inputCls =
    "w-full rounded-md border border-[#2b3139] bg-[#0d1116] px-2.5 py-2 text-sm tabular-nums text-slate-200 outline-none focus:border-amber-400/60";
  const labelCls =
    "mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-500";

  return (
    <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-12">
      {/* ============ INPUT ============ */}
      <section className="lg:col-span-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">
            Kalkulator Trading
          </span>
          <span className="text-[10px] text-slate-500">
            Harga live · {cfg?.sourceLabel}
          </span>
        </div>

        {/* Symbol */}
        <label className={labelCls}>Simbol</label>
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className={cn(inputCls, "mb-2 appearance-none")}
        >
          {SYMBOLS.map((s) => (
            <option key={s.symbol} value={s.symbol}>
              {s.symbol} — {s.name}
            </option>
          ))}
        </select>
        <p className="mb-3 text-[10px] text-slate-600">
          1 lot = {fmtNum(cfg?.contractSize ?? 0, 0)} {base} · pip/point ={" "}
          {cfg?.pipSize}
        </p>

        {/* Side */}
        <div className="mb-3 grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => setSide("LONG")}
            className={cn(
              "rounded-md py-2 text-xs font-bold uppercase tracking-wide transition-colors",
              side === "LONG"
                ? "bg-emerald-500 text-emerald-950"
                : "bg-[#1a2027] text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400",
            )}
          >
            Buy / Long
          </button>
          <button
            type="button"
            onClick={() => setSide("SHORT")}
            className={cn(
              "rounded-md py-2 text-xs font-bold uppercase tracking-wide transition-colors",
              side === "SHORT"
                ? "bg-red-500 text-red-950"
                : "bg-[#1a2027] text-slate-400 hover:bg-red-500/10 hover:text-red-400",
            )}
          >
            Sell / Short
          </button>
        </div>

        {/* Entry */}
        <label className={labelCls}>
          <span className="flex items-center justify-between">
            <span>Entry (harga)</span>
            <button
              type="button"
              onClick={useLive}
              disabled={!live || live <= 0}
              className="rounded bg-[#1a2027] px-1.5 py-0.5 text-[9px] font-medium text-amber-400 transition-colors hover:bg-[#2b3139] disabled:opacity-40"
            >
              ← live {live ? formatPrice(symbol, live) : "…"}
            </button>
          </span>
        </label>
        <input
          type="number"
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="0"
          className={cn(inputCls, "mb-3")}
        />

        {/* SL / TP */}
        <div className="mb-3 grid grid-cols-2 gap-2">
          <div>
            <label className={labelCls}>Stop loss</label>
            <input
              type="number"
              value={stop}
              onChange={(e) => setStop(e.target.value)}
              placeholder="0"
              className={cn(inputCls, "border-red-500/25 focus:border-red-400/60")}
            />
          </div>
          <div>
            <label className={labelCls}>Target (TP)</label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="opsional"
              className={cn(inputCls, "border-emerald-500/25 focus:border-emerald-400/60")}
            />
          </div>
        </div>

        {/* Balance + risk */}
        <div className="mb-3 grid grid-cols-2 gap-2">
          <div>
            <label className={labelCls}>Saldo (USD)</label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="10000"
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Risiko %</label>
            <input
              type="number"
              min={0.1}
              step={0.1}
              value={riskPct}
              onChange={(e) => setRiskPct(e.target.value)}
              className={inputCls}
            />
            <div className="mt-1 grid grid-cols-4 gap-1">
              {[0.5, 1, 2, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRiskPct(String(r))}
                  className={cn(
                    "rounded bg-[#1a2027] py-1 text-[10px] font-medium transition-colors hover:bg-[#2b3139]",
                    Number(riskPct) === r
                      ? "text-amber-400"
                      : "text-slate-400 hover:text-slate-200",
                  )}
                >
                  {r}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Leverage */}
        <div className="mb-1 flex items-center justify-between">
          <label className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
            Leverage
          </label>
          <span className="text-[11px] font-bold tabular-nums text-amber-400">
            {leverage}x
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={20}
          step={1}
          value={leverage}
          onChange={(e) => setLeverage(Number(e.target.value))}
          className="w-full accent-amber-400"
        />
        <div className="flex justify-between text-[9px] text-slate-600">
          <span>1x</span>
          <span>5x</span>
          <span>10x</span>
          <span>20x</span>
        </div>

        {!stopDirectionOk && (
          <p className="mt-3 rounded-md border border-red-500/20 bg-red-500/5 px-2.5 py-1.5 text-[10px] text-red-400">
            {side === "LONG"
              ? "SL harus LEBIH RENDAH dari entry untuk posisi Long."
              : "SL harus LEBIH TINGGI dari entry untuk posisi Short."}
          </p>
        )}
      </section>

      {/* ============ HASIL ============ */}
      <section className="lg:col-span-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300">Hasil</span>
          {result && (
            <span className="text-[10px] text-slate-500">
              Berdasarkan saldo {formatMoney(Number(balance))}
            </span>
          )}
        </div>

        {result ? (
          <div className="space-y-2">
            {/* Ukuran posisi */}
            <div className="rounded-md bg-[#0d1116] p-3">
              <div className="text-[10px] uppercase tracking-wide text-slate-500">
                Ukuran posisi (risiko {formatPercent(result.riskPctActual)} saldo)
              </div>
              <div className="text-xl font-bold tabular-nums text-amber-400">
                {fmtNum(result.lots)} lots
              </div>
              <div className="mt-0.5 text-[10px] text-slate-500">
                {fmtNum(result.units)} {base} · {formatMoney(result.notional)}{" "}
                notional
              </div>
            </div>

            <div className="rounded-md border border-[#2b3139] bg-[#0d1116] px-3 py-1">
              <Row label="Risiko (USD)" value={formatMoney(result.riskAmount)} />
              <Row label="Margin dibutuhkan" value={formatMoney(result.margin)} />
              <Row
                label="Nilai 1 pip/point"
                value={formatMoney(result.pipValueUsd)}
              />
              <Row
                label="Risk : Reward"
                value={
                  result.rr != null ? `1 : ${fmtNum(result.rr, 2)}` : "isi TP dulu"
                }
                valueClass={result.rr != null ? "text-amber-400" : "text-slate-500"}
              />
              <Row
                label="P&L @ TP"
                value={
                  result.pnlAtTarget != null
                    ? formatMoney(result.pnlAtTarget)
                    : "—"
                }
                valueClass={
                  result.pnlAtTarget != null ? pnlClass(result.pnlAtTarget) : undefined
                }
              />
              <Row
                label="P&L @ SL"
                value={formatMoney(result.pnlAtStop)}
                valueClass="text-red-400"
              />
              <Row
                label="Harga likuidasi"
                value={formatPrice(symbol, result.liqPrice)}
                valueClass="text-slate-400"
              />
            </div>

            {result.margin > Number(balance) && (
              <p className="rounded-md border border-amber-500/20 bg-amber-500/5 px-2.5 py-1.5 text-[10px] text-amber-400">
                Margin melebihi saldo — posisi akan ditolak engine paper trading.
              </p>
            )}
          </div>
        ) : (
          <div className="flex h-full min-h-[180px] items-center justify-center rounded-md border border-dashed border-[#2b3139] text-[11px] text-slate-600">
            {Number(balance) > 0 && entry !== "" && stop !== ""
              ? "Cek arah SL (lihat peringatan di kiri)"
              : "Lengkapi input: saldo, entry, dan stop loss"}
          </div>
        )}
      </section>

      {/* ============ RUMUS ============ */}
      <section className="lg:col-span-3">
        <span className="mb-2 block text-xs font-semibold text-slate-300">
          Rumus Perhitungan
        </span>
        <div className="space-y-1.5">
          {FORMULAS.map((f) => (
            <div
              key={f.name}
              className="rounded-md border border-[#232a33] bg-[#0d1116] px-2.5 py-2"
            >
              <div className="text-[9px] uppercase tracking-wide text-slate-500">
                {f.name}
              </div>
              <div className="font-mono text-[10px] text-slate-300">{f.formula}</div>
              {f.note && (
                <div className="mt-0.5 text-[9px] leading-relaxed text-slate-600">
                  {f.note}
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-[9px] leading-relaxed text-slate-600">
          XAU/USD adalah pasar OTC — konvensi lot &amp; pip mengikuti standar
          broker umum, bersifat indikatif. Semua hitungan berbasis harga pasar
          real; eksekusi order tetap simulasi (paper trading).
        </p>
      </section>
    </div>
  );
}
