"use client";

import { useState } from "react";
import { Department } from "@/types/type.department";

export default function DepartmentsPage() {
  const [open, setOpen] = useState(false);

  const [departments, setDepartments] = useState<Department[]>([
    {
      id: 1,
      name: "Information Technology",
      manager: "John Doe",
      totalEmployees: 12,
    },
    {
      id: 2,
      name: "Human Resources",
      manager: "Jane Smith",
      totalEmployees: 5,
    },
    {
      id: 3,
      name: "Finance",
      manager: "Michael Johnson",
      totalEmployees: 7,
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    manager: "",
    totalEmployees: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newDepartment: Department = {
      id: Date.now(),
      name: form.name,
      manager: form.manager,
      totalEmployees: Number(form.totalEmployees),
    };

    setDepartments([...departments, newDepartment]);

    setForm({
      name: "",
      manager: "",
      totalEmployees: "",
    });

    setOpen(false);
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
          <p className="text-zinc-400 text-sm">Total Employees</p>

          <h2 className="text-3xl font-bold mt-2">
            {departments.reduce((acc, item) => acc + item.totalEmployees, 0)}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-zinc-400 text-sm">Largest Department</p>

          <h2 className="text-xl font-bold mt-2">IT Department</h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr className="text-left">
              <th className="p-4">Department Name</th>

              <th className="p-4">Manager</th>

              <th className="p-4">Total Employees</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((department) => (
              <tr key={department.id} className="border-t border-white/10">
                <td className="p-4 font-medium">{department.name}</td>

                <td className="p-4">{department.manager}</td>

                <td className="p-4">{department.totalEmployees}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#18181b] border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Add Department</h2>

              <button
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400">Department Name</label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-zinc-400">Manager</label>

                <input
                  type="text"
                  name="manager"
                  value={form.manager}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-zinc-400">Total Employees</label>

                <input
                  type="number"
                  name="totalEmployees"
                  value={form.totalEmployees}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-white text-black py-2 font-medium hover:bg-zinc-200 transition"
              >
                Save Department
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
