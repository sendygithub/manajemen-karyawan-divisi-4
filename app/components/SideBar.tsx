"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  User,
  Settings,
  Bell,
  LogOut,
  TreePalm,
  FileUser,
  UserRound,
  Calendar,
  Check,
  CalendarX2,
  ClipboardCheck,
  Building2,
} from "lucide-react";

const menus = [
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
  { icon: Building2, href: "/dashboard/admin/department" },
  {
    icon: Settings,
    href: "/dashboard/admin/setting",
  },
];

export default function Sidebar() {
  return (
    <aside
      className="
        w-20
        border-r
        border-white/10
        bg-zinc-950
        flex
        flex-col
        items-center
        py-6
      "
    >
      {/* LOGO */}
      <div
        className="
          mb-10
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          bg-white
          text-black
          font-bold
        "
      >
        S
      </div>

      {/* MENU */}
      <nav className="flex flex-1 flex-col gap-4">
        {menus.map((menu, index) => {
          const Icon = menu.icon;

          return (
            <Link
              key={index}
              href={menu.href}
              className="
                group
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-2xl
                text-zinc-400
                transition
                hover:bg-white
                hover:text-black
              "
            >
              <Icon size={22} />
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <button
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-2xl
          text-zinc-400
          transition
          hover:bg-red-500
          hover:text-white
        "
      >
        <LogOut size={22} />
      </button>
    </aside>
  );
}
