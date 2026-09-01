import { prisma } from "lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "lib/auth";
import { redirect } from "next/navigation";
import { Users, UserCheck, Clock, Building2 } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const totalEmployees = await prisma.employee.count();

  const departments = await prisma.department.findMany({
    include: { _count: { select: { employees: true } } },
  });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const attendanceToday = await prisma.attendance.count({
    where: {
      date: { gte: todayStart, lte: todayEnd },
      status: { in: ["PRESENT", "LATE"] },
    },
  });

  const pendingLeaves = await prisma.leave.count({
    where: { status: "PENDING" },
  });

  const recentEmployees = await prisma.employee.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { department: true },
  });

  const recentLeaves = await prisma.leave.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { employee: true },
  });

  const recentAttendance = await prisma.attendance.findMany({
    take: 5,
    orderBy: { date: "desc" },
    include: { employee: true },
  });

  const stats = [
    {
      title: "Total Employees",
      value: totalEmployees,
      color: "text-blue-400",
      icon: <Users size={20} />,
    },
    {
      title: "Attendance Today",
      value: `${attendanceToday} / ${totalEmployees}`,
      color: "text-emerald-400",
      icon: <UserCheck size={20} />,
    },
    {
      title: "Pending Leave",
      value: pendingLeaves,
      color: "text-amber-400",
      icon: <Clock size={20} />,
    },
    {
      title: "Departments",
      value: departments.length,
      color: "text-purple-400",
      icon: <Building2 size={20} />,
    },
  ];

  function getStatusStyle(status: string) {
    switch (status) {
      case "APPROVED":
      case "PRESENT":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
      case "PENDING":
      case "LATE":
        return "bg-amber-500/15 text-amber-400 border-amber-500/20";
      case "REJECTED":
      case "ABSENT":
        return "bg-red-500/15 text-red-400 border-red-500/20";
      default:
        return "bg-zinc-500/15 text-zinc-400 border-zinc-500/20";
    }
  }

  function formatStatus(status: string) {
    return status.charAt(0) + status.slice(1).toLowerCase();
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-zinc-400 mt-2">
          Monitor company activities and employee management
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="group relative rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20 hover:shadow-xl hover:shadow-black/20"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-zinc-400 text-sm">{item.title}</p>
                <span className="text-zinc-500">{item.icon}</span>
              </div>
              <h2 className={`text-3xl font-bold mt-3 ${item.color}`}>
                {item.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* DEPARTMENT BREAKDOWN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06]"
          >
            <p className="text-zinc-400 text-xs uppercase tracking-wider">
              {dept.name}
            </p>
            <h3 className="text-2xl font-bold mt-1 text-white">
              {dept._count.employees}
            </h3>
            <p className="text-zinc-500 text-xs mt-1">employees</p>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT EMPLOYEES */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Recent Employees</h2>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr className="text-left">
                  <th className="p-4 text-zinc-400 text-sm font-medium">Name</th>
                  <th className="p-4 text-zinc-400 text-sm font-medium">Position</th>
                  <th className="p-4 text-zinc-400 text-sm font-medium">Department</th>
                </tr>
              </thead>
              <tbody>
                {recentEmployees.map((employee) => (
                  <tr key={employee.id} className="border-t border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
                          {employee.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{employee.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-zinc-300">{employee.position}</td>
                    <td className="p-4">
                      <span className="inline-block px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs text-zinc-300">
                        {employee.department?.name || "-"}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentEmployees.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-zinc-500">
                      No employees yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* LEAVE REQUESTS */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Leave Requests</h2>
          </div>

          <div className="space-y-3">
            {recentLeaves.map((leave) => (
              <div
                key={leave.id}
                className="rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm transition-all duration-200 hover:bg-white/[0.04]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-sm">
                      {leave.employee?.name || "Unknown"}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {formatStatus(leave.leaveType)} Leave
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(leave.status)}`}
                  >
                    {formatStatus(leave.status)}
                  </span>
                </div>
              </div>
            ))}
            {recentLeaves.length === 0 && (
              <p className="text-zinc-500 text-sm text-center py-4">
                No leave requests
              </p>
            )}
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Recent Attendance</h2>
        </div>

        <div className="space-y-3">
          {recentAttendance.map((att) => (
            <div
              key={att.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm transition-all duration-200 hover:bg-white/[0.04]"
            >
              <div>
                <p className="font-medium text-sm">
                  {att.employee?.name || "Unknown"}{" "}
                  {att.status === "PRESENT"
                    ? "checked in"
                    : att.status === "LATE"
                      ? "arrived late"
                      : att.status === "ABSENT"
                        ? "was absent"
                        : "on leave"}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {att.date.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  {att.checkIn &&
                    ` at ${att.checkIn.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(att.status)}`}
              >
                {formatStatus(att.status)}
              </span>
            </div>
          ))}
          {recentAttendance.length === 0 && (
            <p className="text-zinc-500 text-sm text-center py-4">
              No attendance records yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
