"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FileText, Plus, Pencil, Eye, Upload, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type LaporanData = {
  id: string;
  employeeId: string;
  alatUkurMeter: string;
  alatUkurBusur: string;
  inputAPB: number;
  noSpek: string;
  sudut: number;
  lebar: number;
  kodeTreatment: string;
  tanggalProduksi: string;
  expire: string;
  lebarAktual: number;
  sudutAktual: number;
  jumlahRoll: number;
  meter: number;
  createdAt: string;
  employee?: {
    name: string;
  };
};

const emptyForm = {
  alatUkurMeter: "",
  alatUkurBusur: "",
  inputAPB: "",
  noSpek: "",
  sudut: "",
  lebar: "",
  kodeTreatment: "",
  tanggalProduksi: "",
  expire: "",
  lebarAktual: "",
  sudutAktual: "",
  jumlahRoll: "",
  meter: "",
};

export default function EmployeeReportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<LaporanData | null>(
    null,
  );
  const [reports, setReports] = useState<LaporanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    fetchLaporans();
  }, []);

  async function fetchLaporans() {
    try {
      const res = await fetch("/api/laporan");
      const data = await res.json();
      setReports(data);
    } catch (error) {
      console.error("Gagal mengambil data laporan:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    setter: typeof setForm,
    currentForm: typeof form,
  ) {
    setter({
      ...currentForm,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/laporan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alatUkurMeter: form.alatUkurMeter,
          alatUkurBusur: form.alatUkurBusur,
          inputAPB: Number(form.inputAPB),
          noSpek: form.noSpek,
          sudut: Number(form.sudut),
          lebar: Number(form.lebar),
          kodeTreatment: form.kodeTreatment,
          tanggalProduksi: form.tanggalProduksi,
          expire: form.expire,
          lebarAktual: Number(form.lebarAktual),
          sudutAktual: Number(form.sudutAktual),
          jumlahRoll: Number(form.jumlahRoll),
          meter: Number(form.meter),
        }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan laporan");

      toast.success("Laporan berhasil diinput!");
      setOpen(false);
      setForm(emptyForm);
      await fetchLaporans();
    } catch (error) {
      toast.error("Gagal menyimpan laporan");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  function openEditDialog(report: LaporanData) {
    setSelectedReport(report);
    setEditForm({
      alatUkurMeter: report.alatUkurMeter,
      alatUkurBusur: report.alatUkurBusur,
      inputAPB: String(report.inputAPB),
      noSpek: report.noSpek,
      sudut: String(report.sudut),
      lebar: String(report.lebar),
      kodeTreatment: report.kodeTreatment,
      tanggalProduksi: report.tanggalProduksi
        ? report.tanggalProduksi.split("T")[0]
        : "",
      expire: report.expire ? report.expire.split("T")[0] : "",
      lebarAktual: String(report.lebarAktual),
      sudutAktual: String(report.sudutAktual),
      jumlahRoll: String(report.jumlahRoll),
      meter: String(report.meter),
    });
    setEditOpen(true);
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedReport) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/laporan/${selectedReport.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alatUkurMeter: editForm.alatUkurMeter,
          alatUkurBusur: editForm.alatUkurBusur,
          inputAPB: Number(editForm.inputAPB),
          noSpek: editForm.noSpek,
          sudut: Number(editForm.sudut),
          lebar: Number(editForm.lebar),
          kodeTreatment: editForm.kodeTreatment,
          tanggalProduksi: editForm.tanggalProduksi,
          expire: editForm.expire,
          lebarAktual: Number(editForm.lebarAktual),
          sudutAktual: Number(editForm.sudutAktual),
          jumlahRoll: Number(editForm.jumlahRoll),
          meter: Number(editForm.meter),
        }),
      });

      if (!res.ok) throw new Error("Gagal mengupdate laporan");

      toast.success("Laporan berhasil diupdate!");
      setEditOpen(false);
      setSelectedReport(null);
      setEditForm(emptyForm);
      await fetchLaporans();
    } catch (error) {
      toast.error("Gagal mengupdate laporan");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  function openPreview(report: LaporanData) {
    setSelectedReport(report);
    setPreviewOpen(true);
  }

  function handleUploadLaporan() {
    toast.success("Fitur upload laporan akan segera tersedia!");
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
          <h1 className="text-2xl font-bold">Input Laporan</h1>
          <p className="text-zinc-400 text-sm">
            Input data laporan pengukuran dan quality control
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition flex items-center gap-2"
        >
          <Plus size={18} />
          Input Laporan
        </button>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400">
                <th className="text-left p-4 font-medium">No</th>
                <th className="text-left p-4 font-medium">Alat Ukur Meter</th>
                <th className="text-left p-4 font-medium">Alat Ukur Busur</th>
                <th className="text-left p-4 font-medium">Input APB</th>
                <th className="text-left p-4 font-medium">No Spek</th>
                <th className="text-left p-4 font-medium">Sudut</th>
                <th className="text-left p-4 font-medium">Lebar</th>
                <th className="text-left p-4 font-medium">Kode Treatment</th>
                <th className="text-left p-4 font-medium">Tgl Produksi</th>
                <th className="text-left p-4 font-medium">Expire</th>
                <th className="text-left p-4 font-medium">Lebar Aktual</th>
                <th className="text-left p-4 font-medium">Sudut Aktual</th>
                <th className="text-left p-4 font-medium">Jumlah Roll</th>
                <th className="text-left p-4 font-medium">Meter</th>
                <th className="text-left p-4 font-medium">Tanggal</th>
                <th className="text-left p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={16} className="text-center p-8 text-zinc-500">
                    <Loader2
                      size={32}
                      className="mx-auto mb-3 animate-spin text-zinc-600"
                    />
                    Memuat data...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={16} className="text-center p-8 text-zinc-500">
                    <FileText
                      size={40}
                      className="mx-auto mb-3 text-zinc-600"
                    />
                    Belum ada laporan. Klik &quot;Input Laporan&quot; untuk menambahkan.
                  </td>
                </tr>
              ) : (
                reports.map((report, index) => (
                  <tr
                    key={report.id}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">{report.alatUkurMeter}</td>
                    <td className="p-4">{report.alatUkurBusur}</td>
                    <td className="p-4">{report.inputAPB}</td>
                    <td className="p-4">{report.noSpek}</td>
                    <td className="p-4">{report.sudut}</td>
                    <td className="p-4">{report.lebar}</td>
                    <td className="p-4">{report.kodeTreatment}</td>
                    <td className="p-4">
                      {new Date(report.tanggalProduksi).toLocaleDateString(
                        "id-ID",
                      )}
                    </td>
                    <td className="p-4">
                      {new Date(report.expire).toLocaleDateString("id-ID")}
                    </td>
                    <td className="p-4">{report.lebarAktual}</td>
                    <td className="p-4">{report.sudutAktual}</td>
                    <td className="p-4">{report.jumlahRoll}</td>
                    <td className="p-4">{report.meter}</td>
                    <td className="p-4 text-zinc-400 text-xs">
                      {new Date(report.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditDialog(report)}
                          className="flex items-center gap-1.5 bg-yellow-500/20 text-yellow-400 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-yellow-500/30 transition"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => openPreview(report)}
                          className="flex items-center gap-1.5 bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-500/30 transition"
                        >
                          <Eye size={14} />
                          Preview
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* BUTTONS BELOW TABLE */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={() => openPreview(reports[0])}
          disabled={reports.length === 0}
          className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-5 py-2.5 rounded-lg font-medium hover:bg-blue-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Eye size={18} />
          Preview Laporan
        </button>
        <button
          onClick={handleUploadLaporan}
          className="flex items-center gap-2 bg-green-500/20 text-green-400 px-5 py-2.5 rounded-lg font-medium hover:bg-green-500/30 transition"
        >
          <Upload size={18} />
          Upload Laporan
        </button>
      </div>

      {/* MODAL DIALOG - INPUT */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#18181b] border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Input Laporan</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-zinc-400">
                    Alat Ukur Meter
                  </label>
                  <input
                    type="text"
                    name="alatUkurMeter"
                    value={form.alatUkurMeter}
                    onChange={(e) => handleChange(e, setForm, form)}
                    placeholder="Masukkan alat ukur meter"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">
                    Alat Ukur Busur
                  </label>
                  <input
                    type="text"
                    name="alatUkurBusur"
                    value={form.alatUkurBusur}
                    onChange={(e) => handleChange(e, setForm, form)}
                    placeholder="Masukkan alat ukur busur"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Input APB</label>
                  <input
                    type="number"
                    name="inputAPB"
                    value={form.inputAPB}
                    onChange={(e) => handleChange(e, setForm, form)}
                    placeholder="Masukkan input APB"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">No Spek</label>
                  <input
                    type="text"
                    name="noSpek"
                    value={form.noSpek}
                    onChange={(e) => handleChange(e, setForm, form)}
                    placeholder="Masukkan no spek"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Sudut</label>
                  <input
                    type="number"
                    name="sudut"
                    value={form.sudut}
                    onChange={(e) => handleChange(e, setForm, form)}
                    placeholder="Masukkan sudut"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Lebar</label>
                  <input
                    type="number"
                    name="lebar"
                    value={form.lebar}
                    onChange={(e) => handleChange(e, setForm, form)}
                    placeholder="Masukkan lebar"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">
                    Kode Treatment/Grub
                  </label>
                  <input
                    type="text"
                    name="kodeTreatment"
                    value={form.kodeTreatment}
                    onChange={(e) => handleChange(e, setForm, form)}
                    placeholder="Masukkan kode treatment/grub"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">
                    Tanggal Produksi
                  </label>
                  <input
                    type="date"
                    name="tanggalProduksi"
                    value={form.tanggalProduksi}
                    onChange={(e) => handleChange(e, setForm, form)}
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Expire</label>
                  <input
                    type="date"
                    name="expire"
                    value={form.expire}
                    onChange={(e) => handleChange(e, setForm, form)}
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Lebar Aktual</label>
                  <input
                    type="number"
                    name="lebarAktual"
                    value={form.lebarAktual}
                    onChange={(e) => handleChange(e, setForm, form)}
                    placeholder="Masukkan lebar aktual"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Sudut Aktual</label>
                  <input
                    type="number"
                    name="sudutAktual"
                    value={form.sudutAktual}
                    onChange={(e) => handleChange(e, setForm, form)}
                    placeholder="Masukkan sudut aktual"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Jumlah Roll</label>
                  <input
                    type="number"
                    name="jumlahRoll"
                    value={form.jumlahRoll}
                    onChange={(e) => handleChange(e, setForm, form)}
                    placeholder="Masukkan jumlah roll"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Meter</label>
                  <input
                    type="number"
                    name="meter"
                    value={form.meter}
                    onChange={(e) => handleChange(e, setForm, form)}
                    placeholder="Masukkan meter"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
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
                  {submitting ? "Menyimpan..." : "Simpan Laporan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DIALOG - EDIT */}
      {editOpen && selectedReport && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#18181b] border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Edit Laporan - {selectedReport.noSpek}
              </h2>
              <button
                onClick={() => {
                  setEditOpen(false);
                  setSelectedReport(null);
                  setEditForm(emptyForm);
                }}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-zinc-400">
                    Alat Ukur Meter
                  </label>
                  <input
                    type="text"
                    name="alatUkurMeter"
                    value={editForm.alatUkurMeter}
                    onChange={(e) => handleChange(e, setEditForm, editForm)}
                    placeholder="Masukkan alat ukur meter"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">
                    Alat Ukur Busur
                  </label>
                  <input
                    type="text"
                    name="alatUkurBusur"
                    value={editForm.alatUkurBusur}
                    onChange={(e) => handleChange(e, setEditForm, editForm)}
                    placeholder="Masukkan alat ukur busur"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Input APB</label>
                  <input
                    type="number"
                    name="inputAPB"
                    value={editForm.inputAPB}
                    onChange={(e) => handleChange(e, setEditForm, editForm)}
                    placeholder="Masukkan input APB"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">No Spek</label>
                  <input
                    type="text"
                    name="noSpek"
                    value={editForm.noSpek}
                    onChange={(e) => handleChange(e, setEditForm, editForm)}
                    placeholder="Masukkan no spek"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Sudut</label>
                  <input
                    type="number"
                    name="sudut"
                    value={editForm.sudut}
                    onChange={(e) => handleChange(e, setEditForm, editForm)}
                    placeholder="Masukkan sudut"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Lebar</label>
                  <input
                    type="number"
                    name="lebar"
                    value={editForm.lebar}
                    onChange={(e) => handleChange(e, setEditForm, editForm)}
                    placeholder="Masukkan lebar"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">
                    Kode Treatment/Grub
                  </label>
                  <input
                    type="text"
                    name="kodeTreatment"
                    value={editForm.kodeTreatment}
                    onChange={(e) => handleChange(e, setEditForm, editForm)}
                    placeholder="Masukkan kode treatment/grub"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">
                    Tanggal Produksi
                  </label>
                  <input
                    type="date"
                    name="tanggalProduksi"
                    value={editForm.tanggalProduksi}
                    onChange={(e) => handleChange(e, setEditForm, editForm)}
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Expire</label>
                  <input
                    type="date"
                    name="expire"
                    value={editForm.expire}
                    onChange={(e) => handleChange(e, setEditForm, editForm)}
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Lebar Aktual</label>
                  <input
                    type="number"
                    name="lebarAktual"
                    value={editForm.lebarAktual}
                    onChange={(e) => handleChange(e, setEditForm, editForm)}
                    placeholder="Masukkan lebar aktual"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Sudut Aktual</label>
                  <input
                    type="number"
                    name="sudutAktual"
                    value={editForm.sudutAktual}
                    onChange={(e) => handleChange(e, setEditForm, editForm)}
                    placeholder="Masukkan sudut aktual"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Jumlah Roll</label>
                  <input
                    type="number"
                    name="jumlahRoll"
                    value={editForm.jumlahRoll}
                    onChange={(e) => handleChange(e, setEditForm, editForm)}
                    placeholder="Masukkan jumlah roll"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400">Meter</label>
                  <input
                    type="number"
                    name="meter"
                    value={editForm.meter}
                    onChange={(e) => handleChange(e, setEditForm, editForm)}
                    placeholder="Masukkan meter"
                    className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none focus:border-white/30"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setEditOpen(false);
                    setSelectedReport(null);
                    setEditForm(emptyForm);
                  }}
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
                  {submitting ? "Menyimpan..." : "Update Laporan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DIALOG - PREVIEW */}
      {previewOpen && selectedReport && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#18181b] border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Preview Laporan - {selectedReport.noSpek}
              </h2>
              <button
                onClick={() => {
                  setPreviewOpen(false);
                  setSelectedReport(null);
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
                    Alat Ukur Meter
                  </label>
                  <p className="text-white font-medium mt-1">
                    {selectedReport.alatUkurMeter}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Alat Ukur Busur
                  </label>
                  <p className="text-white font-medium mt-1">
                    {selectedReport.alatUkurBusur}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Input APB
                  </label>
                  <p className="text-white font-medium mt-1">
                    {selectedReport.inputAPB}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    No Spek
                  </label>
                  <p className="text-white font-medium mt-1">
                    {selectedReport.noSpek}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Sudut
                  </label>
                  <p className="text-white font-medium mt-1">
                    {selectedReport.sudut}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Lebar
                  </label>
                  <p className="text-white font-medium mt-1">
                    {selectedReport.lebar}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Kode Treatment/Grub
                  </label>
                  <p className="text-white font-medium mt-1">
                    {selectedReport.kodeTreatment}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Tanggal Produksi
                  </label>
                  <p className="text-white font-medium mt-1">
                    {new Date(
                      selectedReport.tanggalProduksi,
                    ).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Expire
                  </label>
                  <p className="text-white font-medium mt-1">
                    {new Date(selectedReport.expire).toLocaleDateString(
                      "id-ID",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Lebar Aktual
                  </label>
                  <p className="text-white font-medium mt-1">
                    {selectedReport.lebarAktual}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Sudut Aktual
                  </label>
                  <p className="text-white font-medium mt-1">
                    {selectedReport.sudutAktual}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Jumlah Roll
                  </label>
                  <p className="text-white font-medium mt-1">
                    {selectedReport.jumlahRoll}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Meter
                  </label>
                  <p className="text-white font-medium mt-1">
                    {selectedReport.meter}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider">
                    Dibuat Pada
                  </label>
                  <p className="text-white font-medium mt-1">
                    {new Date(selectedReport.createdAt).toLocaleDateString(
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
                  setSelectedReport(null);
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
