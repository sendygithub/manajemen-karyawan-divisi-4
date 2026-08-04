import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";

import { prisma } from "../../../lib/prisma";
import { rateLimit, getClientIp } from "../../../lib/rate-limit";
import { isEmail, isNonEmptyString } from "../../../lib/validation";
import { badRequest, serverError } from "../../../lib/http";

// Endpoint publik (by design): siapa pun boleh daftar.
// Role otomatis EMPLOYEE (default schema) — user biasa tidak bisa
// mendaftar sebagai ADMIN/HR/MANAGER.
export async function POST(request: Request) {
  // Rate limit sederhana: maks 10 request per menit per IP.
  if (!rateLimit(`register:${getClientIp(request.headers)}`, 10, 60_000)) {
    return NextResponse.json(
      { message: "Too many requests, coba lagi nanti" },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();

    const { name, email, password } = body;

    // Validasi input
    if (!isNonEmptyString(name)) {
      return badRequest("Name wajib diisi");
    }

    if (!isEmail(email)) {
      return badRequest("Email tidak valid");
    }

    if (!isNonEmptyString(password) || password.length < 8) {
      return badRequest("Password minimal 8 karakter");
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return badRequest("Email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan user baru — role diambil dari default schema (EMPLOYEE)
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      },
    });

    // Jangan kirim password ke client
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
      { status: 201 },
    );
  } catch (error) {
    return serverError(error);
  }
}
