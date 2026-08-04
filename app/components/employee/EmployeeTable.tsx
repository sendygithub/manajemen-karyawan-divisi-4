"use client";

import { useEffect, useState, useRef } from "react";
import {
  getEmployees,
  deleteEmployee,
  updateEmployee,
} from "service/employee.service";
import { toast } from "sonner";
import { getDepartments } from "service/department.service";
import { Department } from "@/types/type.department";

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  phone?: string | null;
  gender?: string | null;
  birthDate?: string | null;
  address?: string | null;
  joinDate?: string | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  bankName?: string | null;
  bankAccount?: string | null;
  department: { name: string; id?: string };
  user?: { name?: string; email?: string };
}

interface Props {
  employees: Employee[];
}

export default function EmployeeTable({ employees: initialEmployees }: Props) {
  const [employees, setEmployees] = useState<Employee[]>(
    initialEmployees || [],
  );
  const [editModal, setEditModal] = useState<{
    open: boolean;
    employee: Employee | null;
  }>({ open: false, employee: null });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [editForm, setEditForm] = useState({
    name: "",
    position: "",
    departmentId: "",
  });
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  async function fetchEmployees() {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchDepartments() {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error("Gagal mengambil data departemen:", error);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Yakin ingin menghapus employee "${name}"?`)) return;

    try {
      await deleteEmployee(id);
      toast.success("Employee berhasil dihapus!");
      fetchEmployees();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menghapus employee",
      );
    }
  }

  function openEdit(employee: Employee) {
    setEditForm({
      name: employee.name,
      position: employee.position,
      departmentId: employee.department?.id || "",
    });
    setEditModal({ open: true, employee });
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editModal.employee) return;

    try {
      await updateEmployee(editModal.employee.id, editForm);
      toast.success("Employee berhasil diupdate!");
      setEditModal({ open: false, employee: null });
      fetchEmployees();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal mengupdate employee",
      );
    }
  }

  function handlePrint(employee: Employee) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const genderLabel =
      employee.gender === "MALE"
        ? "Laki-laki"
        : employee.gender === "FEMALE"
          ? "Perempuan"
          : "-";
    const birthDate = employee.birthDate
      ? new Date(employee.birthDate).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "-";
    const joinDate = employee.joinDate
      ? new Date(employee.joinDate).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "-";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Detail Employee - ${employee.name}</title>
        <style>
          @page { margin: 15mm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #1a1a2e;
            background: #f8f9fa;
            padding: 30px;
          }
          .print-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            color: white;
            padding: 32px 40px;
            display: flex;
            align-items: center;
            gap: 20px;
          }
          .header .avatar {
            width: 72px;
            height: 72px;
            border-radius: 50%;
            background: rgba(255,255,255,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
            font-weight: 700;
            flex-shrink: 0;
            border: 2px solid rgba(255,255,255,0.3);
          }
          .header h1 { font-size: 24px; font-weight: 700; }
          .header .subtitle { font-size: 14px; opacity: 0.8; margin-top: 4px; }
          .header .badge {
            display: inline-block;
            background: rgba(255,255,255,0.15);
            padding: 4px 14px;
            border-radius: 20px;
            font-size: 12px;
            margin-top: 8px;
          }
          .body { padding: 32px 40px; }
          .section-title {
            font-size: 14px;
            font-weight: 600;
            color: #1a1a2e;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e9ecef;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px 32px;
            margin-bottom: 28px;
          }
          .info-item { }
          .info-item .label {
            font-size: 11px;
            color: #6c757d;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }
          .info-item .value {
            font-size: 15px;
            color: #1a1a2e;
            font-weight: 500;
          }
          .info-item.full-width { grid-column: 1 / -1; }
          .footer {
            padding: 20px 40px;
            border-top: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: #6c757d;
          }
          .footer .company {
            font-weight: 600;
            color: #1a1a2e;
          }
          @media print {
            body { background: white; padding: 0; }
            .print-container { box-shadow: none; border-radius: 0; }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="header">
            <div class="avatar">${employee.name.charAt(0).toUpperCase()}</div>
            <div>
              <h1>${employee.name}</h1>
              <div class="subtitle">${employee.position}</div>
              <div class="badge">${employee.department?.name || "-"}</div>
            </div>
          </div>
          <div class="body">
            <div class="section-title">Data Pribadi</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">Nama Lengkap</div>
                <div class="value">${employee.name}</div>
              </div>
              <div class="info-item">
                <div class="label">Jenis Kelamin</div>
                <div class="value">${genderLabel}</div>
              </div>
              <div class="info-item">
                <div class="label">Tanggal Lahir</div>
                <div class="value">${birthDate}</div>
              </div>
              <div class="info-item">
                <div class="label">No. Telepon</div>
                <div class="value">${employee.phone || "-"}</div>
              </div>
              <div class="info-item full-width">
                <div class="label">Alamat</div>
                <div class="value">${employee.address || "-"}</div>
              </div>
            </div>

            <div class="section-title">Data Kepegawaian</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">Posisi / Jabatan</div>
                <div class="value">${employee.position}</div>
              </div>
              <div class="info-item">
                <div class="label">Departemen</div>
                <div class="value">${employee.department?.name || "-"}</div>
              </div>
              <div class="info-item">
                <div class="label">Tanggal Bergabung</div>
                <div class="value">${joinDate}</div>
              </div>
              <div class="info-item">
                <div class="label">Email</div>
                <div class="value">${employee.user?.email || employee.email || "-"}</div>
              </div>
            </div>

            <div class="section-title">Kontak Darurat</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">Nama Kontak</div>
                <div class="value">${employee.emergencyContact || "-"}</div>
              </div>
              <div class="info-item">
                <div class="label">No. Telepon</div>
                <div class="value">${employee.emergencyPhone || "-"}</div>
              </div>
            </div>

            <div class="section-title">Informasi Bank</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="label">Nama Bank</div>
                <div class="value">${employee.bankName || "-"}</div>
              </div>
              <div class="info-item">
                <div class="label">No. Rekening</div>
                <div class="value">${employee.bankAccount || "-"}</div>
              </div>
            </div>
          </div>
          <div class="footer">
            <span class="company">PT. GAJAH TUNGGAL PLANT A — DIVISI 4</span>
            <span>Dicetak pada ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr className="text-left">
              <th className="p-4 text-zinc-400 text-sm font-medium">Name</th>
              <th className="p-4 text-zinc-400 text-sm font-medium">
                Position
              </th>
              <th className="p-4 text-zinc-400 text-sm font-medium">
                Department
              </th>
              <th className="p-4 text-zinc-400 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="border-t border-white/10 hover:bg-white/[0.02] transition"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                      {employee.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-xs text-zinc-500">
                        {employee.user?.email || employee.email || "-"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-zinc-300">{employee.position}</td>
                <td className="p-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs text-zinc-300">
                    {employee.department?.name}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(employee)}
                      className="px-3 py-1.5 text-xs rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(employee.id, employee.name)}
                      className="px-3 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handlePrint(employee)}
                      className="px-3 py-1.5 text-xs rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition"
                    >
                      Print
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-zinc-500">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editModal.open && editModal.employee && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md rounded-2xl bg-[#18181b] border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Edit Employee</h2>
              <button
                onClick={() => setEditModal({ open: false, employee: null })}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-zinc-400">Position</label>
                <input
                  type="text"
                  value={editForm.position}
                  onChange={(e) =>
                    setEditForm({ ...editForm, position: e.target.value })
                  }
                  className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-zinc-400">Department</label>
                <select
                  value={editForm.departmentId}
                  onChange={(e) =>
                    setEditForm({ ...editForm, departmentId: e.target.value })
                  }
                  className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModal({ open: false, employee: null })}
                  className="flex-1 rounded-lg border border-white/10 text-zinc-300 py-2 font-medium hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-white text-black py-2 font-medium hover:bg-zinc-200 transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
