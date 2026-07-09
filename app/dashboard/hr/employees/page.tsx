"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import EmployeeTable from "@/components/employee/EmployeeTable";

export default function HREmployeesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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
          <h1 className="text-2xl font-bold">Data Karyawan</h1>
          <p className="text-zinc-400 text-sm">Kelola data seluruh karyawan</p>
        </div>
      </div>

      <EmployeeTable employees={[]} />
    </div>
  );
}
