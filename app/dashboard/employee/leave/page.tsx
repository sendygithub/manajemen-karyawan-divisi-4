"use client";

import { useEffect, useState } from "react";
import { createLeave, getLeaves } from "service/leave.service";
import { toast, useSonner } from "sonner";
import { LeaveRequest } from "@/types/type.leaverequest";
import LeaveDialog from "@/components/leave/LeaveDialog";
import LeaveTableEmployee from "@/components/leave/LeaveTable";

export default function EmployeeLeavePage() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [leaves, setLeaves] = useState([]);

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

  useEffect(() => {
    fetchLeave();
  }, []);

  async function fetchLeave() {
    const response = await fetch("/api/leave");
    const data = await response.json();

    setLeaves(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setIsLoading(true);
    await createLeave({ ...form, employeeId: "1" });
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

  async function fetchLeaves() {
    const res = await fetch("/api/leave");

    const data = await res.json();

    setLeaves(data);
  }

  useEffect(() => {
    fetchLeaves();
  }, []);

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
      <LeaveTableEmployee leaves={leaves} />

      {/* MODAL */}
      <LeaveDialog
        open={open}
        setOpen={setOpen}
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

type DialogProps = {
  open: boolean;
  onClose: () => void;
  form: {
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
  };
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onSubmit: (e: React.FormEvent) => Promise<void> | void;
};

function EmployeeLeavePageDialog({
  open,
  onClose,
  form,
  onChange,
  onSubmit,
}: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white/5 rounded-2xl p-6 w-full max-w-lg">
        <h3 className="text-lg font-bold mb-4">Request Leave</h3>

        <form onSubmit={onSubmit} className="space-y-3">
          <select
            name="leaveType"
            value={form.leaveType}
            onChange={onChange}
            className="w-full p-2 rounded"
          >
            <option value="">Select leave type</option>
            <option>Annual Leave</option>
            <option>Sick Leave</option>
            <option>Personal Leave</option>
          </select>

          <input
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={onChange}
            className="w-full p-2 rounded"
          />

          <input
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={onChange}
            className="w-full p-2 rounded"
          />

          <textarea
            name="reason"
            value={form.reason}
            onChange={onChange}
            className="w-full p-2 rounded"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-white text-black"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
