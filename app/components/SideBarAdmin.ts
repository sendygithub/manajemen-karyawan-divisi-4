import {
  LayoutDashboard,
  UserRound,
  ClipboardCheck,
  CalendarX2,
  Building2,
  Settings,
} from "lucide-react";

export const adminMenus = [
  {
    icon: LayoutDashboard,
    href: "/dashboard/admin",
  },

  {
    icon: UserRound,
    href: "/dashboard/admin/employees",
  },

  {
    icon: ClipboardCheck,
    href: "/dashboard/admin/attendance",
  },

  {
    icon: CalendarX2,
    href: "/dashboard/admin/leave",
  },

  {
    icon: Building2,
    href: "/dashboard/admin/department",
  },

  {
    icon: Settings,
    href: "/dashboard/admin/setting",
  },
];
