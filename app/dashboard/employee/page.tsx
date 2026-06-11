"use client";

import { useSession } from "next-auth/react";

export default function EmployeeDashboardPage() {
  const { data: session } = useSession();
  const attendanceHistory = [
    {
      id: 1,
      date: "2026-06-04",
      checkIn: "08:00",
      checkOut: "17:00",
      status: "Present",
    },
    {
      id: 2,
      date: "2026-06-03",
      checkIn: "08:20",
      checkOut: "17:05",
      status: "Late",
    },
    {
      id: 3,
      date: "2026-06-02",
      checkIn: "08:01",
      checkOut: "17:00",
      status: "Present",
    },
  ];

  function getStatusStyle(status: string) {
    switch (status) {
      case "Present":
        return "bg-green-500/20 text-green-400";

      case "Late":
        return "bg-yellow-500/20 text-yellow-400";

      default:
        return "bg-zinc-500/20 text-zinc-400";
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>

        <p className="text-zinc-400 mt-2">
          selamat datang kembali, {session?.user?.name || "Employee"}!
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-zinc-400 text-sm">Today Status</p>

          <h2 className="text-3xl font-bold mt-3 text-green-400">Present</h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-zinc-400 text-sm">Check In</p>

          <h2 className="text-3xl font-bold mt-3">08:00</h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-zinc-400 text-sm">Remaining Leave</p>

          <h2 className="text-3xl font-bold mt-3 text-blue-400">8 Days</h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-zinc-400 text-sm">This Month Attendance</p>

          <h2 className="text-3xl font-bold mt-3 text-purple-400">96%</h2>
        </div>
      </div>

      {/* QUICK ACTION */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold mb-5">Quick Actions</h2>

        <div className="flex gap-4">
          <button className="rounded-xl bg-green-500 px-5 py-3 font-medium hover:bg-green-600 transition">
            Check In
          </button>

          <button className="rounded-xl bg-red-500 px-5 py-3 font-medium hover:bg-red-600 transition">
            Check Out
          </button>

          <button className="rounded-xl bg-white text-black px-5 py-3 font-medium hover:bg-zinc-200 transition">
            Request Leave
          </button>
        </div>
      </div>

      {/* ATTENDANCE HISTORY */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Attendance History</h2>

          <button className="text-sm text-zinc-400 hover:text-white">
            View All
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr className="text-left">
                <th className="p-4">Date</th>

                <th className="p-4">Check In</th>

                <th className="p-4">Check Out</th>

                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {attendanceHistory.map((attendance) => (
                <tr key={attendance.id} className="border-t border-white/10">
                  <td className="p-4">{attendance.date}</td>

                  <td className="p-4">{attendance.checkIn}</td>

                  <td className="p-4">{attendance.checkOut}</td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                        attendance.status,
                      )}`}
                    >
                      {attendance.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
