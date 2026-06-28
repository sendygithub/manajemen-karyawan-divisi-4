"use client";

import { useRef } from "react";
import { ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";
import type { PayrollDetail } from "@/types/type.payroll";

type Props = {
  payroll: PayrollDetail;
};

const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export default function PayrollSlip({ payroll }: Props) {
  const slipRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const content = slipRef.current?.innerHTML;
    if (!content) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Slip Gaji - ${payroll.employeeName}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            color: #1a1a2e;
            margin: 0;
            padding: 40px;
          }
          .header {
            text-align: center;
            border-bottom: 3px double #1a1a2e;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 { margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px; }
          .header p { margin: 5px 0 0; color: #555; font-size: 14px; }
          .info-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
          }
          .info-section div { flex: 1; }
          .info-section h3 { margin: 0 0 10px; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
          .info-section p { margin: 4px 0; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #dee2e6; font-size: 14px; }
          th { background: #1a1a2e; color: white; font-weight: 600; }
          tr:nth-child(even) { background: #f8f9fa; }
          .total-row td { font-weight: bold; font-size: 16px; background: #e9ecef; }
          .amount { text-align: right; font-family: 'Courier New', monospace; }
          .footer {
            margin-top: 40px;
            text-align: right;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
          }
          .footer p { margin: 3px 0; font-size: 13px; color: #666; }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
          }
          .status-paid { background: #d4edda; color: #155724; }
          .status-pending { background: #fff3cd; color: #856404; }
          .notes { margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 8px; font-size: 13px; }
        </style>
      </head>
      <body>
        ${content}
        <script>
          window.onload = function() { window.print(); window.close(); }
        <\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const periodLabel = `${MONTHS[payroll.month - 1]} ${payroll.year}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/admin/payroll"
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft size={20} />
          <span>Back to Payroll</span>
        </Link>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
        >
          <Printer size={18} />
          <span>Export / Print PDF</span>
        </button>
      </div>

      {/* Slip Gaji */}
      <div
        ref={slipRef}
        className="rounded-2xl border border-white/10 bg-white/5 p-8"
      >
        {/* Header */}
        <div className="text-center border-b border-white/10 pb-6 mb-8">
          <h1 className="text-3xl font-bold tracking-wider uppercase">
            SLIP GAJI
          </h1>
          <p className="text-zinc-400 mt-1">Periode: {periodLabel}</p>
        </div>

        {/* Employee Info */}
        <div className="grid grid-cols-2 gap-8 mb-8 p-6 rounded-xl bg-black/20">
          <div>
            <h3 className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
              Data Karyawan
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Nama</span>
                <span className="font-medium">{payroll.employeeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Posisi</span>
                <span>{payroll.employeePosition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Department</span>
                <span>{payroll.departmentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Jenis Kelamin</span>
                <span>{payroll.employeeGender ?? "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Tanggal Bergabung</span>
                <span>{formatDate(payroll.employeeJoinDate)}</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
              Informasi Pembayaran
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Status</span>
                <span
                  className={`px-3 py-0.5 rounded-full text-sm font-medium ${
                    payroll.status === "PAID"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {payroll.status === "PAID" ? "LUNAS" : "PENDING"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Tanggal Dibayar</span>
                <span>{formatDate(payroll.paidAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">No. Telepon</span>
                <span>{payroll.employeePhone ?? "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Bank</span>
                <span>{payroll.employeeBankName ?? "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">No. Rekening</span>
                <span>{payroll.employeeBankAccount ?? "-"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Salary Details Table */}
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-zinc-400 font-medium">
                Deskripsi
              </th>
              <th className="text-right p-4 text-zinc-400 font-medium">
                Jumlah (Rp)
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/10">
              <td className="p-4">Gaji Pokok</td>
              <td className="p-4 text-right font-mono">
                {payroll.baseSalary.toLocaleString("id-ID")}
              </td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="p-4">Tunjangan</td>
              <td className="p-4 text-right font-mono text-green-400">
                + {payroll.allowance.toLocaleString("id-ID")}
              </td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="p-4">Bonus</td>
              <td className="p-4 text-right font-mono text-green-400">
                + {payroll.bonus.toLocaleString("id-ID")}
              </td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="p-4">Potongan</td>
              <td className="p-4 text-right font-mono text-red-400">
                - {payroll.deduction.toLocaleString("id-ID")}
              </td>
            </tr>
            <tr className="bg-white/5">
              <td className="p-4 font-bold text-lg">Total Gaji</td>
              <td className="p-4 text-right font-bold text-lg font-mono text-white">
                Rp {payroll.totalSalary.toLocaleString("id-ID")}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Notes */}
        {payroll.notes && (
          <div className="mt-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-sm text-yellow-400">
              <span className="font-semibold">Catatan:</span> {payroll.notes}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-right">
          <p className="text-zinc-500 text-sm">
            Slip gaji ini digenerate secara otomatis pada{" "}
            {formatDate(payroll.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
