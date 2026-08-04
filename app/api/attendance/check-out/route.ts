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

    // Check-out hanya untuk catatan hari ini yang masih terbuka —
    // tidak boleh menutup catatan hari kemarin yang lupa di-check-out.
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const attendance = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        date: today,
        checkOut: null,
      },
    });

    if (!attendance) {
      return badRequest("You have not checked in today");
    }

    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendance.id },
      data: { checkOut: now },
    });

    return NextResponse.json({
      message: "Check Out Successful",
      data: updatedAttendance,
    });
  } catch (error) {
    return serverError(error, "Server Error");
  }
}
