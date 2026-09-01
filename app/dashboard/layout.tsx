import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import Sidebar from "@/components/SideBar";
import Topbar from "@/components/Topbar";
import { authOptions } from "../../lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Guard utama untuk seluruh area /dashboard (defense in depth,
  // selain proxy.ts di edge).
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top_left,_#1a1a2e_0%,_#09090b_60%)] text-white">
      <Sidebar />

      <main className="flex-1 overflow-hidden">
        <Topbar />

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
