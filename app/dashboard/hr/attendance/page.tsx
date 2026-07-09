"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AttendanceTable from "@/components/attendance/AttendanceTable";
import { getAllAttendance } from "service/attendance.service";
import { Attendance } from "@/types/type.attendance";

export default function HRAttendancePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [attendanceData, setAttendanceData] = useState<Attendance[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (
      status === "authenticated" &&
      session?.user?.role !== "HR" &&
      session?.user?.role !== "ADMIN"
    ) {
      router.push("/dashboard/employee");
    }
  }, [session, status, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllAttendance();
        setAttendanceData(data);
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
      }
    }
    fetchData();
  }, []);

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
          <h1 className="text-2xl font-bold">Data Absensi</h1>
          <p className="text-zinc-400 text-sm">
            Lihat absensi seluruh karyawan
          </p>
        </div>
      </div>

      <AttendanceTable attendanceData={attendanceData} />
    </div>
  );
}
