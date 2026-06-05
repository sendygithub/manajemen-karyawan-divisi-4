export type Attendance = {
  id: number;
  name: string;
  date: string;
  status: "Present" | "Late" | "Sick" | "Leave";
};
