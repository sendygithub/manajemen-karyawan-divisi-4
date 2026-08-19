"use client";

// ============================================================
// TRADING PROVIDER — state terpusat + execution engine
// ============================================================
// - Menjaga quote pasar (dari MarketEngine) tetap sinkron ke React
// - Memuat akun / posisi / order pending / history dari API
// - Execution engine: setiap quote baru masuk, cek SL/TP, likuidasi,
//   dan trigger order limit/stop. Semua keputusan berdasarkan DATA REAL.
// ============================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { marketEngine } from "@/lib/market/engine";
import type { FeedStatus, Quote } from "@/lib/market/types";
import type {
  TradingAccount,
  TradingOrder,
  TradingPosition,
} from "@/types/trading";
import { toast } from "sonner";

export interface PositionRow extends TradingPosition {
  markPrice: number;
  pnl: number;
  pnlPercent: number;
  margin: number;
  liqPrice: number | null;
}

export type OrderInput = {
  symbol: string;
  side: "LONG" | "SHORT";
  type: "MARKET" | "LIMIT" | "STOP";
  qty: number;
  price?: number;
  leverage: number;
  slPrice?: number | null;
  tpPrice?: number | null;
};

interface TradingContextValue {
  quotes: Record<string, Quote>;
  status: FeedStatus;
  account: TradingAccount | null;
  positions: PositionRow[];
  pendingOrders: TradingOrder[];
  history: { closed: TradingPosition[]; orders: TradingOrder[] } | null;
  busy: boolean;
  refresh: () => Promise<void>;
  placeOrder: (input: OrderInput) => Promise<{ ok: boolean; message?: string }>;
  closePosition: (
    id: string,
    price: number,
  ) => Promise<{ ok: boolean; message?: string }>;
  cancelOrder: (id: string) => Promise<{ ok: boolean; message?: string }>;
}

const TradingContext = createContext<TradingContextValue | null>(null);

export function useTrading(): TradingContextValue {
  const ctx = useContext(TradingContext);
  if (!ctx) throw new Error("useTrading must be used within TradingProvider");
  return ctx;
}

const CHECK_THROTTLE_MS = 800;

function enrichPosition(p: TradingPosition, quote?: Quote): PositionRow {
  const markPrice = quote?.price && quote.price > 0 ? quote.price : p.entryPrice;
  const pnl =
    p.side === "LONG"
      ? (markPrice - p.entryPrice) * p.qty
      : (p.entryPrice - markPrice) * p.qty;
  const margin = (p.entryPrice * p.qty) / p.leverage;
  const pnlPercent = margin > 0 ? (pnl / margin) * 100 : 0;
  const liqPrice =
    p.side === "LONG"
      ? p.entryPrice * (1 - 0.9 / p.leverage)
      : p.entryPrice * (1 + 0.9 / p.leverage);
  return { ...p, markPrice, pnl, pnlPercent, margin, liqPrice };
}

export function TradingProvider({ children }: { children: React.ReactNode }) {
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [status, setStatus] = useState<FeedStatus>({
    binance: false,
    gold: false,
    yahoo: false,
  });
  const [account, setAccount] = useState<TradingAccount | null>(null);
  const [positions, setPositions] = useState<TradingPosition[]>([]);
  const [pendingOrders, setPendingOrders] = useState<TradingOrder[]>([]);
  const [history, setHistory] = useState<{
    closed: TradingPosition[];
    orders: TradingOrder[];
  } | null>(null);
  const [busy, setBusy] = useState(false);

  const positionsRef = useRef<TradingPosition[]>([]);
  const ordersRef = useRef<TradingOrder[]>([]);
  const quotesRef = useRef<Record<string, Quote>>({});
  const lastCheckRef = useRef<Record<string, number>>({});
  const closingRef = useRef<Set<string>>(new Set());
  const triggeringRef = useRef<Set<string>>(new Set());

  const refresh = useCallback(async () => {
    try {
      const [accRes, posRes, ordRes, histRes] = await Promise.all([
        fetch("/api/trading/account", { cache: "no-store" }),
        fetch("/api/trading/positions", { cache: "no-store" }),
        fetch("/api/trading/orders", { cache: "no-store" }),
        fetch("/api/trading/history", { cache: "no-store" }),
      ]);
      if (!accRes.ok) return;
      const [accData, posData, ordData, histData] = await Promise.all([
        accRes.json(),
        posRes.json(),
        ordRes.json(),
        histRes.json(),
      ]);
      setAccount(accData.account);
      setPositions(posData.positions ?? []);
      setPendingOrders(ordData.orders ?? []);
      setHistory(histData);
    } catch (err) {
      console.error("[trading] refresh failed:", err);
    }
  }, []);

  // sinkronkan refs
  useEffect(() => {
    positionsRef.current = positions;
  }, [positions]);
  useEffect(() => {
    ordersRef.current = pendingOrders;
  }, [pendingOrders]);
  useEffect(() => {
    quotesRef.current = quotes;
  }, [quotes]);

  // init
  useEffect(() => {
    marketEngine.start();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- pola load-data-on-mount standar
    void refresh();
    const interval = setInterval(() => void refresh(), 30_000);
    return () => clearInterval(interval);
  }, [refresh]);

  const placeOrder = useCallback(
    async (input: OrderInput) => {
      setBusy(true);
      try {
        const res = await fetch("/api/trading/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          return { ok: false, message: data.error ?? "Failed to place order" };
        }
        await refresh();
        return { ok: true, message: data.message ?? "Order placed" };
      } catch (err) {
        console.error("[trading] placeOrder:", err);
        return { ok: false, message: "Network error" };
      } finally {
        setBusy(false);
      }
    },
    [refresh],
  );

  const closePosition = useCallback(
    async (id: string, price: number) => {
      try {
        const res = await fetch(`/api/trading/positions/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) return { ok: false, message: data.error ?? "Close failed" };
        await refresh();
        return { ok: true, message: data.message ?? "Closed" };
      } catch {
        return { ok: false, message: "Network error" };
      }
    },
    [refresh],
  );

  const cancelOrder = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/trading/orders/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) return { ok: false, message: "Cancel failed" };
        await refresh();
        return { ok: true, message: "Cancelled" };
      } catch {
        return { ok: false, message: "Network error" };
      }
    },
    [refresh],
  );

  const triggerOrder = useCallback(
    async (id: string, price: number) => {
      try {
        const res = await fetch(`/api/trading/orders/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ price }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          toast.error(data.error ?? "Trigger failed");
          return { ok: false, message: data.error ?? "Trigger failed" };
        }
        await refresh();
        return { ok: true, message: data.message ?? "Triggered" };
      } catch {
        return { ok: false, message: "Network error" };
      }
    },
    [refresh],
  );

  // execution engine — reaksi terhadap setiap quote baru.
  // Ditempatkan SETELAH deklarasi closePosition/triggerOrder karena
  // runChecks memanggil keduanya (React Compiler butuh deklarasi dulu).
  // Perilaku identik dengan posisi aslinya di tradernext.
  useEffect(() => {
    const runChecks = async (quote: Quote) => {
      const price = quote.price;
      if (!price || price <= 0) return;

      // --- posisi: SL / TP / likuidasi ---
      for (const p of positionsRef.current) {
        if (p.symbol !== quote.symbol) continue;
        if (closingRef.current.has(p.id)) continue;
        const margin = (p.entryPrice * p.qty) / p.leverage;
        const pnl =
          p.side === "LONG"
            ? (price - p.entryPrice) * p.qty
            : (p.entryPrice - price) * p.qty;
        let reason: string | null = null;
        if (p.side === "LONG") {
          if (p.slPrice != null && price <= p.slPrice) reason = "SL";
          else if (p.tpPrice != null && price >= p.tpPrice) reason = "TP";
        } else {
          if (p.slPrice != null && price >= p.slPrice) reason = "SL";
          else if (p.tpPrice != null && price <= p.tpPrice) reason = "TP";
        }
        if (!reason && margin > 0 && pnl <= -margin * 0.9) reason = "LIQ";

        if (reason) {
          closingRef.current.add(p.id);
          const res = await closePosition(p.id, price);
          if (!res.ok) closingRef.current.delete(p.id);
        }
      }

      // --- order pending: limit / stop ---
      for (const o of ordersRef.current) {
        if (o.symbol !== quote.symbol) continue;
        if (triggeringRef.current.has(o.id)) continue;
        if (o.price == null) continue;
        let hit = false;
        if (o.type === "LIMIT") {
          hit = o.side === "LONG" ? price <= o.price : price >= o.price;
        } else if (o.type === "STOP") {
          hit = o.side === "LONG" ? price >= o.price : price <= o.price;
        }
        if (!hit) continue;
        triggeringRef.current.add(o.id);
        const res = await triggerOrder(o.id, price);
        if (!res.ok) triggeringRef.current.delete(o.id);
      }
    };

    const unsub = marketEngine.subscribe((e) => {
      if (e.type === "quote") {
        setQuotes((prev) => ({ ...prev, [e.quote.symbol]: e.quote }));
        const now = Date.now();
        if (now - (lastCheckRef.current[e.quote.symbol] ?? 0) < CHECK_THROTTLE_MS) {
          return;
        }
        lastCheckRef.current[e.quote.symbol] = now;
        void runChecks(e.quote);
      } else if (e.type === "status") {
        setStatus(e.status);
      }
    });

    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const value = useMemo<TradingContextValue>(() => {
    const enriched = positions
      .map((p) => enrichPosition(p, quotes[p.symbol]))
      .sort(
        (a, b) =>
          new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime(),
      );
    return {
      quotes,
      status,
      account,
      positions: enriched,
      pendingOrders,
      history,
      busy,
      refresh,
      placeOrder,
      closePosition,
      cancelOrder,
    };
  }, [
    quotes,
    status,
    account,
    positions,
    pendingOrders,
    history,
    busy,
    refresh,
    placeOrder,
    closePosition,
    cancelOrder,
  ]);

  return (
    <TradingContext.Provider value={value}>{children}</TradingContext.Provider>
  );
}
