import {
  requireUser,
  jsonError,
  openPosition,
  getOrCreateAccount,
} from "@/server/trading";
import { prisma } from "../../../../../lib/prisma";

/** Trigger order pending (limit/stop tersentuh) → buka posisi */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body");
  }
  const marketPrice = Number(body.price);
  if (!Number.isFinite(marketPrice) || marketPrice <= 0) {
    return jsonError("Invalid market price");
  }

  const order = await prisma.tradingOrder.findFirst({
    where: { id, userId: user.id, status: "PENDING" },
  });
  if (!order) return jsonError("Order not found or not pending", 404);

  const result = await openPosition({
    userId: user.id,
    symbol: order.symbol,
    side: order.side,
    qty: order.qty,
    entryPrice: marketPrice,
    leverage: order.leverage,
    slPrice: order.slPrice,
    tpPrice: order.tpPrice,
  });

  if (result.error) {
    // Margin tidak cukup → batal order
    await prisma.tradingOrder.update({
      where: { id },
      data: { status: "CANCELLED", updatedAt: new Date() },
    });
    return jsonError(`Order cancelled: ${result.error}`);
  }

  await prisma.tradingOrder.update({
    where: { id },
    data: {
      status: "TRIGGERED",
      triggeredPrice: marketPrice,
      filledAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const account = await getOrCreateAccount(user.id);
  return Response.json({
    position: result.position,
    account,
    message: "Order triggered",
  });
}

/** Batalkan order pending */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const { id } = await params;

  const order = await prisma.tradingOrder.findFirst({
    where: { id, userId: user.id, status: "PENDING" },
  });
  if (!order) return jsonError("Order not found or not pending", 404);

  await prisma.tradingOrder.update({
    where: { id },
    data: { status: "CANCELLED", updatedAt: new Date() },
  });

  return Response.json({ message: "Order cancelled" });
}
