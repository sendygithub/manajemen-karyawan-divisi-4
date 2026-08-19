// ============================================================
// SERVER HELPERS — helper bersama untuk route trading
// Port dari tradernext.vercel.app: better-auth → NextAuth v4,
// Drizzle → Prisma. Logika bisnis SAMA PERSIS dengan aslinya.
// ============================================================

import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { randomUUID } from "crypto";
import type { NextResponse } from "next/server";

export async function requireUser(): Promise<{ id: string } | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id ? { id: session.user.id } : null;
}

export function jsonError(message: string, status = 400): NextResponse {
  return Response.json({ error: message }, { status }) as NextResponse;
}

export async function getOrCreateAccount(userId: string) {
  return prisma.tradingAccount.upsert({
    where: { userId },
    update: {},
    create: { id: randomUUID(), userId, balance: 10000, currency: "USD" },
  });
}

export async function getOpenPositions(userId: string) {
  return prisma.tradingPosition.findMany({
    where: { userId, status: "OPEN" },
    orderBy: { openedAt: "desc" },
  });
}

export async function getPendingOrders(userId: string) {
  return prisma.tradingOrder.findMany({
    where: { userId, status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });
}

export type NewPositionInput = {
  userId: string;
  symbol: string;
  side: "LONG" | "SHORT";
  qty: number;
  entryPrice: number;
  leverage: number;
  slPrice?: number | null;
  tpPrice?: number | null;
};

/** Buka posisi + kunci margin. Return { position, error? } */
export async function openPosition(input: NewPositionInput) {
  const { userId, symbol, side, qty, entryPrice, leverage } = input;
  const account = await getOrCreateAccount(userId);
  const margin = (entryPrice * qty) / leverage;

  // Margin check terhadap free margin (balance + unrealized - used)
  const positions = await getOpenPositions(userId);
  const quote = await getLastPrices(positions);
  const unrealized = positions.reduce((sum, p) => {
    const mark = quote[p.symbol] ?? p.entryPrice;
    const pnl =
      p.side === "LONG"
        ? (mark - p.entryPrice) * p.qty
        : (p.entryPrice - mark) * p.qty;
    return sum + pnl;
  }, 0);
  const usedMargin = positions.reduce(
    (sum, p) => sum + (p.entryPrice * p.qty) / p.leverage,
    0,
  );
  const freeMargin = account.balance + unrealized - usedMargin;

  if (margin > freeMargin + 1e-9) {
    return {
      error: `Insufficient margin. Required ${formatUsd(margin)}, free ${formatUsd(
        Math.max(0, freeMargin),
      )}.`,
    };
  }

  const id = randomUUID();
  const position = await prisma.tradingPosition.create({
    data: {
      id,
      userId,
      symbol,
      side,
      qty,
      entryPrice,
      leverage,
      slPrice: input.slPrice ?? null,
      tpPrice: input.tpPrice ?? null,
      status: "OPEN",
    },
  });
  return { position };
}

/** Tutup posisi, hitung realized P/L, update saldo (atomik via transaction). */
export async function closePosition(
  userId: string,
  positionId: string,
  closePrice: number,
) {
  const position = await prisma.tradingPosition.findFirst({
    where: {
      id: positionId,
      userId,
      status: "OPEN",
    },
  });
  if (!position) return { error: "Position not found" };
  if (!Number.isFinite(closePrice) || closePrice <= 0) {
    return { error: "Invalid close price" };
  }

  const pnl =
    position.side === "LONG"
      ? (closePrice - position.entryPrice) * position.qty
      : (position.entryPrice - closePrice) * position.qty;

  const account = await getOrCreateAccount(userId);
  const newBalance = Math.max(0, account.balance + pnl);

  // Prisma + PostgreSQL mendukung transaction (berbeda dari neon-http
  // di proyek aslinya) — dua update dijalankan atomik.
  const [, updatedAccount] = await prisma.$transaction([
    prisma.tradingPosition.update({
      where: { id: positionId },
      data: {
        status: "CLOSED",
        closePrice,
        realizedPnl: pnl,
        closedAt: new Date(),
      },
    }),
    prisma.tradingAccount.update({
      where: { id: account.id },
      data: { balance: newBalance, updatedAt: new Date() },
    }),
  ]);

  return {
    position: {
      ...position,
      status: "CLOSED",
      closePrice,
      realizedPnl: pnl,
      closedAt: new Date(),
    },
    account: { ...account, balance: newBalance },
    // updatedAccount disertakan agar saldo segar dipakai caller bila perlu
    accountFresh: updatedAccount,
  };
}

export async function getLastPrices(
  positions: Array<{ symbol: string }>,
): Promise<Record<string, number>> {
  // Server-side fallback: harga pasar real (tanpa WebSocket client).
  const result: Record<string, number> = {};
  const symbols = Array.from(new Set(positions.map((p) => p.symbol)));
  for (const symbol of symbols) {
    const price = await fetchMarketPrice(symbol);
    if (price != null) result[symbol] = price;
  }
  return result;
}

async function fetchMarketPrice(symbol: string): Promise<number | null> {
  try {
    // Crypto/gold chart → Binance data-api (real, tanpa key)
    const binanceMap: Record<string, string> = {
      "BTC/USDT": "BTCUSDT",
      "ETH/USDT": "ETHUSDT",
      "XAU/USD": "PAXGUSDT",
    };
    const b = binanceMap[symbol];
    if (b) {
      const res = await fetch(
        `https://data-api.binance.vision/api/v3/ticker/price?symbol=${b}`,
        { cache: "no-store" },
      );
      if (res.ok) {
        const j = await res.json();
        const p = Number(j.price);
        if (Number.isFinite(p) && p > 0) return p;
      }
    }
    // Forex → Yahoo Finance
    const yahooMap: Record<string, string> = {
      "EUR/USD": "EURUSD=X",
      "GBP/USD": "GBPUSD=X",
      "USD/JPY": "JPY=X",
      "USD/CHF": "CHF=X",
      "AUD/USD": "AUDUSD=X",
      "USD/CAD": "CAD=X",
    };
    const y = yahooMap[symbol];
    if (y) {
      const res = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${y}?interval=1d&range=1d`,
        { cache: "no-store" },
      );
      if (res.ok) {
        const j = await res.json();
        const p = Number(j?.chart?.result?.[0]?.meta?.regularMarketPrice);
        if (Number.isFinite(p) && p > 0) return p;
      }
    }
    // Gold spot → gold-api
    if (symbol === "XAU/USD") {
      const res = await fetch("https://api.gold-api.com/price/XAU", {
        cache: "no-store",
      });
      if (res.ok) {
        const j = await res.json();
        const p = Number(j.price);
        if (Number.isFinite(p) && p > 0) return p;
      }
    }
  } catch {
    /* fallthrough */
  }
  return null;
}

function formatUsd(n: number): string {
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}
