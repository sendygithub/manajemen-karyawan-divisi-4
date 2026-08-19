// ============================================================
// TIPE PAPER TRADING — bentuk row DB (dipakai UI + server)
// Port dari tradernext.vercel.app (dulu dari db/schema drizzle).
// Tanggal: `Date | string` karena JSON API mengirim ISO string.
// ============================================================

export type PositionSide = "LONG" | "SHORT";
export type PositionStatus = "OPEN" | "CLOSED";
export type OrderType = "MARKET" | "LIMIT" | "STOP";
export type OrderStatus = "PENDING" | "TRIGGERED" | "FILLED" | "CANCELLED";

export interface TradingAccount {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TradingPosition {
  id: string;
  userId: string;
  symbol: string;
  side: PositionSide;
  qty: number;
  entryPrice: number;
  leverage: number;
  slPrice: number | null;
  tpPrice: number | null;
  status: PositionStatus;
  openedAt: Date | string;
  closedAt: Date | string | null;
  closePrice: number | null;
  realizedPnl: number | null;
}

export interface TradingOrder {
  id: string;
  userId: string;
  symbol: string;
  side: PositionSide;
  type: OrderType;
  qty: number;
  price: number | null;
  leverage: number;
  slPrice: number | null;
  tpPrice: number | null;
  status: OrderStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  filledAt: Date | string | null;
  triggeredPrice: number | null;
}
