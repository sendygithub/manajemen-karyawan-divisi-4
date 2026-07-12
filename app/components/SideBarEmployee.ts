import {
  LayoutDashboard,
  ClipboardCheck,
  CalendarDays,
  User,
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
    icon: User,
    href: "/dashboard/employee/profile",
    label: "Profile",
  },
];
