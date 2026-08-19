import {
  requireUser,
  jsonError,
  getPendingOrders,
  openPosition,
  getOrCreateAccount,
} from "@/server/trading";
import { prisma } from "../../../../lib/prisma";
import { randomUUID } from "crypto";
import { isSupportedSymbol } from "@/lib/market/symbols";

export async function GET() {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const orders = await getPendingOrders(user.id);
  return Response.json({ orders });
}

const SIDES = ["LONG", "SHORT"] as const;
const TYPES = ["MARKET", "LIMIT", "STOP"] as const;

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }

  const symbol = String(body.symbol ?? "");
  const side = String(body.side ?? "").toUpperCase();
  const type = String(body.type ?? "").toUpperCase();
  const qty = Number(body.qty);
  const price = Number(body.price);
  const leverage = Math.round(Number(body.leverage ?? 1));
  const slPrice =
    body.slPrice == null || body.slPrice === "" ? null : Number(body.slPrice);
  const tpPrice =
    body.tpPrice == null || body.tpPrice === "" ? null : Number(body.tpPrice);

  if (!isSupportedSymbol(symbol)) return jsonError("Unsupported symbol");
  if (!SIDES.some((s) => s === side)) return jsonError("Invalid side");
  if (!TYPES.some((t) => t === type)) return jsonError("Invalid order type");
  if (!Number.isFinite(qty) || qty <= 0) return jsonError("Invalid quantity");
  if (!Number.isInteger(leverage) || leverage < 1 || leverage > 20) {
    return jsonError("Leverage must be between 1 and 20");
  }
  if (slPrice != null && (!Number.isFinite(slPrice) || slPrice <= 0)) {
    return jsonError("Invalid stop loss price");
  }
  if (tpPrice != null && (!Number.isFinite(tpPrice) || tpPrice <= 0)) {
    return jsonError("Invalid take profit price");
  }

  const sl = slPrice == null ? null : Number(slPrice.toFixed(6));
  const tp = tpPrice == null ? null : Number(tpPrice.toFixed(6));

  // MARKET → langsung buka posisi di harga pasar saat ini (dari client feed)
  if (type === "MARKET") {
    if (!Number.isFinite(price) || price <= 0) {
      return jsonError("Market price is required");
    }
    const result = await openPosition({
      userId: user.id,
      symbol,
      side: side as "LONG" | "SHORT",
      qty,
      entryPrice: price,
      leverage,
      slPrice: sl,
      tpPrice: tp,
    });
    if (result.error) return jsonError(result.error);
    const account = await getOrCreateAccount(user.id);
    return Response.json({
      position: result.position,
      account,
      message: "Position opened",
    });
  }

  // LIMIT / STOP → order pending, dipantau engine eksekusi
  if (!Number.isFinite(price) || price <= 0) {
    return jsonError("Limit/stop price is required");
  }
  const id = randomUUID();
  const order = await prisma.tradingOrder.create({
    data: {
      id,
      userId: user.id,
      symbol,
      side: side as "LONG" | "SHORT",
      type: type as "LIMIT" | "STOP",
      qty,
      price: Number(price.toFixed(6)),
      leverage,
      slPrice: sl,
      tpPrice: tp,
      status: "PENDING",
    },
  });
  return Response.json({ order, message: "Order placed" });
}
