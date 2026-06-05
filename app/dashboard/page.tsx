import StatCard from "@/components/StatCard";
import ActivityCard from "@/components/ActivityCard";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Total Employees" value="150" />
        <StatCard title="Total Attendance" value="120" />
        <StatCard title="Total Leave Requests" value="30" />
      </div>

      <div className="mt-6">
        <ActivityCard />
      </div>
    </div>
  );
}
