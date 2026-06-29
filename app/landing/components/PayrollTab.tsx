"use client";

import { motion } from "framer-motion";
import { PAYROLL_THIS_MONTH } from "../mock-data";
import {
  Wallet,
  Banknote,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
} from "lucide-react";

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PayrollTab() {
  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <PayrollSummaryCard
          icon={Banknote}
          label="Total Penggajian"
          value={formatRupiah(PAYROLL_THIS_MONTH.totalAmount)}
          color="blue"
          delay={0}
        />
        <PayrollSummaryCard
          icon={CheckCircle2}
          label="Dibayar"
          value={String(PAYROLL_THIS_MONTH.paid)}
          sublabel={`dari ${PAYROLL_THIS_MONTH.totalSlips} slip`}
          color="emerald"
          delay={0.05}
        />
        <PayrollSummaryCard
          icon={Clock}
          label="Pending"
          value={String(PAYROLL_THIS_MONTH.pending)}
          color="amber"
          delay={0.1}
        />
        <PayrollSummaryCard
          icon={TrendingUp}
          label="Rata-rata Gaji"
          value={formatRupiah(PAYROLL_THIS_MONTH.averageSalary)}
          color="violet"
          delay={0.15}
        />
      </div>

      {/* Payroll Status Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-slate-800/50 border border-white/5 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Status Slip Gaji {PAYROLL_THIS_MONTH.month}
            </h3>
            <p className="text-sm text-white/40 mt-1">
              Ringkasan penggajian Divisi 4 periode {PAYROLL_THIS_MONTH.month}
            </p>
          </div>
          <Wallet className="w-5 h-5 text-white/30" />
        </div>

        {/* Progress Bar */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/60">Progress Pembayaran</span>
              <span className="text-white font-medium">
                {Math.round(
                  (PAYROLL_THIS_MONTH.paid / PAYROLL_THIS_MONTH.totalSlips) *
                    100,
                )}
                %
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    (PAYROLL_THIS_MONTH.paid / PAYROLL_THIS_MONTH.totalSlips) *
                    100
                  }%`,
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              />
            </div>
          </div>

          {/* Detail Stats */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/5 p-5">
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm text-white/60">Sudah Dibayar</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {PAYROLL_THIS_MONTH.paid}
              </div>
              <div className="text-xs text-white/40 mt-1">
                slip gaji telah diproses
              </div>
            </div>
            <div className="rounded-xl bg-white/5 p-5">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm text-white/60">Menunggu</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {PAYROLL_THIS_MONTH.pending}
              </div>
              <div className="text-xs text-white/40 mt-1">
                slip gaji belum diproses
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/20 p-5">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-sm text-white/60">Total Karyawan</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {PAYROLL_THIS_MONTH.totalSlips} Karyawan
            </div>
            <div className="text-xs text-white/40 mt-1">
              total penerima gaji Divisi 4
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function PayrollSummaryCard({
  icon: Icon,
  label,
  value,
  sublabel,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sublabel?: string;
  color: "blue" | "emerald" | "amber" | "violet";
  delay: number;
}) {
  const colorMap = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400",
    emerald:
      "from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 text-emerald-400",
    amber:
      "from-amber-500/20 to-amber-600/10 border-amber-500/20 text-amber-400",
    violet:
      "from-violet-500/20 to-violet-600/10 border-violet-500/20 text-violet-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-xl bg-gradient-to-br ${colorMap[color]} p-5 border`}
    >
      <Icon className="w-5 h-5 mb-3" />
      <div className="text-lg font-bold text-white truncate" title={value}>
        {value}
      </div>
      <div className="text-xs text-white/50 mt-1">{label}</div>
      {sublabel && (
        <div className="text-xs text-white/30 mt-0.5">{sublabel}</div>
      )}
    </motion.div>
  );
}
