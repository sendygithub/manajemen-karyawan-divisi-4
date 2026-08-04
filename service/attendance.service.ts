import { prisma } from "lib/prisma";

// Service SERVER-ONLY (memakai Prisma langsung).
// Jangan import file ini dari komponen client — gunakan fetch ke /api/attendance.

export async function getAttendanceByEmployee(userId: string) {
  const employee = await prisma.employee.findUnique({
    where: { userId },
  });

  if (!employee) return [];

  const data = await prisma.attendance.findMany({
    where: { employeeId: employee.id },
    orderBy: { date: "desc" },
  });

  return data;
}

export async function getAllAttendance() {
  const data = await prisma.attendance.findMany({
    include: {
      employee: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { date: "desc" },
  });

  return data;
}
