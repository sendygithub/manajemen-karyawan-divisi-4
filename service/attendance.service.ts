import { prisma } from "lib/prisma";
export async function getAttendanceByEmployee(employeeId: string) {
  const data = await prisma.attendance.findMany({
    where: { employeeId },
    orderBy: { date: "desc" },
  });

  console.log("ALL DATA:", data);
  return data;
}
