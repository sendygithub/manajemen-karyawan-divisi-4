"use client";

import { useState } from "react";
import { createLeave, getLeaves } from "service/leave.service";
import { toast, useSonner } from "sonner";
import { LeaveRequest } from "@/types/type.leaverequest";

export default function EmployeeLeavePage() {
  const [open, setOpen] = useState(false);

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 1,
      leaveType: "Annual Leave",
      startDate: "2026-06-10",
      endDate: "2026-06-12",
      reason: "Family vacation",
      status: "Approved",
    },
    {
      id: 2,
      leaveType: "Sick Leave",
      startDate: "2026-06-02",
      endDate: "2026-06-03",
      reason: "Fever",
      status: "Rejected",
    },
    {
      id: 3,
      leaveType: "Personal Leave",
      startDate: "2026-06-20",
      endDate: "2026-06-21",
      reason: "Personal matters",
      status: "Pending",
    },
  ]);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await createLeave({ ...form, employeeId: "1" });

    setForm({
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
    });
  }

  function getStatusStyle(status: LeaveRequest["status"]) {
    switch (status) {
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400";

      case "Approved":
        return "bg-green-500/20 text-green-400";

      case "Rejected":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-zinc-500/20 text-zinc-400";
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Leave Requests</h1>

          <p className="text-zinc-400 text-sm">
            Request leave and monitor leave approval status
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition"
        >
          + Request Leave
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-zinc-400 text-sm">Total Requests</p>

          <h2 className="text-3xl font-bold mt-2">{leaveRequests.length}</h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-zinc-400 text-sm">Approved</p>

          <h2 className="text-3xl font-bold mt-2 text-green-400">
            {leaveRequests.filter((item) => item.status === "Approved").length}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-zinc-400 text-sm">Pending</p>

          <h2 className="text-3xl font-bold mt-2 text-yellow-400">
            {leaveRequests.filter((item) => item.status === "Pending").length}
          </h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr className="text-left">
              <th className="p-4">Leave Type</th>

              <th className="p-4">Start Date</th>

              <th className="p-4">End Date</th>

              <th className="p-4">Reason</th>

              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {leaveRequests.map((leave) => (
              <tr key={leave.id} className="border-t border-white/10">
                <td className="p-4">{leave.leaveType}</td>

                <td className="p-4">{leave.startDate}</td>

                <td className="p-4">{leave.endDate}</td>

                <td className="p-4">{leave.reason}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                      leave.status,
                    )}`}
                  >
                    {leave.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#18181b] border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Request Leave</h2>

              <button
                onClick={() => setOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-zinc-400">Leave Type</label>

                <select
                  name="leaveType"
                  value={form.leaveType}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
                  required
                >
                  <option value="">Select Leave Type</option>

                  <option value="ANNUAL">Annual Leave</option>

                  <option value="SICK">Sick Leave</option>

                  <option value="PERSONAL">Personal Leave</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-zinc-400">Start Date</label>

                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-zinc-400">End Date</label>

                <input
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-zinc-400">Reason</label>

                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  rows={4}
                  className="w-full mt-1 rounded-lg bg-zinc-900 border border-white/10 px-4 py-2 outline-none resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-white text-black py-2 font-medium hover:bg-zinc-200 transition"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
