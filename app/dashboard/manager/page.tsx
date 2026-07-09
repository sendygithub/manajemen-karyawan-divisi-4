import { getServerSession } from "next-auth";
import { authOptions } from "lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ManagerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "MANAGER") {
    redirect("/dashboard/employee");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
        <p className="text-zinc-400 mt-2">
          Selamat datang, {session.user.name} - Manager
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4">
        <Link
          href="/dashboard/manager/leave"
          className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
        >
          <p className="text-zinc-400 text-sm">Leave Approvals</p>
          <h2 className="text-3xl font-bold mt-3 text-purple-400">Approve</h2>
          <p className="text-zinc-500 text-xs mt-2">
            Approve atau reject pengajuan cuti
          </p>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold mb-5">Quick Actions</h2>
        <div className="flex gap-4">
          <Link
            href="/dashboard/manager/leave"
            className="rounded-xl bg-purple-500 px-5 py-3 font-medium hover:bg-purple-600 transition"
          >
            Approve / Reject Cuti
          </Link>
        </div>
      </div>
    </div>
  );
}
