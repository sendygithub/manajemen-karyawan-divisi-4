import { requireUser, jsonError } from "@/server/trading";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);

  const [closed, orders] = await Promise.all([
    prisma.tradingPosition.findMany({
      where: { userId: user.id, status: "CLOSED" },
      orderBy: { closedAt: "desc" },
      take: 50,
    }),
    prisma.tradingOrder.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  return Response.json({ closed, orders });
}
