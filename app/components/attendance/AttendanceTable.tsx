import { Attendance } from "@/types/type.attendance";

export default function EmployeeAttendanceTable({
  attendanceData,
}: {
  attendanceData: Attendance[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <table className="w-full">
        <thead className="bg-white/5">
          <tr className="text-left">
            <th className="p-4">Date</th>
            <th className="p-4">Check In</th>
            <th className="p-4">Check Out</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>

        <tbody>
          {attendanceData.map((attendance) => (
            <tr key={attendance.id} className="border-t border-white/10">
              <td className="p-4">
                {new Date(attendance.date).toLocaleDateString("id-ID")}
              </td>

              <td className="p-4">
                {attendance.checkIn
                  ? new Date(attendance.checkIn).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </td>

              <td className="p-4">
                {attendance.checkOut
                  ? new Date(attendance.checkOut).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </td>

              <td className="p-4">
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
                  {attendance.status}
                </span>
              </td>
            </tr>
          ))}

          {attendanceData.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center p-8 text-zinc-400">
                No attendance history
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
