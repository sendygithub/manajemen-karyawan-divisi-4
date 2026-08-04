import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "lib/auth";
import { prisma } from "../../../../lib/prisma";
import { badRequest, notFound, unauthorized, serverError } from "../../../../lib/http";

export async function POST() {
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

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // Cegah check-in ganda di hari yang sama
    const existing = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: today,
      },
    });

    if (existing) {
      return badRequest("Already checked in today");
    }

    const attendance = await prisma.attendance.create({
      data: {
        employeeId: employee.id,
        date: today,
        checkIn: now,
      },
    });

    return NextResponse.json({
      message: "Check In Successful",
      data: attendance,
    });
  } catch (error) {
    return serverError(error, "Server Error");
  }
}
