import { NextResponse } from "next/server";

import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    // =========================
    // MENGAMBIL DATA DARI REQUEST BODY
    // Data dikirim dari form Add Employee
    // =========================
    const body = await request.json();

    const { name, position, departmentId, userId } = body;

    // =========================
    // VALIDASI INPUT
    // Semua field wajib diisi karena
    // Employee harus terhubung ke User
    // dan Department
    // =========================
    if (!name || !position || !departmentId || !userId) {
      return NextResponse.json(
        {
          message: "Name, Position, Department dan User wajib diisi",
        },
        {
          status: 400,
        },
      );
    }

    // =========================
    // CEK USER
    // Memastikan user yang dipilih
    // benar-benar ada di database
    // =========================
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "User tidak ditemukan",
        },
        {
          status: 404,
        },
      );
    }

    // =========================
    // CEK DEPARTMENT
    // Memastikan department yang dipilih
    // tersedia di database
    // =========================
    const department = await prisma.department.findUnique({
      where: {
        id: departmentId,
      },
    });

    if (!department) {
      return NextResponse.json(
        {
          message: "Department tidak ditemukan",
        },
        {
          status: 404,
        },
      );
    }

    // =========================
    // CEK RELASI USER - EMPLOYEE
    // Karena pada schema:
    // userId bersifat @unique
    // maka satu user hanya boleh
    // memiliki satu data employee
    // =========================
    const existingEmployee = await prisma.employee.findUnique({
      where: {
        userId,
      },
    });

    if (existingEmployee) {
      return NextResponse.json(
        {
          message: "User sudah memiliki employee",
        },
        {
          status: 400,
        },
      );
    }

    // =========================
    // MEMBUAT DATA EMPLOYEE BARU
    // Sekaligus menghubungkan
    // Employee dengan User
    // dan Department
    // =========================
    const employee = await prisma.employee.create({
      data: {
        name,
        position,
        departmentId,
        userId,
      },
      include: {
        department: true,
        user: true,
      },
    });

    // =========================
    // RESPONSE BERHASIL
    // Mengembalikan data employee
    // yang baru dibuat
    // =========================
    return NextResponse.json(
      {
        message: "Employee berhasil dibuat",
        data: employee,
      },
      {
        status: 201,
      },
    );
  } catch (error: any) {
    // =========================
    // ERROR HANDLER
    // Menangkap seluruh error
    // yang terjadi selama proses
    // =========================
    console.log(error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET() {
  try {
    // =========================
    // MENGAMBIL SELURUH DATA EMPLOYEE
    // Beserta data User dan Department
    // yang berelasi
    // =========================
    const employees = await prisma.employee.findMany({
      include: {
        department: true,
        user: true,
      },

      // =========================
      // MENAMPILKAN DATA TERBARU
      // DI URUTKAN BERDASARKAN
      // WAKTU PEMBUATAN
      // =========================
      orderBy: {
        createdAt: "desc",
      },
    });

    // =========================
    // RESPONSE BERHASIL
    // Mengirim daftar employee
    // ke frontend
    // =========================
    return NextResponse.json(employees);
  } catch (error) {
    // =========================
    // ERROR HANDLER
    // Jika gagal mengambil data
    // employee dari database
    // =========================
    return NextResponse.json(
      {
        message: "Failed get employees",
      },
      {
        status: 500,
      },
    );
  }
}
