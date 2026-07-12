import {
  LayoutDashboard,
  UserRound,
  ClipboardCheck,
  CalendarX2,
} from "lucide-react";

export const hrMenus = [
  {
    icon: LayoutDashboard,
    href: "/dashboard/hr",
    label: "Dashboard",
  },

  {
    icon: UserRound,
    href: "/dashboard/hr/employees",
    label: "Employees",
  },

  {
    icon: ClipboardCheck,
    href: "/dashboard/hr/attendance",
    label: "Attendance",
  },

  {
    icon: CalendarX2,
    href: "/dashboard/hr/leave",
    label: "Leave",
  },
];
