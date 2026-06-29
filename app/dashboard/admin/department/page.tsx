"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import DepartmentTable from "@/components/department/DepartmentTable";
import DepartmentDialog from "@/components/department/DepartmentDialog";
import { createDepartment } from "service/department.service";

type DepartmentWithEmployees = {
  id: string;
  name: string;
  jobdesk: string;
  plant: string;
  createdAt?: Date;
  employees: { id: string; name: string; position: string }[];
  _count: { employees: number };
};

export default function DepartmentsPage() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<DepartmentWithEmployees[]>([]);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    name: "",
    plant: "",
    jobdesk: "",
  });

  const fetchDepartments = useCallback(async () => {
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
      fetchDepartments();
    } catch (error) {
      console.log(error);
      toast.error("Gagal menambahkan department");
    } finally {
      setLoading(false);
    }
  }

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
              ? `${largestDept.name} (${largestDept._count.employees})`
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
          onRefresh={fetchDepartments}
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
