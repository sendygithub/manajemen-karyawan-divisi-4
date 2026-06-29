import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, position, departmentId } = body;

    if (!name || !position || !departmentId) {
      return NextResponse.json(
        { message: "Name, Position, dan Department wajib diisi" },
        { status: 400 },
      );
    }

    const employee = await prisma.employee.update({
      where: { id },
      data: { name, position, departmentId },
      include: { department: true, user: true },
    });

    return NextResponse.json({
      message: "Employee berhasil diupdate",
      data: employee,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    await prisma.employee.delete({ where: { id } });

    return NextResponse.json({ message: "Employee berhasil dihapus" });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 },
    );
  }
}
