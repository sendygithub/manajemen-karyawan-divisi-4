"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

import { authOptions } from "../lib/auth";
import { prisma } from "../lib/prisma";

// Approve/reject cuti hanya boleh dilakukan ADMIN/HR/MANAGER.
export async function updateLeaveStatus(
  id: string,
  status: "APPROVED" | "REJECTED",
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (!["ADMIN", "HR", "MANAGER"].includes(session.user.role)) {
    throw new Error("Forbidden");
  }

  if (status !== "APPROVED" && status !== "REJECTED") {
    throw new Error("Status tidak valid");
  }

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
