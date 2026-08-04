import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "../../../lib/prisma";
import { authOptions } from "lib/auth";
import { badRequest, notFound, unauthorized, serverError } from "../../../lib/http";
import { parseDate } from "../../../lib/validation";

// Select user yang AMAN — password tidak pernah ikut terkirim.
const userSafeSelect = {
  select: { id: true, name: true, email: true, role: true },
};

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return unauthorized();
    }

    const body = await req.json();

    if (typeof body.name !== "string" || body.name.trim() === "") {
      return badRequest("Name wajib diisi");
    }

    const employee = await prisma.employee.findUnique({
      where: { userId: session.user.id },
    });

    if (!employee) {
      return notFound("Employee not found");
    }

    const gender = ["MALE", "FEMALE"].includes(body.gender)
      ? body.gender
      : employee.gender;

    const updated = await prisma.employee.update({
      where: { id: employee.id },
      data: {
        name: body.name.trim(),
        // position wajib di schema — pertahankan nilai lama jika tidak dikirim
        position:
          typeof body.position === "string" && body.position.trim() !== ""
            ? body.position.trim()
            : employee.position,
        phone: typeof body.phone === "string" ? body.phone.trim() : null,
        gender,
        address: typeof body.address === "string" ? body.address.trim() : null,
        birthDate: body.birthDate ? parseDate(body.birthDate) : null,
        joinDate: body.joinDate ? parseDate(body.joinDate) : null,
        emergencyContact:
          typeof body.emergencyContact === "string"
            ? body.emergencyContact.trim()
            : null,
        emergencyPhone:
          typeof body.emergencyPhone === "string"
            ? body.emergencyPhone.trim()
            : null,
        bankName: typeof body.bankName === "string" ? body.bankName.trim() : null,
        bankAccount:
          typeof body.bankAccount === "string" ? body.bankAccount.trim() : null,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      data: updated,
    });
  } catch (error) {
    return serverError(error);
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return unauthorized();
    }

    const employee = await prisma.employee.findUnique({
      where: { userId: session.user.id },
      include: {
        user: userSafeSelect,
        department: true,
      },
    });

    if (!employee) {
      return notFound("Employee not found");
    }

    return NextResponse.json(employee);
  } catch (error) {
    return serverError(error, "Server Error");
  }
}
