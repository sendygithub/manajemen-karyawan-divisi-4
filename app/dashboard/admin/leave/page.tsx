import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "lib/auth";
import { prisma } from "lib/prisma";
import LeaveTable from "@/components/leave/LeaveTable";
import { LeaveRequest } from "@/types/type.leaverequest";

export default async function LeavePage() {
  // Guard: halaman ini khusus ADMIN/HR/MANAGER (seksi /dashboard/admin dilindungi
  // layout admin, guard tambahan di sini untuk keamanan berlapis).
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard/employee");
  }

  // Server component: akses database langsung, tidak lewat fetch.
  const leaves = await prisma.leave.findMany({
    include: {
      employee: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const leaveRequests: LeaveRequest[] = leaves.map((leave) => ({
    id: leave.id,
    employeeName: leave.employee.name,
    leaveType: leave.leaveType,
    startDate: leave.startDate.toISOString().split("T")[0],
    endDate: leave.endDate.toISOString().split("T")[0],
    reason: leave.reason,
    status: leave.status,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Leave Requests</h1>

          <p className="text-zinc-400 text-sm">
            Manage employee leave approvals
          </p>
        </div>
      </div>

      <LeaveTable leaves={leaveRequests} />
    </div>
  );
}
