import { NextRequest, NextResponse } from "next/server";
import { prisma } from "lib/prisma";

// =========================
// GET USERS WITHOUT EMPLOYEE
// =========================
// Digunakan untuk mengambil daftar user
// yang belum memiliki data employee.
//
// Tujuan:
// - Admin dapat memilih user saat membuat employee.
// - Mencegah 1 user memiliki lebih dari 1 employee.
// =========================
export async function GET() {
  try {
    // =========================
    // AMBIL DATA USER
    // =========================
    // Hanya mengambil user yang:
    // employee = null
    //
    // Artinya user tersebut belum terhubung
    // dengan tabel Employee.
    // =========================
    const users = await prisma.user.findMany({
      where: {
        employee: null,
      },

      // =========================
      // SELECT FIELD YANG DIBUTUHKAN
      // =========================
      // Tidak perlu mengirim password
      // atau data sensitif lainnya ke frontend.
      // =========================
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    // =========================
    // RESPONSE SUKSES
    // =========================
    // Mengirim daftar user yang
    // belum memiliki employee.
    // =========================
    return NextResponse.json(users);
  } catch (error) {
    console.log(error);

    // =========================
    // RESPONSE ERROR
    // =========================
    // Terjadi kesalahan saat mengambil data.
    // =========================
    return NextResponse.json(
      {
        message: "Failed get users",
      },
      {
        status: 500,
      },
    );
  }
}
