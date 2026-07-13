import {
  LayoutDashboard,
  UserRound,
  ClipboardCheck,
  CalendarX2,
  Building2,
  Settings,
  Wallet,
  Wrench,
} from "lucide-react";

export const adminMenus = [
  {
    icon: LayoutDashboard,
    href: "/dashboard/admin",
    label: "Dashboard",
  },

  {
    icon: UserRound,
    href: "/dashboard/admin/employees",
    label: "Employees",
  },

  {
    icon: ClipboardCheck,
    href: "/dashboard/admin/attendance",
    label: "Attendance",
  },

  {
    icon: CalendarX2,
    href: "/dashboard/admin/leave",
    label: "Leave",
  },

  {
    icon: Wallet,
    href: "/dashboard/admin/payroll",
    label: "Payroll",
  },

  {
    icon: Building2,
    href: "/dashboard/admin/department",
    label: "Department",
  },

  {
    icon: Wrench,
    href: "/dashboard/engineering",
    label: "Engineering",
  },

  {
    icon: Settings,
    href: "/dashboard/admin/setting",
    label: "Settings",
  },
];
