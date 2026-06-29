import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

// =========================
// UPDATE DEPARTMENT
// PUT /api/department/[id]
// =========================
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, jobdesk, plant } = body;

    if (!name || !jobdesk || !plant) {
      return NextResponse.json(
        { message: "Semua field (name, jobdesk, plant) wajib diisi." },
        { status: 400 },
      );
    }

    const updated = await prisma.department.update({
      where: { id },
      data: { name, jobdesk, plant },
    });

    return NextResponse.json({
      message: "Department berhasil diupdate",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating department:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 },
    );
  }
}

// =========================
// DELETE DEPARTMENT
// DELETE /api/department/[id]
// =========================
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Check if department has employees
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

    await prisma.department.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Department berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting department:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 },
    );
  }
}
