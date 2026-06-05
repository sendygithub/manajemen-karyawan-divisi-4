"use client";

import { useState } from "react";

type AttendanceHistory = {
  id: number;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "Present" | "Late";
};

export default function EmployeeAttendancePage() {
  const [checkedIn, setCheckedIn] = useState(false);

  const [checkedOut, setCheckedOut] = useState(false);

  const [todayStatus, setTodayStatus] = useState("Not Checked In");

  const [history, setHistory] = useState<AttendanceHistory[]>([
    {
      id: 1,
      date: "2026-06-04",
      checkIn: "08:01",
      checkOut: "17:00",
      status: "Present",
    },
    {
      id: 2,
      date: "2026-06-03",
      checkIn: "08:30",
      checkOut: "17:05",
      status: "Late",
    },
  ]);

  function handleCheckIn() {
    setCheckedIn(true);
    setTodayStatus("Present");
  }

  function handleCheckOut() {
    setCheckedOut(true);

    const newAttendance: AttendanceHistory = {
      id: Date.now(),
      date: "2026-06-05",
      checkIn: "08:00",
      checkOut: "17:00",
      status: "Present",
    };

    setHistory([newAttendance, ...history]);
  }

  function getStatusStyle(status: AttendanceHistory["status"]) {
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
    <div>
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Attendance</h1>

        <p className="text-zinc-400 text-sm">
          Manage your attendance and view attendance history
        </p>
      </div>

      {/* TODAY STATUS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-zinc-400 text-sm">Today Status</p>

          <h2 className="text-2xl font-bold mt-2">{todayStatus}</h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-zinc-400 text-sm">Check In</p>

          <h2 className="text-2xl font-bold mt-2">
            {checkedIn ? "08:00" : "-- : --"}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-zinc-400 text-sm">Check Out</p>

          <h2 className="text-2xl font-bold mt-2">
            {checkedOut ? "17:00" : "-- : --"}
          </h2>
        </div>
      </div>

      {/* ACTION BUTTON */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleCheckIn}
          disabled={checkedIn}
          className={`px-6 py-3 rounded-xl font-medium transition ${
            checkedIn
              ? "bg-zinc-700 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {checkedIn ? "Already Checked In" : "Check In"}
        </button>

        <button
          onClick={handleCheckOut}
          disabled={!checkedIn || checkedOut}
          className={`px-6 py-3 rounded-xl font-medium transition ${
            !checkedIn || checkedOut
              ? "bg-zinc-700 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {checkedOut ? "Already Checked Out" : "Check Out"}
        </button>
      </div>

      {/* HISTORY TABLE */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
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
            {history.map((item) => (
              <tr key={item.id} className="border-t border-white/10">
                <td className="p-4">{item.date}</td>

                <td className="p-4">{item.checkIn}</td>

                <td className="p-4">{item.checkOut}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                      item.status,
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
