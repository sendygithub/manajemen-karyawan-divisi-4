"use client";

// ============================================================
// ORDER TICKET — form order profesional (market/limit/stop)
// ============================================================
// - Buy (LONG) / Sell (SHORT) dengan leverage 1–20x
// - Tipe: Market / Limit / Stop
// - SL & TP opsional (dipantau execution engine via harga real)
// - Estimasi margin + notional dihitung live dari harga pasar
// ============================================================

import { useEffect, useMemo, useState } from "react";
import { getConfig } from "@/lib/market/symbols";
import { useTrading } from "./trading-provider";
import { formatMoney, formatPrice } from "@/lib/trading/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Side = "LONG" | "SHORT";
type OrderType = "MARKET" | "LIMIT" | "STOP";

interface Props {
  symbol: string;
}

export function OrderTicket({ symbol }: Props) {
  const { quotes, account, positions, busy, placeOrder } = useTrading();
  const cfg = getConfig(symbol);

  const [side, setSide] = useState<Side>("LONG");
  const [type, setType] = useState<OrderType>("MARKET");
  const [notional, setNotional] = useState("1000");
  const [limitPrice, setLimitPrice] = useState("");
  const [leverage, setLeverage] = useState(5);
  const [slPrice, setSlPrice] = useState("");
  const [tpPrice, setTpPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const quote = quotes[symbol];
  const price = quote?.price ?? 0;

  // default harga limit/stop mengikuti harga pasar
  useEffect(() => {
    if (price <= 0) return;
    const d = cfg?.decimals ?? 2;
    const base =
      type === "LIMIT"
        ? price * (side === "LONG" ? 0.998 : 1.002)
        : price * (side === "LONG" ? 1.002 : 0.998);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill harga limit/stop dari market, disengaja
    setLimitPrice(base.toFixed(d));
  }, [price, side, type, cfg?.decimals]);

  const qty = useMemo(() => {
    const n = Number(notional);
    return price > 0 && Number.isFinite(n) && n > 0 ? n / price : 0;
  }, [notional, price]);

  const margin = useMemo(() => (price > 0 ? (price * qty) / leverage : 0), [price, qty, leverage]);

  // free margin = equity - used margin
  const { freeMargin } = useMemo(() => {
    const balance = account?.balance ?? 10000;
    const used = positions.reduce((s, p) => s + p.margin, 0);
    const unreal = positions.reduce((s, p) => s + p.pnl, 0);
    return { equity: balance + unreal, usedMargin: used, freeMargin: balance + unreal - used };
  }, [account, positions]);

  const entryPrice =
    type === "MARKET" ? price : Number(limitPrice) || 0;

  const quickAmounts = [0.25, 0.5, 0.75, 1].map((f) => Math.max(0, freeMargin * leverage * f));

  const submit = async () => {
    const n = Number(notional);
    if (!Number.isFinite(n) || n <= 0) {
      toast.error("Masukkan jumlah (USD) yang valid");
      return;
    }
    if (type !== "MARKET" && (!Number.isFinite(entryPrice) || entryPrice <= 0)) {
      toast.error("Harga limit/stop tidak valid");
      return;
    }
    if (qty <= 0) {
      toast.error("Harga pasar belum tersedia");
      return;
    }
    const sl = slPrice ? Number(slPrice) : null;
    const tp = tpPrice ? Number(tpPrice) : null;
    if (sl != null && (sl <= 0 || (side === "LONG" ? sl >= entryPrice : sl <= entryPrice))) {
      toast.error("SL harus di bawah harga entry (LONG) / di atas (SHORT)");
      return;
    }
    if (tp != null && (tp <= 0 || (side === "LONG" ? tp <= entryPrice : tp >= entryPrice))) {
      toast.error("TP harus di atas harga entry (LONG) / di bawah (SHORT)");
      return;
    }

    setSubmitting(true);
    const res = await placeOrder({
      symbol,
      side,
      type,
      qty: Number(qty.toFixed(8)),
      price: type === "MARKET" ? price : entryPrice,
      leverage,
      slPrice: sl,
      tpPrice: tp,
    });
    setSubmitting(false);
    if (res.ok) {
      toast.success(
        type === "MARKET"
          ? `${side === "LONG" ? "Long" : "Short"} ${symbol} dibuka @ ${formatPrice(symbol, price)}`
          : `${type} ${side} ${symbol} terpasang @ ${formatPrice(symbol, entryPrice)}`,
      );
    } else {
      toast.error(res.message ?? "Order gagal");
    }
  };

  const disabled = submitting || busy || !price || price <= 0;

  return (
    <div className="rounded-lg border border-[#232a33] bg-[#11151b] p-3">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300">Order</span>
        <span className="text-[10px] text-slate-500">{symbol}</span>
      </div>

      {/* Side toggle */}
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

      {/* Order type */}
      <div className="mb-3 grid grid-cols-3 gap-1 rounded-md bg-[#1a2027] p-0.5">
        {(["MARKET", "LIMIT", "STOP"] as OrderType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={cn(
              "rounded py-1.5 text-[11px] font-medium transition-colors",
              type === t ? "bg-[#2b3139] text-slate-100" : "text-slate-500 hover:text-slate-300",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Amount */}
      <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-500">
        Amount (USD)
      </label>
      <input
        type="number"
        min={1}
        value={notional}
        onChange={(e) => setNotional(e.target.value)}
        className="mb-1.5 w-full rounded-md border border-[#2b3139] bg-[#0d1116] px-2.5 py-2 text-sm tabular-nums text-slate-200 outline-none focus:border-amber-400/60"
      />
      <div className="mb-3 grid grid-cols-4 gap-1">
        {quickAmounts.map((amt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setNotional(amt > 0 ? amt.toFixed(0) : "0")}
            className="rounded bg-[#1a2027] py-1 text-[10px] font-medium text-slate-400 transition-colors hover:bg-[#2b3139] hover:text-slate-200"
          >
            {i === 3 ? "Max" : `${(i + 1) * 25}%`}
          </button>
        ))}
      </div>

      {/* Limit/stop price */}
      {type !== "MARKET" && (
        <div className="mb-3">
          <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-500">
            {type === "LIMIT" ? "Limit price" : "Stop price"}
          </label>
          <input
            type="number"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            className="w-full rounded-md border border-[#2b3139] bg-[#0d1116] px-2.5 py-2 text-sm tabular-nums text-slate-200 outline-none focus:border-amber-400/60"
          />
        </div>
      )}

      {/* Leverage */}
      <div className="mb-3">
        <div className="mb-1 flex items-center justify-between">
          <label className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
            Leverage
          </label>
          <span className="text-[11px] font-bold tabular-nums text-amber-400">{leverage}x</span>
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
      </div>

      {/* SL / TP */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-500">
            SL (opsional)
          </label>
          <input
            type="number"
            value={slPrice}
            onChange={(e) => setSlPrice(e.target.value)}
            placeholder="—"
            className="w-full rounded-md border border-[#2b3139] bg-[#0d1116] px-2 py-1.5 text-xs tabular-nums text-slate-200 outline-none focus:border-red-400/60"
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-slate-500">
            TP (opsional)
          </label>
          <input
            type="number"
            value={tpPrice}
            onChange={(e) => setTpPrice(e.target.value)}
            placeholder="—"
            className="w-full rounded-md border border-[#2b3139] bg-[#0d1116] px-2 py-1.5 text-xs tabular-nums text-slate-200 outline-none focus:border-emerald-400/60"
          />
        </div>
      </div>

      {/* Order summary */}
      <div className="mb-3 space-y-1 rounded-md bg-[#0d1116] p-2.5 text-[11px]">
        <div className="flex justify-between">
          <span className="text-slate-500">Qty ({cfg?.symbol.split("/")[0]})</span>
          <span className="tabular-nums text-slate-300">{qty ? qty.toLocaleString("en-US", { maximumFractionDigits: 6 }) : "—"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Est. margin</span>
          <span className="tabular-nums text-slate-300">{formatMoney(margin)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Free margin</span>
          <span className={cn("tabular-nums", freeMargin < 0 ? "text-red-400" : "text-slate-300")}>
            {formatMoney(freeMargin)}
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={() => void submit()}
        disabled={disabled}
        className={cn(
          "w-full rounded-md py-2.5 text-sm font-bold uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          side === "LONG"
            ? "bg-emerald-500 text-emerald-950 hover:bg-emerald-400"
            : "bg-red-500 text-red-950 hover:bg-red-400",
        )}
      >
        {submitting
          ? "Processing..."
          : `${side === "LONG" ? "Buy / Long" : "Sell / Short"} ${symbol}`}
      </button>
      <p className="mt-2 text-center text-[10px] leading-relaxed text-slate-600">
        Paper trading · eksekusi simulasi, harga pasar real.
      </p>
    </div>
  );
}
