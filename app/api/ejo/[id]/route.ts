import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../../lib/auth";
import { badRequest, unauthorized, serverError } from "../../../../lib/http";
import { updateEjoStatus } from "service/ejo.service";

const EJO_STATUSES = ["MENUNGGU_KONFIRMASI", "DIPROSES", "SELESAI"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return unauthorized();
    }

    // Hanya ADMIN/HR/MANAGER yang boleh mengubah status EJO
    if (!["ADMIN", "HR", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!EJO_STATUSES.includes(status)) {
      return badRequest("Status tidak valid");
    }

    const ejo = await updateEjoStatus(id, status);
    return NextResponse.json(ejo);
  } catch (error) {
    return serverError(error, "Failed to update ejo status");
  }
}
