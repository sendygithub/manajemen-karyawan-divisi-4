export type Attendance = {
  id: string;
  date: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  status: string;
};
