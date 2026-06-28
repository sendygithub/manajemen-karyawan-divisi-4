import { prisma } from "lib/prisma";
export async function getAttendanceByEmployee(userId: string) {
  console.log("1. userId masuk:", userId);

  const employee = await prisma.employee.findUnique({
    where: { userId },
  });

  console.log("2. employee ditemukan:", employee); // ✅ null berarti belum ada Employee untuk user ini

  if (!employee) return [];

  console.log("3. employeeId:", employee.id);

  const data = await prisma.attendance.findMany({
    where: { employeeId: employee.id },
    orderBy: { date: "desc" },
  });

  console.log("4. attendance count:", data.length);
  return data;
}
