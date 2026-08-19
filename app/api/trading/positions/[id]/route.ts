import { requireUser, jsonError, closePosition } from "@/server/trading";

/** Tutup posisi di harga pasar saat ini (dari client feed) */
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
  const price = Number(body.price);
  if (!Number.isFinite(price) || price <= 0) {
    return jsonError("Invalid close price");
  }

  const result = await closePosition(user.id, id, price);
  if (result.error) return jsonError(result.error, 404);
  return Response.json({
    position: result.position,
    account: result.account,
    message: "Position closed",
  });
}
