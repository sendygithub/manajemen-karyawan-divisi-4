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

export async function getEmployees() {
  const response = await fetch("/api/employee");

  if (!response.ok) {
    throw new Error("Failed get employees");
  }

  return response.json();
}

export async function updateEmployee(
  id: string,
  data: { name: string; position: string; departmentId: string },
) {
  const response = await fetch(`/api/employee/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed update employee");
  }

  return result.data;
}

export async function deleteEmployee(id: string) {
  const response = await fetch(`/api/employee/${id}`, {
    method: "DELETE",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed delete employee");
  }

  return result;
}
