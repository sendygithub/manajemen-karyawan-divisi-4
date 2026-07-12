import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { createLaporan, getLaporans } from "service/laporan.service";

export async function GET() {
  try {
    const laporans = await getLaporans();
    return NextResponse.json(laporans);
  } catch (error) {
    console.error("Error fetching laporans:", error);
    return NextResponse.json(
      { error: "Failed to fetch laporans" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the employee record associated with this user
    const employee = await prisma.employee.findUnique({
      where: { userId: session.user.id },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee record not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const laporan = await createLaporan({
      ...body,
      employeeId: employee.id,
    });
    return NextResponse.json(laporan, { status: 201 });
  } catch (error) {
    console.error("Error creating laporan:", error);
    return NextResponse.json(
      { error: "Failed to create laporan" },
      { status: 500 },
    );
  }
}
