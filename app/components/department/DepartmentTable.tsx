"use client";

import { Department } from "@/types/type.department";
import { useState } from "react";
import { toast } from "sonner";

type Employee = {
  id: string;
  name: string;
  position: string;
};

type DepartmentWithEmployees = Department & {
  employees?: Employee[];
  _count?: { employees: number };
};

type Props = {
  departments: DepartmentWithEmployees[];
  onRefresh: () => void;
};

export default function DepartmentTable({ departments, onRefresh }: Props) {
  const [editModal, setEditModal] = useState<{
    open: boolean;
    dept: DepartmentWithEmployees | null;
  }>({ open: false, dept: null });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    dept: DepartmentWithEmployees | null;
  }>({ open: false, dept: null });
  const [loading, setLoading] = useState(false);

  // ─── EDIT FORM ───
  const [editForm, setEditForm] = useState({
    name: "",
    jobdesk: "",
    plant: "",
  });

  function openEdit(dept: DepartmentWithEmployees) {
    setEditForm({
      name: dept.name,
      jobdesk: dept.jobdesk,
      plant: dept.plant,
    });
    setEditModal({ open: true, dept });
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editModal.dept) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/department/${editModal.dept.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Department berhasil diupdate!");
      setEditModal({ open: false, dept: null });
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal update department");
    } finally {
      setLoading(false);
    }
  }

  // ─── DELETE ───
  async function handleDelete() {
    if (!deleteModal.dept) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/department/${deleteModal.dept.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Department berhasil dihapus!");
      setDeleteModal({ open: false, dept: null });
      onRefresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal hapus department");
    } finally {
      setLoading(false);
    }
  }

  // ─── PRINT ───
  function handlePrint(dept: DepartmentWithEmployees) {
    const employees = dept.employees || [];
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Department - ${dept.name}</title>
          <style>
            @page { margin: 20mm; }
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; margin: 0; padding: 0; }
            .header { text-align: center; border-bottom: 3px solid #1a1a2e; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 1px; }
            .header h2 { margin: 5px 0 0; font-size: 16px; color: #555; font-weight: normal; }
            .header .divisi { font-size: 13px; color: #888; margin-top: 5px; }
            .info-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .info-table td { padding: 8px 12px; border: 1px solid #ddd; font-size: 14px; }
            .info-table td:first-child { font-weight: 600; width: 200px; background: #f5f5f5; }
            table.employees { width: 100%; border-collapse: collapse; margin-top: 10px; }
            table.employees th { background: #1a1a2e; color: white; padding: 10px 12px; text-align: left; font-size: 13px; }
            table.employees td { padding: 8px 12px; border: 1px solid #ddd; font-size: 13px; }
            table.employees tr:nth-child(even) { background: #f9f9f9; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #888; }
            .badge { display: inline-block; background: #e8f5e9; color: #2e7d32; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
            .title-section { font-size: 18px; font-weight: 600; margin: 20px 0 10px; color: #1a1a2e; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>PT. GAJAH TUNGGAL PLANT A</h1>
            <h2>DIVISI 4 — Detail Department</h2>
            <div class="divisi">Departemen: ${dept.name}</div>
          </div>

          <table class="info-table">
            <tr><td>Nama Department</td><td>${dept.name}</td></tr>
            <tr><td>Job Desk</td><td>${dept.jobdesk}</td></tr>
            <tr><td>Plant</td><td>${dept.plant}</td></tr>
            <tr><td>Total Karyawan</td><td><span class="badge">${employees.length} Orang</span></td></tr>
          </table>

          <div class="title-section">Daftar Karyawan</div>
          ${
            employees.length > 0
              ? `<table class="employees">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Karyawan</th>
                      <th>Posisi / Jabatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${employees
                      .map(
                        (emp, i) => `
                      <tr>
                        <td>${i + 1}</td>
                        <td>${emp.name}</td>
                        <td>${emp.position}</td>
                      </tr>`,
                      )
                      .join("")}
                  </tbody>
                </table>`
              : `<p style="text-align:center;color:#888;padding:20px;">Belum ada karyawan di department ini.</p>`
          }

          <div class="footer">
            Dicetak pada: ${new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })} — PT. GAJAH TUNGGAL PLANT A DIVISI 4
          </div>

          <script>
            window.onload = function() { window.print(); window.close(); }
          <\/script>
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
              <th className="p-4 text-zinc-400 text-sm font-medium">
                Department Name
              </th>
              <th className="p-4 text-zinc-400 text-sm font-medium">
                Job Description
              </th>
              <th className="p-4 text-zinc-400 text-sm font-medium">Plant</th>
              <th className="p-4 text-zinc-400 text-sm font-medium">
                Employees
              </th>
              <th className="p-4 text-zinc-400 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept) => (
              <tr
                key={dept.id}
                className="border-t border-white/10 hover:bg-white/5 transition"
              >
                <td className="p-4 font-medium">{dept.name}</td>
                <td className="p-4 text-zinc-300 text-sm">{dept.jobdesk}</td>
                <td className="p-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs text-zinc-300">
                    {dept.plant}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-zinc-400">
                    {dept._count?.employees ?? dept.employees?.length ?? 0}{" "}
                    employees
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(dept)}
                      className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/30 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteModal({ open: true, dept })}
                      className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/30 transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handlePrint(dept)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-500/20 text-zinc-300 text-xs font-medium hover:bg-zinc-500/30 transition"
                    >
                      Print
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {departments.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500">
                  No departments yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ─── EDIT MODAL ─── */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md rounded-2xl bg-[#18181b] border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Edit Department</h2>
              <button
                onClick={() => setEditModal({ open: false, dept: null })}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400">Department Name</label>
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
                <label className="text-sm text-zinc-400">Job Description</label>
                <input
                  type="text"
                  value={editForm.jobdesk}
                  onChange={(e) =>
                    setEditForm({ ...editForm, jobdesk: e.target.value })
                  }
                  className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-zinc-400">Plant</label>
                <input
                  type="text"
                  value={editForm.plant}
                  onChange={(e) =>
                    setEditForm({ ...editForm, plant: e.target.value })
                  }
                  className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-white text-black py-2 font-medium hover:bg-zinc-200 transition disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Update Department"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ─── DELETE CONFIRM ─── */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm rounded-2xl bg-[#18181b] border border-white/10 p-6">
            <h2 className="text-xl font-semibold mb-2">Hapus Department</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Apakah Anda yakin ingin menghapus{" "}
              <span className="text-white font-medium">
                {deleteModal.dept?.name}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, dept: null })}
                className="flex-1 rounded-lg border border-white/10 py-2 text-sm font-medium hover:bg-white/5 transition"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-medium text-white hover:bg-red-600 transition disabled:opacity-50"
              >
                {loading ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
