import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

// =========================
// CREATE DEPARTMENT
// Endpoint untuk membuat data department baru
// Method: POST
// =========================
export async function POST(request: Request) {
  try {
    // =========================
    // AMBIL DATA DARI REQUEST BODY
    // Data dikirim dari form frontend
    // =========================
    const body = await request.json();
    const { name, jobdesk, plant } = body;

    // =========================
    // VALIDASI INPUT
    // Mencegah data kosong tersimpan ke database
    // =========================
    if (!name || !jobdesk || !plant) {
      return NextResponse.json(
        {
          message: "Semua field (name, jobdesk, plant) wajib diisi.",
        },
        {
          status: 400,
        },
      );
    }

    // =========================
    // SIMPAN DATA DEPARTMENT
    // Prisma akan membuat record baru
    // pada tabel Department
    // =========================
    const newDepartment = await prisma.department.create({
      data: {
        name,
        jobdesk,
        plant,
      },
    });

    // =========================
    // RESPONSE BERHASIL
    // Mengembalikan data department
    // yang baru dibuat
    // =========================
    return NextResponse.json(
      {
        message: "Department berhasil dibuat",
        data: newDepartment,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error creating department:", error);

    // =========================
    // ERROR HANDLER
    // Menangani error yang terjadi
    // selama proses create department
    // =========================
    return NextResponse.json(
      {
        message: "Terjadi kesalahan pada server.",
      },
      {
        status: 500,
      },
    );
  }
}

// =========================
// GET ALL DEPARTMENTS
// Mengambil seluruh data department
// Method: GET
// =========================
export async function GET() {
  try {
    // =========================
    // AMBIL DATA DEPARTMENT
    // Diurutkan berdasarkan data terbaru
    // =========================
    const departments = await prisma.department.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: { employees: true },
        },
      },
    });

    // =========================
    // RESPONSE BERHASIL
    // Mengirim seluruh data department
    // ke frontend
    // =========================
    return NextResponse.json(departments);
  } catch (error) {
    console.log(error);

    // =========================
    // ERROR HANDLER
    // Menangani kegagalan query database
    // =========================
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
