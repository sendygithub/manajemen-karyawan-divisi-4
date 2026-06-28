import EmployeeAttendanceTable from "@/components/attendance/AttendanceTable";
import { getAttendanceByEmployee } from "service/attendance.service";
import { getServerSession } from "next-auth"; // ✅ pakai ini untuk v4
import { authOptions } from "lib/auth";
import { redirect } from "next/navigation";

export default async function AttendancePage() {
  const session = await getServerSession(authOptions);

  console.log("SESSION:", session); // ✅ cek session
  console.log("USER ID:", session?.user?.id); // ✅ cek id ada atau tidak

  if (!session?.user?.id) {
    redirect("/login");
  }

  // ✅ Kirim user.id, service yang akan resolve ke employee.id
  const attendanceData = await getAttendanceByEmployee(session.user.id);
  console.log("ATTENDANCE DATA:", attendanceData); // ✅ cek hasil query
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Attendance</h1>
      <EmployeeAttendanceTable attendanceData={attendanceData} />
    </div>
  );
}
