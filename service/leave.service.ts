import { LeaveForm } from "@/types/type.leave";
import { prisma } from "lib/prisma";

export async function createLeave(data: LeaveForm) {
  const response = await fetch("/api/leave", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed create leave request");
  }

  return result;
}

export async function getLeaves() {
  return prisma.leave.findMany({
    include: {
      employee: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
