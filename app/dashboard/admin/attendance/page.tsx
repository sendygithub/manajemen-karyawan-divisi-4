"use client";

import { useState } from "react";
import { Attendance } from "@/types/type.attendance";
import AttendanceTable from "@/components/attendance/AttendanceTable";

export default function AttendancePage() {
  const [attendanceData] = useState<Attendance[]>([
    {
      id: 1,
      name: "John Doe",
      date: "2026-06-05",
      status: "Present",
    },
    {
      id: 2,
      name: "Jane Smith",
      date: "2026-06-05",
      status: "Late",
    },
    {
      id: 3,
      name: "Michael Johnson",
      date: "2026-06-05",
      status: "Sick",
    },
    {
      id: 4,
      name: "Sarah Williams",
      date: "2026-06-05",
      status: "Leave",
    },
  ]);

  function getStatusStyle(status: Attendance["status"]) {
    switch (status) {
      case "Present":
        return "bg-green-500/20 text-green-400";

      case "Late":
        return "bg-yellow-500/20 text-yellow-400";

      case "Sick":
        return "bg-red-500/20 text-red-400";

      case "Leave":
        return "bg-blue-500/20 text-blue-400";

      default:
        return "bg-zinc-500/20 text-zinc-400";
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Attendance</h1>

          <p className="text-zinc-400 text-sm">Employee attendance records</p>
        </div>

        <button className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition">
          Export Report
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-zinc-400 text-sm">Total Employees</p>

          <h2 className="text-3xl font-bold mt-2">24</h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-zinc-400 text-sm">Present Today</p>

          <h2 className="text-3xl font-bold mt-2 text-green-400">20</h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-zinc-400 text-sm">Late</p>

          <h2 className="text-3xl font-bold mt-2 text-yellow-400">2</h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-zinc-400 text-sm">Sick / Leave</p>

          <h2 className="text-3xl font-bold mt-2 text-red-400">2</h2>
        </div>
      </div>

      {/* TABLE */}
      <AttendanceTable
        attendanceData={attendanceData}
        getStatusStyle={getStatusStyle}
      />
    </div>
  );
}
