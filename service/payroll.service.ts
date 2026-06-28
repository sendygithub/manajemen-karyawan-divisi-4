import {
  findPayrolls,
  findPayrollById,
  createPayroll,
  updatePayroll,
  deletePayroll,
  getPayrollSummary,
  getDepartments,
  getAllEmployees,
} from "repository/payroll.repository";
import {
  validatePayrollForm,
  validatePayrollFilter,
} from "validator/payroll.validator";
import type {
  Payroll,
  PayrollDetail,
  PayrollSummary,
  PayrollFilter,
  PayrollFormData,
  PayrollUpdateData,
  PaginatedResult,
} from "@/types/type.payroll";

function mapPayrollToResponse(data: any): Payroll {
  return {
    id: data.id,
    employeeId: data.employeeId,
    employeeName: data.employee?.name ?? "-",
    employeePosition: data.employee?.position ?? "-",
    departmentName: data.employee?.department?.name ?? "-",
    month: data.month,
    year: data.year,
    baseSalary: data.baseSalary,
    allowance: data.allowance,
    deduction: data.deduction,
    bonus: data.bonus,
    totalSalary: data.totalSalary,
    status: data.status,
    paidAt: data.paidAt ? data.paidAt.toISOString() : null,
    notes: data.notes,
    createdAt: data.createdAt.toISOString(),
    updatedAt: data.updatedAt.toISOString(),
  };
}

function mapToPayrollDetail(data: any): PayrollDetail {
  const base = mapPayrollToResponse(data);
  return {
    ...base,
    employeePhone: data.employee?.phone ?? null,
    employeeBankName: data.employee?.bankName ?? null,
    employeeBankAccount: data.employee?.bankAccount ?? null,
    employeeJoinDate: data.employee?.joinDate
      ? data.employee.joinDate.toISOString()
      : null,
    employeeGender: data.employee?.gender ?? null,
  };
}

export async function getPayrolls(
  filter: PayrollFilter,
): Promise<PaginatedResult<Payroll>> {
  const page = filter.page ?? 1;
  const pageSize = filter.pageSize ?? 10;
  const skip = (page - 1) * pageSize;

  const validation = validatePayrollFilter({
    page,
    pageSize,
    month: filter.month,
    year: filter.year,
  });
  if (!validation.valid) {
    throw new Error(validation.errors.join(", "));
  }

  const where: any = {};

  if (filter.month) where.month = filter.month;
  if (filter.year) where.year = filter.year;
  if (filter.status) where.status = filter.status;

  if (filter.departmentId) {
    where.employee = {
      ...(where.employee || {}),
      departmentId: filter.departmentId,
    };
  }

  if (filter.search) {
    where.employee = {
      ...(where.employee || {}),
      name: { contains: filter.search, mode: "insensitive" },
    };
  }

  const allowedSortFields = [
    "baseSalary",
    "allowance",
    "deduction",
    "bonus",
    "totalSalary",
    "status",
    "month",
    "year",
    "createdAt",
    "updatedAt",
  ];

  let orderBy: any = { createdAt: "desc" };
  if (filter.sortBy && allowedSortFields.includes(filter.sortBy)) {
    orderBy = { [filter.sortBy]: filter.sortOrder ?? "desc" };
  }

  const { data, total } = await findPayrolls({
    where,
    orderBy,
    skip,
    take: pageSize,
  });

  return {
    data: data.map(mapPayrollToResponse),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}

export async function getPayrollById(
  id: string,
): Promise<PayrollDetail | null> {
  const data = await findPayrollById(id);
  if (!data) return null;
  return mapToPayrollDetail(data);
}

export async function createPayrollEntry(
  formData: PayrollFormData,
): Promise<Payroll> {
  const validation = validatePayrollForm(formData);
  if (!validation.valid) {
    throw new Error(validation.errors.join(", "));
  }

  const totalSalary =
    formData.baseSalary +
    (formData.allowance ?? 0) +
    (formData.bonus ?? 0) -
    (formData.deduction ?? 0);

  const data = await createPayroll({
    employee: { connect: { id: formData.employeeId } },
    month: formData.month,
    year: formData.year,
    baseSalary: formData.baseSalary,
    allowance: formData.allowance ?? 0,
    deduction: formData.deduction ?? 0,
    bonus: formData.bonus ?? 0,
    totalSalary,
    notes: formData.notes,
  });

  return mapPayrollToResponse(data);
}

export async function updatePayrollEntry(
  id: string,
  updateData: PayrollUpdateData,
): Promise<Payroll> {
  const prismaData: any = {};

  if (updateData.baseSalary !== undefined)
    prismaData.baseSalary = updateData.baseSalary;
  if (updateData.allowance !== undefined)
    prismaData.allowance = updateData.allowance;
  if (updateData.deduction !== undefined)
    prismaData.deduction = updateData.deduction;
  if (updateData.bonus !== undefined) prismaData.bonus = updateData.bonus;
  if (updateData.totalSalary !== undefined)
    prismaData.totalSalary = updateData.totalSalary;
  if (updateData.status !== undefined) prismaData.status = updateData.status;
  if (updateData.paidAt !== undefined) prismaData.paidAt = updateData.paidAt;
  if (updateData.notes !== undefined) prismaData.notes = updateData.notes;

  const data = await updatePayroll(id, prismaData);
  return mapPayrollToResponse(data);
}

export async function deletePayrollEntry(id: string): Promise<void> {
  await deletePayroll(id);
}

export async function getPayrollSummaryData(
  month: number,
  year: number,
): Promise<PayrollSummary> {
  return getPayrollSummary(month, year);
}

export async function getAllDepartments() {
  return getDepartments();
}

export async function getAllEmployeesForPayroll() {
  return getAllEmployees();
}

export async function markPayrollAsPaid(id: string): Promise<Payroll> {
  const data = await updatePayroll(id, {
    status: "PAID",
    paidAt: new Date(),
  });
  return mapPayrollToResponse(data);
}

export async function markPayrollAsPending(id: string): Promise<Payroll> {
  const data = await updatePayroll(id, {
    status: "PENDING",
    paidAt: null,
  });
  return mapPayrollToResponse(data);
}
