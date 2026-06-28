export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export function validatePayrollForm(data: {
  employeeId: string;
  month: number;
  year: number;
  baseSalary: number;
  allowance?: number;
  deduction?: number;
  bonus?: number;
}): ValidationResult {
  const errors: string[] = [];

  if (!data.employeeId || data.employeeId.trim() === "") {
    errors.push("Employee is required");
  }

  if (!data.month || data.month < 1 || data.month > 12) {
    errors.push("Month must be between 1 and 12");
  }

  if (!data.year || data.year < 2000 || data.year > 2100) {
    errors.push("Year must be between 2000 and 2100");
  }

  if (!data.baseSalary || data.baseSalary <= 0) {
    errors.push("Base salary must be greater than 0");
  }

  if (data.allowance !== undefined && data.allowance < 0) {
    errors.push("Allowance cannot be negative");
  }

  if (data.deduction !== undefined && data.deduction < 0) {
    errors.push("Deduction cannot be negative");
  }

  if (data.bonus !== undefined && data.bonus < 0) {
    errors.push("Bonus cannot be negative");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validatePayrollFilter(params: {
  page?: number;
  pageSize?: number;
  month?: number;
  year?: number;
}): ValidationResult {
  const errors: string[] = [];

  if (params.page !== undefined && params.page < 1) {
    errors.push("Page must be greater than 0");
  }

  if (
    params.pageSize !== undefined &&
    (params.pageSize < 1 || params.pageSize > 100)
  ) {
    errors.push("Page size must be between 1 and 100");
  }

  if (params.month !== undefined && (params.month < 1 || params.month > 12)) {
    errors.push("Month must be between 1 and 12");
  }

  if (params.year !== undefined && (params.year < 2000 || params.year > 2100)) {
    errors.push("Year must be between 2000 and 2100");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
