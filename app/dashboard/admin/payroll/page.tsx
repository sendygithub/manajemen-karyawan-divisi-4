import { getServerSession } from "next-auth";
import { authOptions } from "lib/auth";
import { redirect } from "next/navigation";
import {
  getPayrolls,
  getPayrollSummaryData,
  getAllDepartments,
} from "service/payroll.service";
import PayrollSummaryCard from "@/components/payroll/PayrollSummaryCard";
import PayrollTable from "@/components/payroll/PayrollTable";
import type { PayrollFilter } from "@/types/type.payroll";

type Props = {
  searchParams: Promise<{
    search?: string;
    departmentId?: string;
    status?: string;
    month?: string;
    year?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
  }>;
};

export default async function PayrollPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard/employee");
  }

  const params = await searchParams;

  const filter: PayrollFilter = {
    search: params.search || undefined,
    departmentId: params.departmentId || undefined,
    status: (params.status as PayrollFilter["status"]) || undefined,
    month: params.month ? Number(params.month) : new Date().getMonth() + 1,
    year: params.year ? Number(params.year) : new Date().getFullYear(),
    sortBy: params.sortBy || undefined,
    sortOrder: (params.sortOrder as "asc" | "desc") || undefined,
    page: params.page ? Number(params.page) : 1,
    pageSize: 10,
  };

  const [payrollData, summary, departments] = await Promise.all([
    getPayrolls(filter),
    getPayrollSummaryData(
      filter.month ?? new Date().getMonth() + 1,
      filter.year ?? new Date().getFullYear(),
    ),
    getAllDepartments(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Payroll Management</h1>
        <p className="text-zinc-400 mt-2">
          Manage employee salaries and payments
        </p>
      </div>

      {/* Summary Cards */}
      <PayrollSummaryCard summary={summary} />

      {/* Payroll Table with Filters */}
      <PayrollTable
        payrollData={payrollData}
        departments={departments.map((d: { id: string; name: string }) => ({
          id: d.id,
          name: d.name,
        }))}
        currentFilter={filter}
      />
    </div>
  );
}
