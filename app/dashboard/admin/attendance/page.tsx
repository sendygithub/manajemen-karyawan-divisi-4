import EmployeeAttendanceTable from "@/components/attendance/AttendanceTable";
import { getAllAttendance } from "service/attendance.service";
import { getServerSession } from "next-auth";
import { authOptions } from "lib/auth";
import { redirect } from "next/navigation";

export default async function AttendancePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const attendanceData = await getAllAttendance();
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All Attendance</h1>
      <p className="text-zinc-400 text-sm mb-6">
        Lihat absensi seluruh karyawan
      </p>
      <EmployeeAttendanceTable attendanceData={attendanceData} />
    </div>
  );
}
