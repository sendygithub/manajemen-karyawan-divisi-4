import { requireUser, jsonError, getOpenPositions } from "@/server/trading";

export async function GET() {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const positions = await getOpenPositions(user.id);
  return Response.json({ positions });
}
