"use server";

import { prisma } from "lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateLeaveStatus(
  id: string,
  status: "APPROVED" | "REJECTED",
) {
  await prisma.leave.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/leave");
  revalidatePath("/dashboard/admin/leave");
  revalidatePath("/dashboard/hr/leave");
  revalidatePath("/dashboard/manager/leave");
  revalidatePath("/dashboard/employee/leave");
}
