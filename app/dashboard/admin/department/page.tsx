"use client";

import { SetStateAction, useState } from "react";
import { Department, DepartmentForm } from "@/types/type.department";
import DepartmentTable from "@/components/department/DepartmentTable";
import DepartmentDialog from "@/components/department/DepartmentDialog";
import { toast } from "sonner";
import { createDepartment } from "service/department.service";

export default function DepartmentsPage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Dummy data untuk department, nanti bisa diganti dengan data dari database
  const [departments, setDepartments] = useState<Department[]>([
    {
      id: "1",
      name: "Information Technology",
      plant: "Headquarters",
      jobdesk: "Manage IT infrastructure and support",
    },
    {
      id: "2",
      name: "Human Resources",
      plant: "Headquarters",
      jobdesk: "Handle recruitment, employee relations, and benefits",
    },
    {
      id: "3",
      name: "Finance",
      plant: "Headquarters",
      jobdesk: "Manage financial operations and reporting",
    },
  ]);
  // Form state untuk dialog tambah department
  const [form, setForm] = useState({
    name: "",
    plant: "",
    jobdesk: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const result = await createDepartment(form);
      console.log(form);

      toast.success("Department berhasil ditambahkan!");

      setDepartments([...departments, result.department]);

      setForm({
        name: "",
        plant: "",
        jobdesk: "",
      });

      setOpen(false);
    } catch (error) {
      console.log(error);

      toast.error("Gagal menambahkan department");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Departments</h1>

          <p className="text-zinc-400 text-sm">Manage company departments</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition"
          disabled={loading}
        >
          + Add Department
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-zinc-400 text-sm">Total Departments</p>

          <h2 className="text-3xl font-bold mt-2">{departments.length}</h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-zinc-400 text-sm">Plant</p>

          <h2 className="text-3xl font-bold mt-2">
            ini bisa diambil dari data departments, misalnya dengan mengambil
            plant yang paling banyak muncul atau plant dari department terbesar
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-zinc-400 text-sm">Largest Department</p>

          <h2 className="text-xl font-bold mt-2">nanti di isi</h2>
        </div>
      </div>

      {/* TABLE */}
      <DepartmentTable departments={departments} />

      {/* MODAL */}
      <DepartmentDialog
        open={open}
        setOpen={setOpen}
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        setForm={setForm}
      />
    </div>
  );
}
