import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "../../../lib/prisma";
import { authOptions } from "lib/auth";
import { unauthorized, serverError } from "../../../lib/http";

// GET semua data absensi — khusus ADMIN/HR/MANAGER.
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return unauthorized();
  }

  if (!["ADMIN", "HR", "MANAGER"].includes(session.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const attendance = await prisma.attendance.findMany({
      include: {
        employee: {
          select: { name: true, position: true },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    return serverError(error, "Server Error");
  }
}
