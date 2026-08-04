import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "../../../lib/prisma";
import { authOptions } from "lib/auth";
import { badRequest, unauthorized, serverError } from "../../../lib/http";
import { isNonEmptyString } from "../../../lib/validation";

const STAFF_ROLES = ["ADMIN", "HR"];

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return unauthorized();
  }

  if (!STAFF_ROLES.includes(session.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, jobdesk, plant } = body;

    if (
      !isNonEmptyString(name) ||
      !isNonEmptyString(jobdesk) ||
      !isNonEmptyString(plant)
    ) {
      return badRequest("Semua field (name, jobdesk, plant) wajib diisi.");
    }

    const newDepartment = await prisma.department.create({
      data: {
        name: name.trim(),
        jobdesk: jobdesk.trim(),
        plant: plant.trim(),
      },
    });

    return NextResponse.json(
      { message: "Department berhasil dibuat", data: newDepartment },
      { status: 201 },
    );
  } catch (error) {
    return serverError(error, "Terjadi kesalahan pada server.");
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return unauthorized();
  }

  if (!["ADMIN", "HR", "MANAGER"].includes(session.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const departments = await prisma.department.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { employees: true } },
      },
    });

    return NextResponse.json(departments);
  } catch (error) {
    return serverError(error, "Internal server error");
  }
}
