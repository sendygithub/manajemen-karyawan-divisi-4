import EmployeeAttendanceTable from "@/components/attendance/AttendanceTable";
import { getAttendanceByEmployee } from "service/attendance.service";

export default async function AttendancePage() {
  const attendanceData = await getAttendanceByEmployee("EMPLOYEE_ID_HERE");
  const attendanceDataWithEmployee = attendanceData.map((record) => ({
    ...record,
    employee: { id: record.employeeId },
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Attendance</h1>

      <EmployeeAttendanceTable attendanceData={attendanceDataWithEmployee} />
    </div>
  );
}
