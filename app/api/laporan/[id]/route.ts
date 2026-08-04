import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { badRequest, forbidden, notFound, unauthorized, serverError } from "../../../../lib/http";
import { isNonEmptyString, isFiniteNumber, isValidDateInput, parseDate } from "../../../../lib/validation";
import { updateLaporan } from "service/laporan.service";

// PUT: ADMIN/HR/MANAGER boleh edit laporan siapa pun;
// EMPLOYEE hanya boleh edit laporan miliknya sendiri (ownership check).
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return unauthorized();
    }

    const { id } = await params;

    const laporan = await prisma.laporan.findUnique({ where: { id } });

    if (!laporan) {
      return notFound("Laporan not found");
    }

    const isStaff = ["ADMIN", "HR", "MANAGER"].includes(session.user.role);

    if (!isStaff) {
      const employee = await prisma.employee.findUnique({
        where: { userId: session.user.id },
      });

      // Employee tidak boleh mengedit laporan milik orang lain
      if (!employee || employee.id !== laporan.employeeId) {
        return forbidden();
      }
    }

    const body = await request.json();

    // Validasi input
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

    const updated = await updateLaporan(id, {
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

    return NextResponse.json(updated);
  } catch (error) {
    return serverError(error, "Failed to update laporan");
  }
}
