import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "../../../lib/prisma";
import { authOptions } from "lib/auth";
import { badRequest, notFound, unauthorized, serverError } from "../../../lib/http";
import { isNonEmptyString, isValidDateInput, parseDate } from "../../../lib/validation";

const LEAVE_TYPES = ["ANNUAL", "SICK", "PERSONAL"];

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return unauthorized();
    }

    // Cari data employee milik user yang login
    const employee = await prisma.employee.findUnique({
      where: { userId: session.user.id },
    });

    if (!employee) {
      return notFound("Employee data not found");
    }

    const body = await request.json();
    const { leaveType, startDate, endDate, reason } = body;

    // Validasi input
    if (!LEAVE_TYPES.includes(leaveType)) {
      return badRequest("leaveType tidak valid");
    }

    if (!isValidDateInput(startDate) || !isValidDateInput(endDate)) {
      return badRequest("Tanggal tidak valid");
    }

    if (!isNonEmptyString(reason)) {
      return badRequest("Reason wajib diisi");
    }

    const start = parseDate(startDate)!;
    const end = parseDate(endDate)!;

    if (end < start) {
      return badRequest("Tanggal selesai tidak boleh sebelum tanggal mulai");
    }

    // employeeId diambil otomatis dari user login — tidak bisa mengajukan
    // cuti atas nama karyawan lain.
    const leave = await prisma.leave.create({
      data: {
        leaveType,
        startDate: start,
        endDate: end,
        reason: reason.trim(),
        employeeId: employee.id,
      },
    });

    return NextResponse.json(
      { message: "Leave request created", data: leave },
      { status: 201 },
    );
  } catch (error) {
    return serverError(error);
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return unauthorized();
    }

    // ADMIN/HR/MANAGER melihat semua pengajuan
    if (
      session.user.role === "ADMIN" ||
      session.user.role === "HR" ||
      session.user.role === "MANAGER"
    ) {
      const leaves = await prisma.leave.findMany({
        include: {
          employee: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(leaves);
    }

    // EMPLOYEE hanya melihat pengajuan miliknya sendiri
    const employee = await prisma.employee.findUnique({
      where: { userId: session.user.id },
    });

    if (!employee) {
      return notFound("Employee not found");
    }

    const leaves = await prisma.leave.findMany({
      where: { employeeId: employee.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(leaves);
  } catch (error) {
    return serverError(error, "Server Error");
  }
}
