import Sidebar from "@/components/SideBar";
import Topbar from "@/components/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#09090b] text-white">
      <Sidebar />

      <main className="flex-1 overflow-hidden">
        <Topbar />

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
