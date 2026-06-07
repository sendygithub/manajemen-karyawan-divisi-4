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
  },

  {
    icon: ClipboardCheck,
    href: "/dashboard/employee/attendance",
  },

  {
    icon: CalendarDays,
    href: "/dashboard/employee/leave",
  },

  {
    icon: User,
    href: "/dashboard/employee/profile",
  },
];
