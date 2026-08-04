"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Department } from "@/types/type.department";
import DepartmentTable from "@/components/department/DepartmentTable";
import DepartmentDialog from "@/components/department/DepartmentDialog";
import { createDepartment, getDepartments } from "service/department.service";

export default function DepartmentsPage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<
    (Department & { _count?: { employees: number } })[]
  >([]);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    name: "",
    plant: "",
    jobdesk: "",
  });

  async function loadDepartments() {
    try {
      setFetching(true);
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.log(error);
      toast.error("Gagal memuat data department");
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    const run = async () => {
      await loadDepartments();
    };
    run();
  }, []);

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
      toast.success("Department berhasil ditambahkan!");
      setForm({ name: "", plant: "", jobdesk: "" });
      setOpen(false);
      loadDepartments();
    } catch (error) {
      console.log(error);
      toast.error("Gagal menambahkan department");
    } finally {
      setLoading(false);
    }
  }

  // Stats
  const totalEmployees = departments.reduce(
    (sum, d) => sum + (d._count?.employees ?? 0),
    0,
  );
  const largestDept = departments.length
    ? departments.reduce((max, d) =>
        (d._count?.employees ?? 0) > (max._count?.employees ?? 0) ? d : max,
      )
    : null;

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-zinc-400 text-sm">Total Departments</p>
          <h2 className="text-3xl font-bold mt-2">{departments.length}</h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-zinc-400 text-sm">Total Karyawan</p>
          <h2 className="text-3xl font-bold mt-2 text-blue-400">
            {totalEmployees}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-zinc-400 text-sm">Department Terbesar</p>
          <h2 className="text-xl font-bold mt-2 text-purple-400">
            {largestDept
              ? `${largestDept.name} (${largestDept._count?.employees ?? 0})`
              : "-"}
          </h2>
        </div>
      </div>

      {/* TABLE */}
      {fetching ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-zinc-400 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-zinc-400 text-sm">Memuat data...</p>
        </div>
      ) : (
        <DepartmentTable
          departments={departments}
          onRefresh={loadDepartments}
        />
      )}

      {/* MODAL ADD */}
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
