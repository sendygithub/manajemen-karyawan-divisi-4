export type Attendance = {
  id: string;

  date: string;

  status: "PRESENT" | "LATE";

  checkIn?: string;

  checkOut?: string;

  employee: {
    name: string;
  };
};
