"use client";

import { useState, useEffect } from "react";
import EmployeeTable from "@/components/employee/EmployeeTable";
import EmployeeDialog from "@/components/employee/EmployeeDialog";
import { Department } from "@/types/type.department";
import { getDepartments } from "service/department.service";
import { Employee } from "@prisma/client";
import { toast } from "sonner"; // Opsional: gunakan sonner jika sudah diinstall

export default function EmployeesPage() {
  const [open, setOpen] = useState(false);

  // 1. PERBAIKAN: Sesuaikan struktur mock data dengan model Prisma terbaru (menggunakan id string dan departmentId)
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "emp-1",
      name: "John Doe",
      email: "john@example.com",
      position: "Frontend Developer",
      departmentId: "1", // Merujuk ke ID department, bukan teks langsung
      userId: "user-mock-1", // Diperlukan karena skema mewajibkan userId
      createdAt: new Date(),
    },
  ]);

  // 2. PERBAIKAN: Tetap gunakan field 'department' di form untuk mencocokkan EmployeeDialog
  const [form, setForm] = useState({
    name: "",
    email: "",
    position: "",
    department: "",
  });

  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("Gagal mengambil data departemen:", error);
      }
    }

    fetchDepartments();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // 3. PERBAIKAN: Sesuaikan dengan payload data yang akan di-POST ke API nantinya
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.departmentId) {
      toast.error("Silakan pilih departemen terlebih dahulu.");
      return;
    }

    const newEmployee: Employee = {
      id: crypto.randomUUID(), // Menghasilkan string UUID yang aman untuk tipe data string
      name: form.name,
      email: form.email,
      position: form.position,
      departmentId: form.departmentId,
      userId: "user-mock-id", // Sementara di-hardcode sebelum dipasang auth session asli
      createdAt: new Date(),
    };

    setEmployees([...employees, newEmployee]);
    toast.success("Karyawan berhasil ditambahkan (Lokal)");

    // Reset Form
    setForm({
      name: "",
      email: "",
      position: "",
      departmentId: "",
    });

    setOpen(false);
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-zinc-400 text-sm">Manage employee data</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition"
        >
          + Add Employee
        </button>
      </div>

      {/* TABLE */}
      <EmployeeTable employees={employees} />

      {/* MODAL */}
      <EmployeeDialog
        open={open}
        setOpen={setOpen}
        form={form}
        setForm={setForm}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        departments={departments}
      />
    </div>
  );
}