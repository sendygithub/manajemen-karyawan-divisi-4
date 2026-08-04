import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { badRequest, notFound, unauthorized, serverError } from "../../../lib/http";
import { isNonEmptyString, isFiniteNumber, isValidDateInput, parseDate } from "../../../lib/validation";
import { createEjo, getEjos } from "service/ejo.service";

// GET:
// - ADMIN/HR/MANAGER → semua EJO
// - EMPLOYEE → hanya EJO miliknya sendiri
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return unauthorized();
    }

    if (!["ADMIN", "HR", "MANAGER"].includes(session.user.role)) {
      // Employee hanya melihat miliknya sendiri
      const employee = await prisma.employee.findUnique({
        where: { userId: session.user.id },
      });

      if (!employee) {
        return notFound("Employee record not found");
      }

      const ownEjos = await prisma.ejo.findMany({
        where: { employeeId: employee.id },
        include: {
          employee: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(ownEjos);
    }

    const ejos = await getEjos();
    return NextResponse.json(ejos);
  } catch (error) {
    return serverError(error, "Failed to fetch ejos");
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return unauthorized();
    }

    const employee = await prisma.employee.findUnique({
      where: { userId: session.user.id },
    });

    if (!employee) {
      return notFound("Employee record not found");
    }

    const body = await request.json();

    // Validasi input
    if (!isFiniteNumber(body.divisi)) {
      return badRequest("divisi harus berupa angka");
    }
    if (!isNonEmptyString(body.department)) {
      return badRequest("department wajib diisi");
    }
    if (!isFiniteNumber(body.nomorMesin)) {
      return badRequest("nomorMesin harus berupa angka");
    }
    if (!isNonEmptyString(body.grub)) {
      return badRequest("grub wajib diisi");
    }
    if (!isNonEmptyString(body.jenisKerusakan)) {
      return badRequest("jenisKerusakan wajib diisi");
    }
    if (!["MEKANIK", "ELEKTRIK"].includes(body.jenisPerbaikan)) {
      return badRequest("jenisPerbaikan harus MEKANIK atau ELEKTRIK");
    }
    if (!isValidDateInput(body.jamKerusakan)) {
      return badRequest("jamKerusakan tidak valid");
    }
    if (!isNonEmptyString(body.namaPart)) {
      return badRequest("namaPart wajib diisi");
    }

    const ejo = await createEjo(employee.id, {
      divisi: body.divisi,
      department: body.department.trim(),
      nomorMesin: body.nomorMesin,
      grub: body.grub.trim(),
      jenisKerusakan: body.jenisKerusakan.trim(),
      jenisPerbaikan: body.jenisPerbaikan,
      jamKerusakan: parseDate(body.jamKerusakan)!.toISOString(),
      namaPart: body.namaPart.trim(),
      picOperator: employee.name,
    });

    return NextResponse.json(ejo, { status: 201 });
  } catch (error) {
    return serverError(error, "Failed to create ejo");
  }
}
