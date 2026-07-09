import { getServerSession } from "next-auth";
import { authOptions } from "lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HRDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "HR") {
    redirect("/dashboard/employee");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">HR Dashboard</h1>
        <p className="text-zinc-400 mt-2">
          Selamat datang, {session.user.name} - Human Resources
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Link
          href="/dashboard/hr/employees"
          className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
        >
          <p className="text-zinc-400 text-sm">Total Employees</p>
          <h2 className="text-3xl font-bold mt-3 text-blue-400">Manage</h2>
          <p className="text-zinc-500 text-xs mt-2">Kelola data karyawan</p>
        </Link>

        <Link
          href="/dashboard/hr/attendance"
          className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
        >
          <p className="text-zinc-400 text-sm">Attendance</p>
          <h2 className="text-3xl font-bold mt-3 text-green-400">View</h2>
          <p className="text-zinc-500 text-xs mt-2">Lihat absensi karyawan</p>
        </Link>

        <Link
          href="/dashboard/hr/leave"
          className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
        >
          <p className="text-zinc-400 text-sm">Leave Requests</p>
          <h2 className="text-3xl font-bold mt-3 text-purple-400">Review</h2>
          <p className="text-zinc-500 text-xs mt-2">Kelola pengajuan cuti</p>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold mb-5">Quick Actions</h2>
        <div className="flex gap-4">
          <Link
            href="/dashboard/hr/employees"
            className="rounded-xl bg-blue-500 px-5 py-3 font-medium hover:bg-blue-600 transition"
          >
            Kelola Karyawan
          </Link>
          <Link
            href="/dashboard/hr/attendance"
            className="rounded-xl bg-green-500 px-5 py-3 font-medium hover:bg-green-600 transition"
          >
            Lihat Absensi
          </Link>
          <Link
            href="/dashboard/hr/leave"
            className="rounded-xl bg-purple-500 px-5 py-3 font-medium hover:bg-purple-600 transition"
          >
            Review Cuti
          </Link>
        </div>
      </div>
    </div>
  );
}
