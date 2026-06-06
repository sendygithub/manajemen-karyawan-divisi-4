import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    // 1. Ambil data dari body request
    const body = await request.json();
    const { name, jobdesk, plant } = body;

    // 2. Validasi input sederhana
    if (!name || !jobdesk || !plant) {
      return NextResponse.json(
        { message: "Semua field (name, jobdesk, plant) wajib diisi." },
        { status: 400 },
      );
    }

    // 3. Simpan data ke database menggunakan Prisma
    const newDepartment = await prisma.department.create({
      data: {
        name,
        jobdesk,
        plant,
      },
    });

    // 4. Kembalikan respons sukses
    return NextResponse.json(
      {
        message: "Department berhasil dibuat",
        data: newDepartment,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating department:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.log(error);

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
