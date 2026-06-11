import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    // =========================
    // 1. Ambil data dari body request
    // =========================
    const body = await request.json();

    const { name, email, password } = body;

    console.log("BODY:", body);

    // =========================
    // 2. Validasi input
    // Pastikan seluruh field wajib terisi
    // =========================
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        {
          status: 400,
        },
      );
    }

    console.log({
      name,
      email,
      password,
    });

    // =========================
    // 3. Cek apakah email sudah terdaftar
    // Karena field email bersifat unique
    // =========================
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "Email already exists",
        },
        {
          status: 400,
        },
      );
    }

    // =========================
    // 4. Hash password
    // Password tidak boleh disimpan
    // dalam bentuk plain text
    // =========================
    const hashedPassword = await bcrypt.hash(password, 10);

    // =========================
    // 5. Simpan user baru ke database
    // Role otomatis menggunakan default
    // dari schema Prisma (EMPLOYEE)
    // =========================
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // =========================
    // 6. Kembalikan response sukses
    // Jangan kirim password ke client
    // =========================
    return NextResponse.json(
      {
        message: "Register success",

        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    // =========================
    // 7. Tangani error server
    // =========================
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
