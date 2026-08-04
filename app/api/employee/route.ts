import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "../../../lib/prisma";
import { authOptions } from "lib/auth";
import { badRequest, notFound, unauthorized, serverError } from "../../../lib/http";
import { isNonEmptyString } from "../../../lib/validation";

const MANAGER_ROLES = ["ADMIN", "HR", "MANAGER"];

// Select user yang AMAN — password tidak pernah ikut terkirim.
const userSafeSelect = {
  select: { id: true, name: true, email: true, role: true },
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return unauthorized();
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "HR") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();

    const { name, position, departmentId, userId } = body;

    if (
      !isNonEmptyString(name) ||
      !isNonEmptyString(position) ||
      !isNonEmptyString(departmentId) ||
      !isNonEmptyString(userId)
    ) {
      return badRequest("Name, Position, Department dan User wajib diisi");
    }

    // Cek user benar-benar ada
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return notFound("User tidak ditemukan");
    }

    // Cek department tersedia
    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      return notFound("Department tidak ditemukan");
    }

    // Satu user hanya boleh punya satu employee
    const existingEmployee = await prisma.employee.findUnique({
      where: { userId },
    });

    if (existingEmployee) {
      return badRequest("User sudah memiliki employee");
    }

    const employee = await prisma.employee.create({
      data: {
        name: name.trim(),
        position: position.trim(),
        departmentId,
        userId,
      },
      include: {
        department: true,
        user: userSafeSelect,
      },
    });

    return NextResponse.json(
      { message: "Employee berhasil dibuat", data: employee },
      { status: 201 },
    );
  } catch (error) {
    return serverError(error);
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return unauthorized();
  }

  if (!MANAGER_ROLES.includes(session.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get("departmentId");

    const where = departmentId ? { departmentId } : {};

    const employees = await prisma.employee.findMany({
      where,
      include: {
        department: true,
        user: userSafeSelect,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(employees);
  } catch (error) {
    return serverError(error, "Failed get employees");
  }
}
