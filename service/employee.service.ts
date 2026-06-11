import { EmployeeForm } from "@/types/type.employee";

export async function createEmployee(data: {
  name: string;
  position: string;
  departmentId: string;
  userId: string;
}) {
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

  return result.data;
}

// service/employee.service.ts

export async function getEmployees() {
  const response = await fetch("/api/employee");

  if (!response.ok) {
    throw new Error("Failed get employees");
  }

  return response.json();
}
