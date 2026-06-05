import { Attendance } from "@/types/type.attendance";
export default function AttendanceTable({
  attendanceData,
  getStatusStyle,
}: {
  attendanceData: Attendance[];
  getStatusStyle: (status: Attendance["status"]) => string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <table className="w-full">
        <thead className="bg-white/5">
          <tr className="text-left">
            <th className="p-4">Employee</th>
            <th className="p-4">Date</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>

        <tbody>
          {attendanceData.map((attendance) => (
            <tr key={attendance.id} className="border-t border-white/10">
              <td className="p-4">{attendance.name}</td>

              <td className="p-4">{attendance.date}</td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                    attendance.status,
                  )}`}
                >
                  {attendance.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
