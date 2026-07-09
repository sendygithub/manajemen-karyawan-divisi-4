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
        onClick={() => signOut()}
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
