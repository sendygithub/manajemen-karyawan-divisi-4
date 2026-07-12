"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FileText, Plus, Loader2, Eye } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type EjoData = {
  id: string;
  nomorEjo: number;
  employeeId: string;
  divisi: number;
  department: string;
  nomorMesin: number;
  grub: string;
  jenisKerusakan: string;
  jenisPerbaikan: string;
  jamKerusakan: string;
  namaPart: string;
  picOperator: string;
  status: string;
  createdAt: string;
  employee?: {
    name: string;
  };
};

const emptyForm = {
  divisi: "",
  department: "",
  nomorMesin: "",
  grub: "",
  jenisKerusakan: "",
  jenisPerbaikan: "MEKANIK",
  jamKerusakan: "",
  namaPart: "",
};

export default function EmployeeEjoPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedEjo, setSelectedEjo] = useState<EjoData | null>(null);
  const [ejos, setEjos] = useState<EjoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchEjos();
  }, []);

  async function fetchEjos() {
    try {
      const res = await fetch("/api/ejo");
      const data = await res.json();
      setEjos(data);
    } catch (error) {
      console.error("Gagal mengambil data ejo:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/ejo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          divisi: Number(form.divisi),
          department: form.department,
          nomorMesin: Number(form.nomorMesin),
          grub: form.grub,
          jenisKerusakan: form.jenisKerusakan,
          jenisPerbaikan: form.jenisPerbaikan,
          jamKerusakan: form.jamKerusakan,
          namaPart: form.namaPart,
        }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan EJO");

      toast.success("EJO berhasil diinput!");
      setOpen(false);
      setForm(emptyForm);
      await fetchEjos();
    } catch (error) {
      toast.error("Gagal menyimpan EJO");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  function openPreview(ejo: EjoData) {
    setSelectedEjo(ejo);
    setPreviewOpen(true);
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-zinc-400" size={32} />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">E-Job Order (EJO)</h1>
          <p className="text-zinc-400 text-sm">
            Input data E-Job Order perbaikan mesin
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition flex items-center gap-2"
        >
          <Plus size={18} />
          Input EJO
        </button>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400">
                <th className="text-left p-4 font-medium">No EJO</th>
                <th className="text-left p-4 font-medium">Divisi</th>
                <th className="text-left p-4 font-medium">Department</th>
                <th className="text-left p-4 font-medium">No Mesin</th>
                <th className="text-left p-4 font-medium">Grub</th>
                <th className="text-left p-4 font-medium">Jenis Kerusakan</th>
                <th className="text-left p-4 font-medium">Jenis Perbaikan</th>
                <th className="text-left p-4 font-medium">Jam Kerusakan</th>
                <th className="text-left p-4 font-medium">Nama Part</th>
                <th className="text-left p-4 font-medium">PIC Operator</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={12} className="text-center p-8 text-zinc-500">
                    <Loader2
                      size={32}
                      className="mx-auto mb-3 animate-spin text-zinc-600"
                    />
                    Memuat data...
                  </td>
                </tr>
              ) : ejos.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center p-8 text-zinc-500">
                    <FileText
                      size={40}
                      className="mx-auto mb-3 text-zinc-600"
                    />
                    Belum ada EJO. Klik "Input EJO" untuk menambahkan.
                  </td>
                </tr>
              ) : (
                ejos.map((ejo) => (
                  <tr
                    key={ejo.id}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="p-4 font-medium">#{ejo.nomorEjo}</td>
                    <td className="p-4">{ejo.divisi}</td>
                    <td className="p-4">{ejo.department}</td>
                    <td className="p-4">{ejo.nomorMesin}</td>
                    <td className="p-4">{ejo.grub}</td>
                    <td className="p-4">{ejo.jenisKerusakan}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          ejo.jenisPerbaikan === "MEKANIK"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {ejo.jenisPerbaikan}
                      </span>
                    </td>
                    <td className="p-4">
                      {new Date(ejo.jamKerusakan).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4">{ejo.namaPart}</td>
                    <td className="p-4">{ejo.picOperator}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400">
                        {ejo.status === "MENUNGGU_KONFIRMASI"
                          ? "Menunggu Konfirmasi"
                          : ejo.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => openPreview(ejo)}
                        className="flex items-center gap-1.5 bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-500/30 transition"
                      >
                        <Eye size={14} />
                        Preview
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DIALOG - INPUT EJO */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#18181b] border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Input E-Job Order (EJO)</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Nomor EJO - Auto */}
                <div>
                  <label className="text-sm text-zinc-400">Nomor EJO</label>
                  <input
                    type="text"
                    value="(Auto-increment)"
                    disabled
                    className="w-full mt-1 rounded-lg bg-zinc-800 border border-white/10 px-4 py-2 outline-none text-zinc-500 cursor-not-allowed"
                  />
                </div>

                {/* Divisi */}
                <div>
                  <label className="text-sm text-zinc-400">Divisi</label>
                  <input
                    type="number"
                    name="divisi"
                    value={form.divisi}
                    onChange={handleChange}
                    placeholder="Masukkan divisi"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="text-sm text-zinc-400">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    placeholder="Masukkan department"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>

                {/* Nomor Mesin */}
                <div>
                  <label className="text-sm text-zinc-400">Nomor Mesin</label>
                  <input
                    type="number"
                    name="nomorMesin"
                    value={form.nomorMesin}
                    onChange={handleChange}
                    placeholder="Masukkan nomor mesin"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>

                {/* Grub */}
                <div>
                  <label className="text-sm text-zinc-400">Grub</label>
                  <input
                    type="text"
                    name="grub"
                    value={form.grub}
                    onChange={handleChange}
                    placeholder="Masukkan grub"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>

                {/* Jenis Kerusakan */}
                <div>
                  <label className="text-sm text-zinc-400">
                    Jenis Kerusakan
                  </label>
                  <input
                    type="text"
                    name="jenisKerusakan"
                    value={form.jenisKerusakan}
                    onChange={handleChange}
                    placeholder="Masukkan jenis kerusakan"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>

                {/* Jenis Perbaikan */}
                <div>
                  <label className="text-sm text-zinc-400">
                    Jenis Perbaikan
                  </label>
                  <select
                    name="jenisPerbaikan"
                    value={form.jenisPerbaikan}
                    onChange={handleChange}
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  >
                    <option value="MEKANIK">Mekanik</option>
                    <option value="ELEKTRIK">Elektrik</option>
                  </select>
                </div>

                {/* Jam Kerusakan */}
                <div>
                  <label className="text-sm text-zinc-400">Jam Kerusakan</label>
                  <input
                    type="datetime-local"
                    name="jamKerusakan"
                    value={form.jamKerusakan}
                    onChange={handleChange}
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>

                {/* Nama Part */}
                <div>
                  <label className="text-sm text-zinc-400">Nama Part</label>
                  <input
                    type="text"
                    name="namaPart"
                    value={form.namaPart}
                    onChange={handleChange}
                    placeholder="Masukkan nama part"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>

                {/* PIC Operator - Auto */}
                <div>
                  <label className="text-sm text-zinc-400">PIC Operator</label>
                  <input
                    type="text"
                    value={session?.user?.name || "(Auto)"}
                    disabled
                    className="w-full mt-1 rounded-lg bg-zinc-800 border border-white/10 px-4 py-2 outline-none text-zinc-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-5 py-2 rounded-lg border border-white/10 text-zinc-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  {submitting ? "Menyimpan..." : "Simpan EJO"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DIALOG - PREVIEW EJO */}
      {previewOpen && selectedEjo && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#18181b] border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Preview EJO #{selectedEjo.nomorEjo}
              </h2>
              <button
                onClick={() => {
                  setPreviewOpen(false);
                  setSelectedEjo(null);
                }}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Nomor EJO
                  </label>
                  <p className="text-white font-medium mt-1">
                    #{selectedEjo.nomorEjo}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Divisi
                  </label>
                  <p className="text-white font-medium mt-1">
                    {selectedEjo.divisi}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Department
                  </label>
                  <p className="text-white font-medium mt-1">
                    {selectedEjo.department}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Nomor Mesin
                  </label>
                  <p className="text-white font-medium mt-1">
                    {selectedEjo.nomorMesin}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Grub
                  </label>
                  <p className="text-white font-medium mt-1">
                    {selectedEjo.grub}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Jenis Kerusakan
                  </label>
                  <p className="text-white font-medium mt-1">
                    {selectedEjo.jenisKerusakan}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Jenis Perbaikan
                  </label>
                  <p className="text-white font-medium mt-1">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        selectedEjo.jenisPerbaikan === "MEKANIK"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {selectedEjo.jenisPerbaikan}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Jam Kerusakan
                  </label>
                  <p className="text-white font-medium mt-1">
                    {new Date(selectedEjo.jamKerusakan).toLocaleDateString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Nama Part
                  </label>
                  <p className="text-white font-medium mt-1">
                    {selectedEjo.namaPart}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    PIC Operator
                  </label>
                  <p className="text-white font-medium mt-1">
                    {selectedEjo.picOperator}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Status
                  </label>
                  <p className="mt-1">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400">
                      {selectedEjo.status === "MENUNGGU_KONFIRMASI"
                        ? "Menunggu Konfirmasi"
                        : selectedEjo.status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Dibuat Pada
                  </label>
                  <p className="text-white font-medium mt-1">
                    {new Date(selectedEjo.createdAt).toLocaleDateString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  setPreviewOpen(false);
                  setSelectedEjo(null);
                }}
                className="px-5 py-2 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
