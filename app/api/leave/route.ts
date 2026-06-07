import { NextResponse } from "next/server";

import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { leaveType, startDate, endDate, reason, employeeId } = body;

    // VALIDATION
    if (!leaveType || !startDate || !endDate || !reason || !employeeId) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        {
          status: 400,
        },
      );
    }

    // CREATE LEAVE
    const leave = await prisma.leave.create({
      data: {
        leaveType,

        startDate: new Date(startDate),

        endDate: new Date(endDate),

        reason,

        employeeId,
      },
    });

    return NextResponse.json(
      {
        message: "Leave request created",

        data: leave,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET() {
  try {
    const leaves = await prisma.leave.findMany({
      include: {
        employee: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(leaves);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
