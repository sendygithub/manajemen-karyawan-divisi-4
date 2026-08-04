import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "../../../../lib/prisma";
import { authOptions } from "lib/auth";
import { badRequest, notFound, unauthorized, serverError } from "../../../../lib/http";
import { isNonEmptyString } from "../../../../lib/validation";

const userSafeSelect = {
  select: { id: true, name: true, email: true, role: true },
};

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return unauthorized();
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "HR") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, position, departmentId } = body;

    if (
      !isNonEmptyString(name) ||
      !isNonEmptyString(position) ||
      !isNonEmptyString(departmentId)
    ) {
      return badRequest("Name, Position, dan Department wajib diisi");
    }

    const department = await prisma.department.findUnique({
      where: { id: departmentId },
    });

    if (!department) {
      return notFound("Department tidak ditemukan");
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: { name: name.trim(), position: position.trim(), departmentId },
      include: { department: true, user: userSafeSelect },
    });

    return NextResponse.json({
      message: "Employee berhasil diupdate",
      data: employee,
    });
  } catch (error) {
    return serverError(error);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return unauthorized();
  }

  if (session.user.role !== "ADMIN" && session.user.role !== "HR") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;

    await prisma.employee.delete({ where: { id } });

    return NextResponse.json({ message: "Employee berhasil dihapus" });
  } catch (error) {
    return serverError(error);
  }
}
