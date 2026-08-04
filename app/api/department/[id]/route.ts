import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "../../../../lib/prisma";
import { authOptions } from "lib/auth";
import { badRequest, unauthorized, serverError } from "../../../../lib/http";
import { isNonEmptyString } from "../../../../lib/validation";

const STAFF_ROLES = ["ADMIN", "HR"];

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return unauthorized();
  }

  if (!STAFF_ROLES.includes(session.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, jobdesk, plant } = body;

    if (
      !isNonEmptyString(name) ||
      !isNonEmptyString(jobdesk) ||
      !isNonEmptyString(plant)
    ) {
      return badRequest("Semua field (name, jobdesk, plant) wajib diisi.");
    }

    const updated = await prisma.department.update({
      where: { id },
      data: {
        name: name.trim(),
        jobdesk: jobdesk.trim(),
        plant: plant.trim(),
      },
    });

    return NextResponse.json({
      message: "Department berhasil diupdate",
      data: updated,
    });
  } catch (error) {
    return serverError(error, "Terjadi kesalahan pada server.");
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

  if (!STAFF_ROLES.includes(session.user.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;

    // Cegah hapus department yang masih punya karyawan
    const employeeCount = await prisma.employee.count({
      where: { departmentId: id },
    });

    if (employeeCount > 0) {
      return NextResponse.json(
        {
          message: `Tidak dapat menghapus department. Masih ada ${employeeCount} karyawan terdaftar.`,
        },
        { status: 400 },
      );
    }

    await prisma.department.delete({ where: { id } });

    return NextResponse.json({ message: "Department berhasil dihapus" });
  } catch (error) {
    return serverError(error, "Terjadi kesalahan pada server.");
  }
}
