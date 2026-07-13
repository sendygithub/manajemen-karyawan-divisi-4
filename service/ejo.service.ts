import { prisma } from "../lib/prisma";

export type CreateEjoInput = {
  divisi: number;
  department: string;
  nomorMesin: number;
  grub: string;
  jenisKerusakan: string;
  jenisPerbaikan: string;
  jamKerusakan: string;
  namaPart: string;
  picOperator: string;
};

export async function createEjo(employeeId: string, data: CreateEjoInput) {
  return prisma.ejo.create({
    data: {
      employeeId,
      divisi: data.divisi,
      department: data.department,
      nomorMesin: data.nomorMesin,
      grub: data.grub,
      jenisKerusakan: data.jenisKerusakan,
      jenisPerbaikan: data.jenisPerbaikan,
      jamKerusakan: new Date(data.jamKerusakan),
      namaPart: data.namaPart,
      picOperator: data.picOperator,
    },
  });
}

export async function getEjos() {
  return prisma.ejo.findMany({
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

export async function getEjosByEmployee(employeeId: string) {
  return prisma.ejo.findMany({
    where: { employeeId },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function updateEjoStatus(id: string, status: string) {
  return prisma.ejo.update({
    where: { id },
    data: { status },
  });
}
