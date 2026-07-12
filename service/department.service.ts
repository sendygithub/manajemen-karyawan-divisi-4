import { DepartmentForm } from "@/types/type.department";
import { useCallback, useState, useEffect } from "react";
import { DepartmentWithEmployees } from "app/types/type.employee";
import { toast } from "sonner";

// Service untuk POST dengan API terkait Department
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

// Service untuk GET dengan API terkait Department
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

const [departments, setDepartments] = useState<DepartmentWithEmployees[]>([]);
const [fetching, setFetching] = useState(true);

export const fetchDepartments = useCallback(async () => {
  try {
    setFetching(true);
    const res = await fetch("/api/department");
    const data = await res.json();
    // Fetch employees per department
    const deptsWithEmployees = await Promise.all(
      data.map(async (dept: any) => {
        const empRes = await fetch(`/api/employee?departmentId=${dept.id}`);
        const empData = await empRes.json();
        const employees = Array.isArray(empData)
          ? empData.map((e: any) => ({
              id: e.id,
              name: e.name,
              position: e.position,
            }))
          : [];
        return {
          ...dept,
          employees,
          _count: { employees: employees.length },
        };
      }),
    );
    setDepartments(deptsWithEmployees);
  } catch (error) {
    console.error(error);
    toast.error("Gagal memuat data department");
  } finally {
    setFetching(false);
  }
}, []);

useEffect(() => {
  fetchDepartments();
}, [fetchDepartments]);

// Stats
const totalEmployees = departments.reduce(
  (sum, d) => sum + d._count.employees,
  0,
);
const largestDept = departments.length
  ? departments.reduce((max, d) =>
      d._count.employees > max._count.employees ? d : max,
    )
  : null;
