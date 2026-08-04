import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "lib/auth";
import { prisma } from "../../../../lib/prisma";
import { notFound, unauthorized, serverError } from "../../../../lib/http";

// GET data absensi milik user yang sedang login.
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return unauthorized();
    }

    const employee = await prisma.employee.findUnique({
      where: { userId: session.user.id },
    });

    if (!employee) {
      return notFound("Employee not found");
    }

    const attendance = await prisma.attendance.findMany({
      where: { employeeId: employee.id },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    return serverError(error, "Server Error");
  }
}
