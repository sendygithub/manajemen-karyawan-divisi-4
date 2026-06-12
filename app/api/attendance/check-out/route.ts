import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const employee = await prisma.employee.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!employee) {
      return NextResponse.json(
        {
          message: "Employee not found",
        },
        {
          status: 404,
        },
      );
    }

    const attendance = await prisma.attendance.findFirst({
      where: {
        employeeId: employee.id,
        checkOut: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!attendance) {
      return NextResponse.json(
        {
          message: "You have not checked in today",
        },
        {
          status: 400,
        },
      );
    }

    const updatedAttendance = await prisma.attendance.update({
      where: {
        id: attendance.id,
      },
      data: {
        checkOut: new Date(),
      },
    });

    return NextResponse.json({
      message: "Check Out Successful",
      data: updatedAttendance,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
