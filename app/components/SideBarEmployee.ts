import {
  LayoutDashboard,
  ClipboardCheck,
  CalendarDays,
  User,
  FileText,
  Wrench,
} from "lucide-react";

export const employeeMenus = [
  {
    icon: LayoutDashboard,
    href: "/dashboard/employee",
    label: "Dashboard",
  },

  {
    icon: ClipboardCheck,
    href: "/dashboard/employee/attendance",
    label: "Attendance",
  },

  {
    icon: CalendarDays,
    href: "/dashboard/employee/leave",
    label: "Leave",
  },

  {
    icon: FileText,
    href: "/dashboard/employee/report",
    label: "Input Laporan",
  },

  {
    icon: Wrench,
    href: "/dashboard/employee/ejo",
    label: "E-Job Order",
  },

  {
    icon: User,
    href: "/dashboard/employee/profile",
    label: "Profile",
  },
];
