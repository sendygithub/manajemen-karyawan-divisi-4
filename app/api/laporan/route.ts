import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { badRequest, notFound, unauthorized, serverError } from "../../../lib/http";
import { isNonEmptyString, isFiniteNumber, isValidDateInput, parseDate } from "../../../lib/validation";
import { createLaporan, getLaporans } from "service/laporan.service";

// GET:
// - ADMIN/HR/MANAGER → semua laporan
// - EMPLOYEE → hanya laporan miliknya sendiri
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return unauthorized();
    }

    if (!["ADMIN", "HR", "MANAGER"].includes(session.user.role)) {
      const employee = await prisma.employee.findUnique({
        where: { userId: session.user.id },
      });

      if (!employee) {
        return notFound("Employee record not found");
      }

      const ownLaporans = await prisma.laporan.findMany({
        where: { employeeId: employee.id },
        include: {
          employee: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json(ownLaporans);
    }

    const laporans = await getLaporans();
    return NextResponse.json(laporans);
  } catch (error) {
    return serverError(error, "Failed to fetch laporans");
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

    // Validasi input (semua field angka & tanggal)
    const numberFields: Array<keyof typeof body> = [
      "inputAPB",
      "sudut",
      "lebar",
      "lebarAktual",
      "sudutAktual",
      "jumlahRoll",
      "meter",
    ];

    for (const field of numberFields) {
      if (!isFiniteNumber(body[field])) {
        return badRequest(`${String(field)} harus berupa angka`);
      }
    }

    const dateFields: Array<keyof typeof body> = ["tanggalProduksi", "expire"];

    for (const field of dateFields) {
      if (!isValidDateInput(body[field])) {
        return badRequest(`${String(field)} tidak valid`);
      }
    }

    if (
      !isNonEmptyString(body.alatUkurMeter) ||
      !isNonEmptyString(body.alatUkurBusur) ||
      !isNonEmptyString(body.noSpek) ||
      !isNonEmptyString(body.kodeTreatment)
    ) {
      return badRequest("Semua field teks wajib diisi");
    }

    const laporan = await createLaporan({
      employeeId: employee.id,
      alatUkurMeter: body.alatUkurMeter.trim(),
      alatUkurBusur: body.alatUkurBusur.trim(),
      inputAPB: body.inputAPB,
      noSpek: body.noSpek.trim(),
      sudut: body.sudut,
      lebar: body.lebar,
      kodeTreatment: body.kodeTreatment.trim(),
      tanggalProduksi: parseDate(body.tanggalProduksi)!.toISOString(),
      expire: parseDate(body.expire)!.toISOString(),
      lebarAktual: body.lebarAktual,
      sudutAktual: body.sudutAktual,
      jumlahRoll: body.jumlahRoll,
      meter: body.meter,
    });

    return NextResponse.json(laporan, { status: 201 });
  } catch (error) {
    return serverError(error, "Failed to create laporan");
  }
}
