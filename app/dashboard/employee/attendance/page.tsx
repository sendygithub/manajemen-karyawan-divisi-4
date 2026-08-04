"use client";

import AttendanceTable from "@/components/attendance/AttendanceTable";

import { toast } from "sonner";
import { Attendance } from "@/types/type.attendance";
import { useEffect, useState } from "react";

export default function EmployeeAttendancePage() {
  const [todayStatus, setTodayStatus] = useState("Not Checked In");

  const [checkInTime, setCheckInTime] = useState("");

  const [checkOutTime, setCheckOutTime] = useState("");

  const [checkedIn, setCheckedIn] = useState(false);

  const [checkedOut, setCheckedOut] = useState(false);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);
  useEffect(() => {
    fetchAttendanceHistory();
  }, []);

  async function fetchAttendanceHistory() {
    try {
      const response = await fetch("/api/attendance/my");

      const data = await response.json();

      setAttendanceData(data);

      if (data.length > 0) {
        const latest = data[0];

        if (latest.checkIn) {
          setCheckedIn(true);

          setCheckInTime(
            new Date(latest.checkIn).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          );
        }

        if (latest.checkOut) {
          setCheckedOut(true);

          setCheckOutTime(
            new Date(latest.checkOut).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          );
        }

        setTodayStatus(latest.status);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleCheckIn() {
    try {
      const response = await fetch("/api/attendance/check-in", {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      console.log(result);

      setCheckInTime(
        new Date(result.data.checkIn).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );

      console.log("SET TIME:", result.data.checkIn);

      setCheckedIn(true);
      setTodayStatus("Present");

      toast.success("Check In Successful");
      await fetchAttendanceHistory();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Check In gagal");
    }
  }

  async function handleCheckOut() {
    try {
      const response = await fetch("/api/attendance/check-out", {
        method: "POST",
      });

      const result = await response.json();

      console.log("RESULT:", result);

      if (!response.ok) {
        throw new Error(result.message);
      }

      setCheckedOut(true);

      setCheckOutTime(
        new Date(result.data.checkOut).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );

      console.log("SET TIME:", result.data.checkOut);

      toast.success("Check Out Successful");
      await fetchAttendanceHistory();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Check Out gagal");
    }
  }

  function getStatusStyle(status: Attendance["status"] | "ABSENT") {
    switch (status) {
      case "PRESENT":
        return "bg-green-500/20 text-green-400";

      case "LATE":
        return "bg-yellow-500/20 text-yellow-400";

      case "ABSENT":
        return "bg-red-500/20 text-red-400";

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
            {checkedIn ? checkInTime : "-- : --"}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-zinc-400 text-sm">Check Out</p>
          <h2 className="text-2xl font-bold mt-2">
            {checkedOut ? checkOutTime : "-- : --"}
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

      <AttendanceTable attendanceData={attendanceData} />
    </div>
  );
}
