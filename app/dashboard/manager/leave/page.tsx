"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LeaveTable from "@/components/leave/LeaveTable";

export default function ManagerLeavePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (
      status === "authenticated" &&
      session?.user?.role !== "MANAGER" &&
      session?.user?.role !== "ADMIN"
    ) {
      router.push("/dashboard/employee");
    }
  }, [session, status, router]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  async function fetchLeaves() {
    try {
      const res = await fetch("/api/leave");
      const data = await res.json();
      // Transform data to match LeaveTable expected format
      const transformed = data.map((leave: any) => ({
        id: leave.id,
        employeeName: leave.employee?.name || "Unknown",
        leaveType: leave.leaveType,
        startDate: new Date(leave.startDate).toISOString().split("T")[0],
        endDate: new Date(leave.endDate).toISOString().split("T")[0],
        reason: leave.reason,
        status: leave.status,
      }));
      setLeaves(transformed);
    } catch (error) {
      console.error("Failed to fetch leaves:", error);
    }
  }

  if (status === "loading") {
    return <div className="text-zinc-400">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Approval Cuti</h1>
          <p className="text-zinc-400 text-sm">
            Approve atau reject pengajuan cuti karyawan
          </p>
        </div>
      </div>

      <LeaveTable leaves={leaves} />
    </div>
  );
}
