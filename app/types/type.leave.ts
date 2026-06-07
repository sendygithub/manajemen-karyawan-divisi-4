export type LeaveForm = {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  employeeId: string;
};

export type Leave = {
  id: string;

  leaveType: "ANNUAL" | "SICK" | "PERSONAL";

  startDate: string;

  endDate: string;

  reason: string;

  status: "PENDING" | "APPROVED" | "REJECTED";
};
