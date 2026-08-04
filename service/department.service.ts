// Client fetcher untuk modul Department.
// CATATAN: file ini hanya boleh berisi kode yang aman dijalankan di browser.
// Data diambil lewat API route (/api/department), bukan Prisma langsung.
// State & hook React TIDAK boleh ada di sini — itu urusan komponen.

import type { DepartmentForm } from "@/types/type.department";

export async function createDepartment(data: DepartmentForm) {
  const response = await fetch("/api/department", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed create department");
  }

  return result;
}

export async function getDepartments() {
  const response = await fetch("/api/department");

  if (!response.ok) {
    throw new Error("Failed fetch departments");
  }

  return response.json();
}

export async function getDepartmentById(id: string) {
  const response = await fetch(`/api/department/${id}`);

  if (!response.ok) {
    throw new Error("Failed fetch department");
  }

  return response.json();
}
