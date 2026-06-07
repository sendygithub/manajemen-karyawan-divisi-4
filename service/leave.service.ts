import { LeaveForm } from "@/types/type.leave";

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
  const response = await fetch("/api/leave");

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed get leaves");
  }

  return result;
}
