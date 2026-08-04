import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "lib/prisma";
import { authOptions } from "lib/auth";
import { unauthorized, serverError } from "../../../lib/http";

// GET USERS WITHOUT EMPLOYEE
// Digunakan untuk mengambil daftar user yang belum memiliki data employee
// (Admin/HR memilih user saat membuat employee).
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return unauthorized();
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "HR") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      where: { employee: null },
      // Hanya field yang dibutuhkan frontend — password tidak pernah dikirim.
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(users);
  } catch (error) {
    return serverError(error, "Failed get users");
  }
}
