import { prisma } from "lib/prisma";
import { Prisma } from "@prisma/client";

export type PayrollWhereInput = {
  month?: number;
  year?: number;
  status?: "PENDING" | "PAID";
  employee?: {
    departmentId?: string;
    name?: { contains: string; mode: "insensitive" };
  };
};

export type PayrollOrderBy = {
  [key: string]: "asc" | "desc";
};

export const payrollInclude = {
  employee: {
    include: {
      department: true,
    },
  },
} satisfies Prisma.PayrollInclude;

export async function findPayrolls(params: {
  where?: PayrollWhereInput;
  orderBy?: PayrollOrderBy;
  skip?: number;
  take?: number;
}) {
  const { where, orderBy, skip, take } = params;

  const [data, total] = await Promise.all([
    prisma.payroll.findMany({
      where: where as Prisma.PayrollWhereInput,
      include: payrollInclude,
      orderBy: orderBy as Prisma.PayrollOrderByWithRelationInput,
      skip,
      take,
    }),
    prisma.payroll.count({
      where: where as Prisma.PayrollWhereInput,
    }),
  ]);

  return { data, total };
}

export async function findPayrollById(id: string) {
  return prisma.payroll.findUnique({
    where: { id },
    include: payrollInclude,
  });
}

export async function findPayrollByEmployeeMonthYear(
  employeeId: string,
  month: number,
  year: number,
) {
  return prisma.payroll.findUnique({
    where: {
      employeeId_month_year: { employeeId, month, year },
    },
    include: payrollInclude,
  });
}

export async function createPayroll(data: Prisma.PayrollCreateInput) {
  return prisma.payroll.create({
    data,
    include: payrollInclude,
  });
}

export async function updatePayroll(
  id: string,
  data: Prisma.PayrollUpdateInput,
) {
  return prisma.payroll.update({
    where: { id },
    data,
    include: payrollInclude,
  });
}

export async function deletePayroll(id: string) {
  return prisma.payroll.delete({
    where: { id },
  });
}

export async function getPayrollSummary(month: number, year: number) {
  const [totalEmployee, payrollsThisMonth, allPayrolls] = await Promise.all([
    prisma.employee.count(),
    prisma.payroll.findMany({
      where: { month, year },
    }),
    prisma.payroll.findMany(),
  ]);

  const totalPayrollThisMonth = payrollsThisMonth.length;
  const totalPaid = payrollsThisMonth.filter((p) => p.status === "PAID").length;
  const totalPending = payrollsThisMonth.filter(
    (p) => p.status === "PENDING",
  ).length;
  const totalPayrollAmount = payrollsThisMonth.reduce(
    (sum, p) => sum + p.totalSalary,
    0,
  );
  const averageSalary =
    totalPayrollThisMonth > 0
      ? Math.round(totalPayrollAmount / totalPayrollThisMonth)
      : 0;

  return {
    totalEmployee,
    totalPayrollThisMonth,
    totalPaid,
    totalPending,
    totalPayrollAmount,
    averageSalary,
  };
}

export async function getDepartments() {
  return prisma.department.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getAllEmployees() {
  return prisma.employee.findMany({
    include: {
      department: true,
    },
    orderBy: { name: "asc" },
  });
}
