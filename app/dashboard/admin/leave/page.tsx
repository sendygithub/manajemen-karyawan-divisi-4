"use client";

import { useState } from "react";
import { LeaveRequest } from "@/types/type.leave";
import LeaveTable from "@/components/leave/LeaveTable";

export default function LeavePage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 1,
      employeeName: "John Doe",
      leaveType: "Annual Leave",
      startDate: "2026-06-10",
      endDate: "2026-06-12",
      reason: "Family vacation",
      status: "Pending",
    },
    {
      id: 2,
      employeeName: "Jane Smith",
      leaveType: "Sick Leave",
      startDate: "2026-06-08",
      endDate: "2026-06-09",
      reason: "Medical checkup",
      status: "Approved",
    },
    {
      id: 3,
      employeeName: "Michael Johnson",
      leaveType: "Personal Leave",
      startDate: "2026-06-15",
      endDate: "2026-06-16",
      reason: "Personal matters",
      status: "Pending",
    },
  ]);

  function updateStatus(id: number, status: "Approved" | "Rejected") {
    setLeaveRequests((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
            }
          : item,
      ),
    );
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
          <h1 className="text-2xl font-bold">Leave Requests</h1>

          <p className="text-zinc-400 text-sm">
            Manage employee leave approvals
          </p>
        </div>
      </div>

      {/* TABLE */}
      <LeaveTable
        leaveRequests={leaveRequests}
        updateStatus={updateStatus}
        getStatusStyle={getStatusStyle}
      />
    </div>
  );
}
