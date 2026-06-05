import { LeaveRequest } from "@/types/type.leave";
export default function LeaveTable({
  leaveRequests,
  updateStatus,
  getStatusStyle,
}: {
  leaveRequests: LeaveRequest[];
  updateStatus: (id: number, status: "Approved" | "Rejected") => void;
  getStatusStyle: (status: LeaveRequest["status"]) => string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <table className="w-full">
        <thead className="bg-white/5">
          <tr className="text-left">
            <th className="p-4">Employee</th>
            <th className="p-4">Leave Type</th>
            <th className="p-4">Start Date</th>
            <th className="p-4">End Date</th>
            <th className="p-4">Reason</th>
            <th className="p-4">Status</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {leaveRequests.map((leave) => (
            <tr key={leave.id} className="border-t border-white/10">
              <td className="p-4">{leave.employeeName}</td>

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

              <td className="p-4">
                {leave.status === "Pending" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(leave.id, "Approved")}
                      className="px-3 py-1 rounded-lg bg-green-500 text-white text-sm hover:bg-green-600 transition"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(leave.id, "Rejected")}
                      className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <span className="text-zinc-500 text-sm">Completed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
