type Leave = {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

type Props = {
  leaves: Leave[];
};

export default function LeaveTableEmployee({ leaves }: Props) {
  function getStatusStyle(status: Leave["status"]) {
    switch (status) {
      case "APPROVED":
        return "bg-green-500/20 text-green-400";

      case "REJECTED":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  }

  return (
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
          {leaves.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-6 text-center text-zinc-400">
                No leave requests found
              </td>
            </tr>
          ) : (
            leaves.map((leave) => (
              <tr key={leave.id} className="border-t border-white/10">
                <td className="p-4">{leave.leaveType}</td>

                <td className="p-4">
                  {new Date(leave.startDate).toLocaleDateString()}
                </td>

                <td className="p-4">
                  {new Date(leave.endDate).toLocaleDateString()}
                </td>

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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
