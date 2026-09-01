"use client";

import Link from "next/link";

import { LogOut } from "lucide-react";

import { signOut, useSession } from "next-auth/react";

import { adminMenus } from "./SideBarAdmin";
import { hrMenus } from "./SideBarHR";
import { managerMenus } from "./SideBarManager";
import { employeeMenus } from "./SideBarEmployee";

export default function Sidebar() {
  const { data: session } = useSession();

  const role = session?.user?.role;

  let menus;
  if (role === "ADMIN") {
    menus = adminMenus;
  } else if (role === "HR") {
    menus = hrMenus;
  } else if (role === "MANAGER") {
    menus = managerMenus;
  } else {
    menus = employeeMenus;
  }

  return (
    <aside className="w-20 border-r border-white/10 bg-zinc-950/40 backdrop-blur-xl flex flex-col items-center py-6">
      {/* LOGO */}
      <div className="mb-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold shadow-lg shadow-blue-500/25">
        S
      </div>

      {/* MENU */}
      <nav className="flex flex-1 flex-col gap-4">
        {menus.map((menu, index) => {
          const Icon = menu.icon;

          return (
            <div key={index} className="relative group">
              <Link
                href={menu.href}
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-zinc-400 transition-all duration-200 hover:bg-white/10 hover:text-white hover:shadow-lg hover:shadow-white/5"
              >
                <Icon size={22} />
              </Link>
              {/* TOOLTIP */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-zinc-900/90 backdrop-blur-md border border-white/10 text-white text-xs font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50 shadow-xl">
                {menu.label}
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-zinc-900/90" />
              </div>
            </div>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <button
        onClick={() => signOut()}
        className="flex h-12 w-12 items-center justify-center rounded-2xl text-zinc-400 transition-all duration-200 hover:bg-red-500/20 hover:text-red-400 hover:shadow-lg hover:shadow-red-500/20"
      >
        <LogOut size={22} />
      </button>
    </aside>
  );
}
