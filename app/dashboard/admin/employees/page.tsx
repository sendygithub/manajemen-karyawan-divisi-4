"use client";

import { useState, useEffect } from "react";
import EmployeeTable from "@/components/employee/EmployeeTable";
import EmployeeDialog from "@/components/employee/EmployeeDialog";
import { Department } from "@/types/type.department";
import { getDepartments } from "service/department.service";
import { getUsers } from "service/user.service";
import { getEmployees } from "service/employee.service";
import { User } from "@/types/type.employee";

export default function EmployeesPage() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [form, setForm] = useState({
    userId: "",
    name: "",
    position: "",
    departmentId: "",
  });
  const [departments, setDepartments] = useState<Department[]>([]);

  async function fetchEmployees() {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    async function fetchDepartment() {
      try {
        const data = await getDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("Gagal mengambil data departemen:", error);
      }
    }
    fetchDepartment();
  }, []);

  useEffect(() => {
    async function fetchUsers() {
      const data = await getUsers();
      setUsers(data);
    }
    fetchUsers();
  }, []);

  function handleChange(
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
        departments={departments}
        users={users}
        onEmployeeAdded={fetchEmployees}
      />
    </div>
  );
}

// Catatan: Pastikan API endpoint untuk mendapatkan employees sudah benar dan mengembalikan data sesuai dengan tipe EmployeeData yang digunakan di frontend.
