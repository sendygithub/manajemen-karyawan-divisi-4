"use client";

import { Search } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Topbar() {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-zinc-950/30 backdrop-blur-xl px-6 py-5">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <p className="text-sm text-zinc-500">
          Welcome back, {session?.user?.name}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="rounded-2xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-sm outline-none backdrop-blur-sm placeholder:text-zinc-500 focus:border-white/20 focus:bg-white/[0.07] transition-all"
          />
        </div>

        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-500/20">
          {session?.user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
