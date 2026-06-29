"use client";

import { motion } from "framer-motion";
import { LEAVE_SUMMARY, RECENT_LEAVE_REQUESTS } from "../mock-data";
import {
  CalendarCheck,
  Clock,
  XCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const statusConfig = {
  APPROVED: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    label: "Disetujui",
  },
  PENDING: {
    icon: Clock,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    label: "Pending",
  },
  REJECTED: {
    icon: XCircle,
    color: "text-red-400",
    bg: "bg-red-500/10",
    label: "Ditolak",
  },
};

export default function LeaveTab() {
  return (
    <div className="space-y-8">
      {/* Leave Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {LEAVE_SUMMARY.map((item, i) => {
          const config = statusConfig[item.status];
          const Icon = config.icon;
          return (
            <motion.div
              key={item.status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl ${config.bg} border border-white/5 p-6`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-8 h-8 ${config.color}`} />
                <span className="text-3xl font-bold text-white">
                  {item.count}
                </span>
              </div>
              <div className={`text-sm mt-2 ${config.color}`}>
                {config.label}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Leave Requests Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-slate-800/50 border border-white/5 overflow-hidden"
      >
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Pengajuan Cuti Terbaru
              </h3>
              <p className="text-sm text-white/40 mt-1">
                Status pengajuan cuti karyawan Divisi 4
              </p>
            </div>
            <CalendarCheck className="w-5 h-5 text-white/30" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-white/40 font-medium">
                  Karyawan
                </th>
                <th className="text-left p-4 text-white/40 font-medium">
                  Dept.
                </th>
                <th className="text-left p-4 text-white/40 font-medium">
                  Jenis Cuti
                </th>
                <th className="text-left p-4 text-white/40 font-medium">
                  Tanggal
                </th>
                <th className="text-right p-4 text-white/40 font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {RECENT_LEAVE_REQUESTS.map((req, i) => {
                const config = statusConfig[req.status];
                const StatusIcon = config.icon;
                return (
                  <motion.tr
                    key={req.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4">
                      <span className="text-white font-medium">
                        {req.employee}
                      </span>
                    </td>
                    <td className="p-4 text-white/60">{req.department}</td>
                    <td className="p-4 text-white/60">{req.type}</td>
                    <td className="p-4 text-white/60">
                      {req.startDate} — {req.endDate}
                    </td>
                    <td className="p-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {config.label}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Leave Form Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/20 p-6"
      >
        <div className="flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-white font-medium">Ajukan Cuti Baru</h4>
            <p className="text-sm text-white/50 mt-1">
              Untuk mengajukan cuti, silakan masuk ke halaman{" "}
              <strong className="text-white/70">Manajemen Cuti</strong> di
              dashboard admin atau hubungi HRD divisi Anda.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
