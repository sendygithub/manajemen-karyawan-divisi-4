import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "lib/auth";

export async function PUT(req: Request) {
  try {
    // =========================
    // 1. CEK SESSION LOGIN
    // =========================
    // Mengambil data user yang sedang login
    // dari NextAuth Session
    const session = await getServerSession(authOptions);

    // Jika user belum login maka request ditolak
    if (!session?.user?.email) {
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
    // 2. AMBIL DATA FORM DARI REQUEST
    // =========================
    // Data dikirim dari halaman Profile Employee
    const body = await req.json();

    // =========================
    // 3. CARI DATA EMPLOYEE BERDASARKAN USER LOGIN
    // =========================
    // Karena Employee terhubung ke User,
    // maka kita mencari employee berdasarkan
    // email user yang sedang login
    const employee = await prisma.employee.findFirst({
      where: {
        user: {
          email: session.user.email,
        },
      },
    });

    // Jika data employee tidak ditemukan
    if (!employee) {
      return NextResponse.json(
        {
          message: "Employee not found",
        },
        {
          status: 404,
        },
      );
    }

    // =========================
    // 4. UPDATE DATA EMPLOYEE
    // =========================
    // Memperbarui data profile employee
    // sesuai input dari form profile
    const updated = await prisma.employee.update({
      where: {
        id: employee.id,
      },
      data: {
        name: body.name,
        position: body.position,

        phone: body.phone,
        gender: body.gender,

        address: body.address,

        birthDate: body.birthDate ? new Date(body.birthDate) : null,

        joinDate: body.joinDate ? new Date(body.joinDate) : null,

        emergencyContact: body.emergencyContact,
        emergencyPhone: body.emergencyPhone,

        bankName: body.bankName,
        bankAccount: body.bankAccount,
      },
    });

    // =========================
    // 5. KIRIM RESPONSE BERHASIL
    // =========================
    // Mengembalikan data employee yang
    // sudah berhasil diperbarui
    return NextResponse.json({
      message: "Profile updated successfully",
      data: updated,
    });
  } catch (error) {
    // =========================
    // 6. HANDLE ERROR SERVER
    // =========================
    // Menangkap error yang terjadi selama
    // proses update profile
    console.log(error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
