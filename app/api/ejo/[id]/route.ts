import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { updateEjoStatus } from "service/ejo.service";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 },
      );
    }

    const ejo = await updateEjoStatus(id, status);
    return NextResponse.json(ejo);
  } catch (error) {
    console.error("Error updating ejo status:", error);
    return NextResponse.json(
      { error: "Failed to update ejo status" },
      { status: 500 },
    );
  }
}
