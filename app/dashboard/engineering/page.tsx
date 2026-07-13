"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Wrench, Eye, Play, CheckCircle2 } from "lucide-react";
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

export default function EngineeringDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ejos, setEjos] = useState<EjoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedEjo, setSelectedEjo] = useState<EjoData | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

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

  async function handleProses(ejoId: string) {
    setProcessingId(ejoId);
    try {
      const res = await fetch(`/api/ejo/${ejoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "SELESAI" }),
      });

      if (!res.ok) throw new Error("Gagal mengupdate status EJO");

      toast.success("EJO berhasil diproses!");
      await fetchEjos();
    } catch (error) {
      toast.error("Gagal memproses EJO");
      console.error(error);
    } finally {
      setProcessingId(null);
    }
  }

  function openPreview(ejo: EjoData) {
    setSelectedEjo(ejo);
    setPreviewOpen(true);
  }

  // Stats
  const totalEjo = ejos.length;
  const menunggu = ejos.filter(
    (e) => e.status === "MENUNGGU_KONFIRMASI",
  ).length;
  const selesai = ejos.filter((e) => e.status === "SELESAI").length;

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
          <h1 className="text-2xl font-bold">Engineering Dashboard</h1>
          <p className="text-zinc-400 text-sm">
            Monitoring dan pengelolaan E-Job Order (EJO)
          </p>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-zinc-400 text-sm">Total EJO</p>
          <h2 className="text-3xl font-bold mt-2 text-white">{totalEjo}</h2>
        </div>
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
          <p className="text-yellow-400 text-sm">Menunggu Proses</p>
          <h2 className="text-3xl font-bold mt-2 text-yellow-400">
            {menunggu}
          </h2>
        </div>
        <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">
          <p className="text-green-400 text-sm">Selesai</p>
          <h2 className="text-3xl font-bold mt-2 text-green-400">{selesai}</h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Wrench size={18} className="text-blue-400" />
            Daftar E-Job Order (EJO)
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400">
                <th className="text-left p-4 font-medium">No EJO</th>
                <th className="text-left p-4 font-medium">Employee</th>
                <th className="text-left p-4 font-medium">Department</th>
                <th className="text-left p-4 font-medium">No Mesin</th>
                <th className="text-left p-4 font-medium">Jenis Kerusakan</th>
                <th className="text-left p-4 font-medium">Jenis Perbaikan</th>
                <th className="text-left p-4 font-medium">PIC Operator</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center p-8 text-zinc-500">
                    <Loader2
                      size={32}
                      className="mx-auto mb-3 animate-spin text-zinc-600"
                    />
                    Memuat data...
                  </td>
                </tr>
              ) : ejos.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center p-8 text-zinc-500">
                    <Wrench size={40} className="mx-auto mb-3 text-zinc-600" />
                    Belum ada EJO yang dibuat.
                  </td>
                </tr>
              ) : (
                ejos.map((ejo) => (
                  <tr
                    key={ejo.id}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="p-4 font-medium">#{ejo.nomorEjo}</td>
                    <td className="p-4">{ejo.employee?.name || "Unknown"}</td>
                    <td className="p-4">{ejo.department}</td>
                    <td className="p-4">{ejo.nomorMesin}</td>
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
                    <td className="p-4">{ejo.picOperator}</td>
                    <td className="p-4">
                      {ejo.status === "MENUNGGU_KONFIRMASI" ? (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400">
                          Menunggu Konfirmasi
                        </span>
                      ) : ejo.status === "SELESAI" ? (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400">
                          Selesai
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-zinc-500/20 text-zinc-400">
                          {ejo.status}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openPreview(ejo)}
                          className="flex items-center gap-1.5 bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-500/30 transition"
                        >
                          <Eye size={14} />
                          Preview
                        </button>
                        {ejo.status === "MENUNGGU_KONFIRMASI" && (
                          <button
                            onClick={() => handleProses(ejo.id)}
                            disabled={processingId === ejo.id}
                            className="flex items-center gap-1.5 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {processingId === ejo.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Play size={14} />
                            )}
                            {processingId === ejo.id
                              ? "Memproses..."
                              : "Proses"}
                          </button>
                        )}
                        {ejo.status === "SELESAI" && (
                          <span className="flex items-center gap-1.5 text-green-500/70 px-3 py-1.5 text-xs font-medium">
                            <CheckCircle2 size={14} />
                            Selesai
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
                    Employee
                  </label>
                  <p className="text-white font-medium mt-1">
                    {selectedEjo.employee?.name || "Unknown"}
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
                    {selectedEjo.status === "MENUNGGU_KONFIRMASI" ? (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400">
                        Menunggu Konfirmasi
                      </span>
                    ) : selectedEjo.status === "SELESAI" ? (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400">
                        Selesai
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-zinc-500/20 text-zinc-400">
                        {selectedEjo.status}
                      </span>
                    )}
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

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-6">
              {selectedEjo.status === "MENUNGGU_KONFIRMASI" && (
                <button
                  onClick={() => {
                    setPreviewOpen(false);
                    setSelectedEjo(null);
                    handleProses(selectedEjo.id);
                  }}
                  disabled={processingId === selectedEjo.id}
                  className="px-5 py-2 rounded-lg bg-green-500/20 text-green-400 font-medium hover:bg-green-500/30 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {processingId === selectedEjo.id ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Play size={16} />
                  )}
                  Proses EJO
                </button>
              )}
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
