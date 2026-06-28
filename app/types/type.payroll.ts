export type PayrollStatus = "PENDING" | "PAID";

export type Payroll = {
  id: string;
  employeeId: string;
  employeeName: string;
  employeePosition: string;
  departmentName: string;
  month: number;
  year: number;
  baseSalary: number;
  allowance: number;
  deduction: number;
  bonus: number;
  totalSalary: number;
  status: PayrollStatus;
  paidAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PayrollDetail = Payroll & {
  employeePhone: string | null;
  employeeBankName: string | null;
  employeeBankAccount: string | null;
  employeeJoinDate: string | null;
  employeeGender: string | null;
};

export type PayrollSummary = {
  totalEmployee: number;
  totalPayrollThisMonth: number;
  totalPaid: number;
  totalPending: number;
  totalPayrollAmount: number;
  averageSalary: number;
};

export type PayrollFilter = {
  search?: string;
  departmentId?: string;
  status?: PayrollStatus | "";
  month?: number;
  year?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export type PayrollFormData = {
  employeeId: string;
  month: number;
  year: number;
  baseSalary: number;
  allowance: number;
  deduction: number;
  bonus: number;
  notes?: string;
};

export type PayrollUpdateData = {
  baseSalary?: number;
  allowance?: number;
  deduction?: number;
  bonus?: number;
  totalSalary?: number;
  status?: PayrollStatus;
  paidAt?: Date | null;
  notes?: string;
};

export type PaginatedResult<T> = {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};
