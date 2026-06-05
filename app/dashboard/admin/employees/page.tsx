"use client";

import { useState } from "react";
import { Employee } from "@/types/type.employee";
import EmployeeTable from "@/components/employee/EmployeeTable";
import EmployeeDialog from "@/components/employee/EmployeeDialog";

export default function EmployeesPage() {
  const [open, setOpen] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      position: "Frontend Developer",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    position: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newEmployee: Employee = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      position: form.position,
    };

    setEmployees([...employees, newEmployee]);

    setForm({
      name: "",
      email: "",
      position: "",
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
      />
    </div>
  );
}
