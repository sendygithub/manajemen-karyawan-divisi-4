"use client";

// ============================================================
// TRADING TERMINAL — layout utama halaman /trading
// ============================================================
// Layout profesional ala Binance/TradingView:
//   header → ticker tape → [watchlist | chart+depth | order]
//   → bottom tabs (posisi / order pending / history)
// ============================================================

import { useState } from "react";
import { LogOut, Radio, Wifi, WifiOff } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Timeframe } from "@/lib/market/types";
import { TradingProvider, useTrading } from "./trading-provider";
import { TickerTape } from "./ticker-tape";
import { Watchlist } from "./watchlist";
import { ChartPanel } from "./chart-panel";
import { MarketDepth } from "./market-depth";
import { OrderTicket } from "./order-ticket";
import { AccountSummary } from "./account-summary";
import { PositionsTable } from "./positions-table";
import { OrdersTable } from "./orders-table";
import { HistoryTable } from "./history-table";
import { TradingCalculator } from "./trading-calculator";
import { formatMoney } from "@/lib/trading/format";
import { cn } from "@/lib/utils";

function StatusDot({ label, on }: { label: string; on: boolean }) {
  return (
    <span className="flex items-center gap-1 text-[10px] text-slate-500">
      <span
        className={cn(
          "size-1.5 rounded-full",
          on ? "bg-emerald-500" : "bg-red-500",
        )}
      />
      {label}
    </span>
  );
}

function TerminalInner() {
  const router = useRouter();
  const [activeSymbol, setActiveSymbol] = useState("BTC/USDT");
  const [timeframe, setTimeframe] = useState<Timeframe>("5m");
  const [tab, setTab] = useState<
    "positions" | "orders" | "history" | "calculator"
  >("positions");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { status, account, positions, pendingOrders } = useTrading();

  const { data: session } = useSession();
  const user = session?.user;
  const equity =
    (account?.balance ?? 0) + positions.reduce((s, p) => s + p.pnl, 0);
  const anyFeed = status.binance || status.gold || status.yahoo;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: "/login" });
      toast.success("Logged out");
      router.push("/login");
    } catch {
      toast.error("Failed to logout");
      setIsLoggingOut(false);
    }
  };

  const tabCount = {
    positions: positions.length,
    orders: pendingOrders.length,
    history: 0,
    calculator: 0,
  };

  return (
    <div className="min-h-screen bg-[#0d1116] text-slate-200">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#232a33] bg-[#0d1116]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-3 py-2">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-md bg-amber-400/15">
              <Radio className="size-4 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-bold leading-tight text-slate-100">
                Sendy Trading{" "}
                <span className="font-normal text-slate-500">· Terminal</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot label="Binance" on={status.binance} />
                <StatusDot label="Gold" on={status.gold} />
                <StatusDot label="FX" on={status.yahoo} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-1.5 rounded-md bg-[#11151b] px-2.5 py-1.5 sm:flex">
              {anyFeed ? (
                <Wifi className="size-3.5 text-emerald-400" />
              ) : (
                <WifiOff className="size-3.5 text-red-400" />
              )}
              <span className="text-[11px] font-medium text-slate-300">
                {anyFeed ? "Live market data" : "Connecting..."}
              </span>
            </div>
            <div className="hidden text-right md:block">
              <div className="text-[9px] uppercase tracking-wide text-slate-500">
                Equity
              </div>
              <div
                className={cn(
                  "text-sm font-bold tabular-nums",
                  equity >= 10000 ? "text-emerald-400" : "text-red-400",
                )}
              >
                {formatMoney(equity)}
              </div>
            </div>
            <div className="hidden text-right sm:block">
              <div className="text-[9px] uppercase tracking-wide text-slate-500">
                User
              </div>
              <div className="max-w-[140px] truncate text-xs font-medium text-slate-300">
                {user?.name ?? user?.email ?? "—"}
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-1.5 rounded-md border border-[#2b3139] px-2.5 py-1.5 text-[11px] font-medium text-slate-400 transition-colors hover:border-red-500/40 hover:text-red-400 disabled:opacity-50"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">
                {isLoggingOut ? "..." : "Logout"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Ticker tape */}
      <TickerTape />

      {/* Main grid */}
      <main className="mx-auto max-w-[1600px] px-3 py-3">
        <div className="grid grid-cols-12 gap-3">
          {/* Watchlist */}
          <aside className="col-span-12 lg:col-span-2 xl:col-span-2">
            <Watchlist activeSymbol={activeSymbol} onSelect={setActiveSymbol} />
          </aside>

          {/* Chart + depth */}
          <section className="col-span-12 flex flex-col gap-3 lg:col-span-7 xl:col-span-7">
            <ChartPanel
              symbol={activeSymbol}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />
            <MarketDepth symbol={activeSymbol} />
          </section>

          {/* Order side */}
          <aside className="col-span-12 flex flex-col gap-3 lg:col-span-3 xl:col-span-3">
            <AccountSummary />
            <OrderTicket symbol={activeSymbol} />
          </aside>
        </div>

        {/* Bottom tables */}
        <div className="mt-3 overflow-hidden rounded-lg border border-[#232a33] bg-[#11151b]">
          <div className="flex gap-1 border-b border-[#232a33] px-2">
            {(
              [
                ["positions", `Positions (${tabCount.positions})`],
                ["orders", `Open Orders (${tabCount.orders})`],
                ["history", "History"],
                ["calculator", "Calculator"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={cn(
                  "border-b-2 px-3 py-2 text-[11px] font-semibold transition-colors",
                  tab === key
                    ? "border-amber-400 text-amber-400"
                    : "border-transparent text-slate-500 hover:text-slate-300",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="min-h-[140px] p-0">
            {tab === "positions" && <PositionsTable />}
            {tab === "orders" && <OrdersTable />}
            {tab === "history" && <HistoryTable />}
            {tab === "calculator" && <TradingCalculator />}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-4 pb-6 text-center text-[10px] leading-relaxed text-slate-600">
          Data pasar real: Binance (WebSocket) · gold-api.com · Yahoo Finance.
          Eksekusi order adalah simulasi (paper trading) — bukan transaksi
          keuangan nyata. Harga dapat tertunda. Trading berisiko tinggi.
        </footer>
      </main>
    </div>
  );
}

export function TradingTerminal() {
  return (
    <TradingProvider>
      <TerminalInner />
    </TradingProvider>
  );
}
