"use client";

import { motion } from "framer-motion";
import {
  ATTENDANCE_MONTHLY,
  ATTENDANCE_DAILY_PERCENTAGE,
  ATTENDANCE_TREND,
} from "../mock-data";
import {
  ClipboardCheck,
  TrendingUp,
  Users,
  Clock,
  UserX,
  CalendarDays,
} from "lucide-react";

export default function AttendanceTab() {
  return (
    <div className="space-y-8">
      {/* Main Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly Attendance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-slate-800/50 border border-white/5 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Kehadiran Bulanan
              </h3>
              <p className="text-sm text-white/40 mt-1">
                {ATTENDANCE_MONTHLY.month}
              </p>
            </div>
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6 text-emerald-400" />
            </div>
          </div>

          {/* Percentage Ring */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${ATTENDANCE_MONTHLY.percentage * 2.64} 264`}
                  className="text-emerald-400"
                  initial={{ strokeDasharray: "0 264" }}
                  animate={{
                    strokeDasharray: `${ATTENDANCE_MONTHLY.percentage * 2.64} 264`,
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {ATTENDANCE_MONTHLY.percentage}%
                  </div>
                  <div className="text-xs text-white/40 mt-1">Kehadiran</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-white/5 p-4">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs text-white/40">Hadir</span>
              </div>
              <div className="text-xl font-bold text-white">
                {ATTENDANCE_MONTHLY.present}
              </div>
            </div>
            <div className="rounded-xl bg-white/5 p-4">
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs text-white/40">Terlambat</span>
              </div>
              <div className="text-xl font-bold text-white">
                {ATTENDANCE_MONTHLY.late}
              </div>
            </div>
            <div className="rounded-xl bg-white/5 p-4">
              <div className="flex items-center gap-2 text-red-400 mb-1">
                <UserX className="w-4 h-4" />
                <span className="text-xs text-white/40">Absen</span>
              </div>
              <div className="text-xl font-bold text-white">
                {ATTENDANCE_MONTHLY.absent}
              </div>
            </div>
            <div className="rounded-xl bg-white/5 p-4">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <CalendarDays className="w-4 h-4" />
                <span className="text-xs text-white/40">Cuti</span>
              </div>
              <div className="text-xl font-bold text-white">
                {ATTENDANCE_MONTHLY.leave}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Daily & Trend Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-slate-800/50 border border-white/5 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">
                Kehadiran Harian
              </h3>
              <p className="text-sm text-white/40 mt-1">Hari ini</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
          </div>

          {/* Daily Percentage */}
          <div className="text-center mb-8">
            <div className="text-5xl font-bold text-white">
              {ATTENDANCE_DAILY_PERCENTAGE}%
            </div>
            <div className="text-sm text-white/40 mt-2">
              Persentase Kehadiran Hari Ini
            </div>
          </div>

          {/* Weekly Trend */}
          <div>
            <h4 className="text-sm font-medium text-white/60 mb-4">
              Tren Minggu Ini
            </h4>
            <div className="flex items-end justify-between gap-2 h-32">
              {ATTENDANCE_TREND.map((day, i) => (
                <motion.div
                  key={day.day}
                  initial={{ height: 0 }}
                  animate={{ height: `${day.percentage}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <span className="text-xs text-white/40">
                    {day.percentage}%
                  </span>
                  <div
                    className="w-full rounded-lg bg-gradient-to-t from-blue-500 to-blue-400"
                    style={{ height: `${day.percentage}%`, minHeight: "8px" }}
                  />
                  <span className="text-xs text-white/40">{day.day}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
