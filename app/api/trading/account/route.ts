import { requireUser, jsonError, getOrCreateAccount } from "@/server/trading";

export async function GET() {
  const user = await requireUser();
  if (!user) return jsonError("Unauthorized", 401);
  const account = await getOrCreateAccount(user.id);
  return Response.json({ account });
}
