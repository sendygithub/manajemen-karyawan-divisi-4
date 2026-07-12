import { prisma } from "../lib/prisma";

export type CreateLaporanInput = {
  employeeId: string;
  alatUkurMeter: string;
  alatUkurBusur: string;
  inputAPB: number;
  noSpek: string;
  sudut: number;
  lebar: number;
  kodeTreatment: string;
  tanggalProduksi: string;
  expire: string;
  lebarAktual: number;
  sudutAktual: number;
  jumlahRoll: number;
  meter: number;
};

export async function createLaporan(data: CreateLaporanInput) {
  return prisma.laporan.create({
    data: {
      employeeId: data.employeeId,
      alatUkurMeter: data.alatUkurMeter,
      alatUkurBusur: data.alatUkurBusur,
      inputAPB: data.inputAPB,
      noSpek: data.noSpek,
      sudut: data.sudut,
      lebar: data.lebar,
      kodeTreatment: data.kodeTreatment,
      tanggalProduksi: new Date(data.tanggalProduksi),
      expire: new Date(data.expire),
      lebarAktual: data.lebarAktual,
      sudutAktual: data.sudutAktual,
      jumlahRoll: data.jumlahRoll,
      meter: data.meter,
    },
  });
}

export async function getLaporans() {
  return prisma.laporan.findMany({
    include: {
      employee: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getLaporansByEmployee(employeeId: string) {
  return prisma.laporan.findMany({
    where: { employeeId },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export type UpdateLaporanInput = {
  alatUkurMeter: string;
  alatUkurBusur: string;
  inputAPB: number;
  noSpek: string;
  sudut: number;
  lebar: number;
  kodeTreatment: string;
  tanggalProduksi: string;
  expire: string;
  lebarAktual: number;
  sudutAktual: number;
  jumlahRoll: number;
  meter: number;
};

export async function updateLaporan(id: string, data: UpdateLaporanInput) {
  return prisma.laporan.update({
    where: { id },
    data: {
      alatUkurMeter: data.alatUkurMeter,
      alatUkurBusur: data.alatUkurBusur,
      inputAPB: data.inputAPB,
      noSpek: data.noSpek,
      sudut: data.sudut,
      lebar: data.lebar,
      kodeTreatment: data.kodeTreatment,
      tanggalProduksi: new Date(data.tanggalProduksi),
      expire: new Date(data.expire),
      lebarAktual: data.lebarAktual,
      sudutAktual: data.sudutAktual,
      jumlahRoll: data.jumlahRoll,
      meter: data.meter,
    },
  });
}
