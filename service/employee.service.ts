import { EmployeeForm } from "@/types/type.employee";

export async function createEmployee(data: EmployeeForm) {
  const response = await fetch("/api/employee", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed create employee");
  }

  return result;
}
