import { useSession } from "next-auth/react";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Total Employees",
      value: 128,
      color: "text-blue-400",
    },
    {
      title: "Attendance Today",
      value: "118 / 128",
      color: "text-green-400",
    },
    {
      title: "Pending Leave",
      value: 6,
      color: "text-yellow-400",
    },
    {
      title: "Departments",
      value: 8,
      color: "text-purple-400",
    },
  ];

  const recentEmployees = [
    {
      id: 1,
      name: "John Doe",
      position: "Frontend Developer",
      department: "IT",
      status: "Active",
    },
    {
      id: 2,
      name: "Sarah Smith",
      position: "UI Designer",
      department: "Design",
      status: "Active",
    },
    {
      id: 3,
      name: "Michael Lee",
      position: "Backend Developer",
      department: "IT",
      status: "On Leave",
    },
  ];

  const leaveRequests = [
    {
      id: 1,
      name: "Kevin",
      type: "Annual Leave",
      status: "Pending",
    },
    {
      id: 2,
      name: "Amanda",
      type: "Sick Leave",
      status: "Approved",
    },
    {
      id: 3,
      name: "Jonathan",
      type: "Personal Leave",
      status: "Rejected",
    },
  ];

  function getStatusStyle(status: string) {
    switch (status) {
      case "Approved":
      case "Active":
        return "bg-green-500/20 text-green-400";

      case "Pending":
        return "bg-yellow-500/20 text-yellow-400";

      case "Rejected":
      case "On Leave":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-zinc-500/20 text-zinc-400";
    }
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

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <p className="text-zinc-400 text-sm">{item.title}</p>

            <h2 className={`text-3xl font-bold mt-3 ${item.color}`}>
              {item.value}
            </h2>
          </div>
        ))}
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-3 gap-6">
        {/* RECENT EMPLOYEE */}
        <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Recent Employees</h2>

            <button className="text-sm text-zinc-400 hover:text-white">
              View All
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr className="text-left">
                  <th className="p-4">Name</th>

                  <th className="p-4">Position</th>

                  <th className="p-4">Department</th>

                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentEmployees.map((employee) => (
                  <tr key={employee.id} className="border-t border-white/10">
                    <td className="p-4">{employee.name}</td>

                    <td className="p-4">{employee.position}</td>

                    <td className="p-4">{employee.department}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(
                          employee.status,
                        )}`}
                      >
                        {employee.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* LEAVE REQUEST */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Leave Requests</h2>

            <button className="text-sm text-zinc-400 hover:text-white">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {leaveRequests.map((leave) => (
              <div
                key={leave.id}
                className="rounded-xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{leave.name}</h3>

                    <p className="text-sm text-zinc-400">{leave.type}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      leave.status,
                    )}`}
                  >
                    {leave.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACTIVITY */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4">
            <div>
              <p className="font-medium">John checked in</p>

              <p className="text-sm text-zinc-400">Today at 08:01 AM</p>
            </div>

            <span className="text-green-400 text-sm">Attendance</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4">
            <div>
              <p className="font-medium">Amanda requested leave</p>

              <p className="text-sm text-zinc-400">2 hours ago</p>
            </div>

            <span className="text-yellow-400 text-sm">Leave</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-4">
            <div>
              <p className="font-medium">New employee registered</p>

              <p className="text-sm text-zinc-400">Yesterday</p>
            </div>

            <span className="text-blue-400 text-sm">Employee</span>
          </div>
        </div>
      </div>
    </div>
  );
}
