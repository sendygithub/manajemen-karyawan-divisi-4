import LeaveTable from "@/components/leave/LeaveTable";
import { getLeaves } from "service/leave.service";
import { LeaveRequest } from "@/types/type.leaverequest";
type Props = {
  leaveRequests: LeaveRequest[];
};

export default async function LeavePage() {
  const leaves = await getLeaves();

  const leaveRequests = leaves.map((leave) => ({
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
