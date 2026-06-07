import { NextResponse } from "next/server";

import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    // 1. Ambil data dari body request front-end
    const body = await request.json();
    const { name, email, position, departmentId } = body;

    // 2. Validasi input dasar
    if (!name || !email || !position || !departmentId) {
      return NextResponse.json(
        {
          message:
            "Semua field wajib diisi (Name, Email, Position, Department).",
        },
        { status: 400 },
      );
    }

    // 3. Validasi apakah email karyawan sudah terdaftar (karena @unique di skema)
    const existingEmployee = await prisma.employee.findUnique({
      where: { email },
    });

    if (existingEmployee) {
      return NextResponse.json(
        { message: "Karyawan dengan email ini sudah terdaftar." },
        { status: 400 },
      );
    }

    // 4. Ambil atau tentukan userId untuk relasi User (Wajib berdasarkan skema kamu)
    // TODO: Ganti bagian ini dengan session user login asli jika auth sudah aktif
    const defaultUser = await prisma.user.findFirst();

    if (!defaultUser) {
      return NextResponse.json(
        { message: "Data master User tidak ditemukan untuk relasi akun." },
        { status: 500 },
      );
    }

    // 5. Simpan data Employee baru ke database
    const newEmployee = await prisma.employee.create({
      data: {
        name,
        email,
        position,
        departmentId, // Menghubungkan ID Departemen
        userId: defaultUser.id, // Menghubungkan ID User pengelola/pembuat
      },
      // Menginstruksikan Prisma untuk menyertakan data departemen dalam response
      include: {
        department: true,
      },
    });

    // 6. Kirim respons sukses
    return NextResponse.json(
      {
        message: "Karyawan berhasil ditambahkan",
        data: newEmployee,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating employee:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server.", error: error.message },
      { status: 500 },
    );
  }
}
