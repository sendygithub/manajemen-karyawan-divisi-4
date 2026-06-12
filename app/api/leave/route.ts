// =========================
// IMPORT DEPENDENCIES
// =========================

// NextResponse digunakan untuk mengirim response API
import { NextResponse } from "next/server";

// Prisma Client untuk akses database
import { prisma } from "../../../lib/prisma";

// Mengambil session user yang sedang login
import { getServerSession } from "next-auth";

// Konfigurasi NextAuth
import { authOptions } from "lib/auth";

// =========================
// CREATE LEAVE REQUEST
// POST /api/leave
// =========================

export async function POST(request: Request) {
  try {
    // =========================
    // 1. CEK SESSION LOGIN
    // =========================
    // Mengambil data user yang sedang login
    const session = await getServerSession(authOptions);

    console.log("SESSION:", session);

    // Jika user belum login maka request ditolak
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

    // =========================
    // 2. CARI DATA EMPLOYEE
    // =========================
    // Mencari employee berdasarkan user yang login
    const employee = await prisma.employee.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    // Jika employee tidak ditemukan
    // berarti user belum terhubung ke data employee
    if (!employee) {
      return NextResponse.json(
        {
          message: "Employee data not found",
        },
        {
          status: 404,
        },
      );
    }

    // =========================
    // 3. AMBIL DATA REQUEST
    // =========================
    const body = await request.json();

    const { leaveType, startDate, endDate, reason } = body;

    // =========================
    // 4. VALIDASI INPUT
    // =========================
    // Semua field wajib diisi sebelum data disimpan
    if (!leaveType || !startDate || !endDate || !reason) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        {
          status: 400,
        },
      );
    }

    // =========================
    // 5. SIMPAN DATA CUTI
    // =========================
    // EmployeeId diambil otomatis dari user login
    // sehingga employee tidak bisa mengajukan cuti
    // atas nama employee lain
    const leave = await prisma.leave.create({
      data: {
        leaveType,

        startDate: new Date(startDate),

        endDate: new Date(endDate),

        reason,

        employeeId: employee.id,
      },
    });

    // =========================
    // 6. RESPONSE BERHASIL
    // =========================
    return NextResponse.json(
      {
        message: "Leave request created",
        data: leave,
      },
      {
        status: 201,
      },
    );
  } catch (error: any) {
    // =========================
    // ERROR HANDLING
    // =========================
    console.log(error);

    return NextResponse.json(
      {
        message: "Internal Server Error",

        error: error.message,

        prisma_code: error.code,
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const employee = await prisma.employee.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 },
      );
    }

    const leaves = await prisma.leave.findMany({
      where: {
        employeeId: employee.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(leaves);
  } catch (error) {
    console.log(error);

    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
