// Barrel konsolidasi semua type aplikasi.
// Import dari satu tempat: import type { ... } from "@/types";

export type {
  EmployeeForm,
  EmployeeDialogProps,
  DepartmentWithEmployees,
  EmployeeData,
  User,
} from "./type.employee";

export type {
  PayrollStatus,
  Payroll,
  PayrollDetail,
  PayrollSummary,
  PayrollFilter,
  PayrollFormData,
  PayrollUpdateData,
  PaginatedResult,
} from "./type.payroll";

export type { Attendance } from "./type.attendance";

export type { LeaveForm, Leave } from "./type.leave";

export type { Department, DepartmentForm } from "./type.department";

export type { LeaveRequest } from "./type.leaverequest";
