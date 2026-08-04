"use client";

import AttendanceTable from "@/components/attendance/AttendanceTable";
import { toast } from "sonner";
import { Attendance } from "@/types/type.attendance";
import { useEffect, useState } from "react";
import { Session } from "next-auth";
import LeaveDialog from "@/components/leave/LeaveDialog";
import { createLeave } from "service/leave.service";

type LeaveForm = {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
};

export default function EmployeeDashboardPage() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [todayStatus, setTodayStatus] = useState("Not Checked In");

  const [checkInTime, setCheckInTime] = useState("");

  const [checkOutTime, setCheckOutTime] = useState("");

  const [checkedIn, setCheckedIn] = useState(false);

  const [checkedOut, setCheckedOut] = useState(false);
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);

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

  useEffect(() => {
    const run = async () => {
      await fetchAttendanceHistory();
    };
    run();
  }, []);

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

  const [form, setForm] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function fetchLeave() {
    const response = await fetch("/api/leave");
    const data = await response.json();

    setLeaves(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setIsLoading(true);
    await createLeave(form);
    toast.success("Leave request submitted successfully");
    // tutup dialog
    setOpen(false);
    // REFRESH TABLE
    await fetchLeave();

    setForm({
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
    });
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Employee Dashboard</h1>

        <p className="text-zinc-400 mt-2">selamat datang kembali,</p>
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

          <button
            onClick={() => setOpen(true)}
            className="rounded-xl bg-white text-black px-5 py-3 font-medium hover:bg-zinc-200 transition"
          >
            Request Leave
          </button>
          <LeaveDialog
            open={open}
            setOpen={setOpen}
            form={form}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
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

        <AttendanceTable attendanceData={attendanceData} />
      </div>
    </div>
  );
}
