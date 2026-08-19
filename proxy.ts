import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Next.js 16: file ini menggantikan middleware.ts (konvensi "proxy").
// Tugasnya: melindungi halaman /dashboard dari user yang belum login,
// dan membatasi akses per-seksi berdasarkan role. API routes menjaga
// dirinya sendiri via getServerSession di dalam setiap handler.

const ROLE_HOME: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  HR: "/dashboard/hr",
  MANAGER: "/dashboard/manager",
  EMPLOYEE: "/dashboard/employee",
};

// Seksi dashboard yang boleh diakses tiap role.
// ADMIN bisa masuk ke semua seksi.
const SECTION_ACCESS: Record<string, string[]> = {
  admin: ["ADMIN"],
  hr: ["ADMIN", "HR"],
  manager: ["ADMIN", "MANAGER"],
  employee: ["ADMIN", "EMPLOYEE"],
  engineering: ["ADMIN"],
  payroll: ["ADMIN"],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isDashboard = pathname.startsWith("/dashboard");
  const isTrading = pathname === "/trading" || pathname.startsWith("/trading/");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Belum login → lempar ke halaman login (simpan tujuan awal).
  if ((isDashboard || isTrading) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Sudah login, tapi buka /login atau /register → arahkan ke dashboard sesuai role.
  if (isAuthPage && token) {
    // User trading → langsung ke terminal.
    if (token.email === "trading@mygajah.com") {
      return NextResponse.redirect(new URL("/trading", request.url));
    }
    const role = (token.role as string) ?? "EMPLOYEE";
    return NextResponse.redirect(
      new URL(ROLE_HOME[role] ?? "/dashboard/employee", request.url),
    );
  }

  // Pembatasan seksi per role.
  if (isDashboard && token) {
    const section = pathname.split("/")[2]; // /dashboard/<section>/...
    if (section) {
      const allowed = SECTION_ACCESS[section];
      if (!allowed) {
        // Seksi tak dikenal → biarkan halaman menangani sendiri.
        return NextResponse.next();
      }
      const role = (token.role as string) ?? "EMPLOYEE";
      if (!allowed.includes(role)) {
        return NextResponse.redirect(
          new URL(ROLE_HOME[role] ?? "/dashboard/employee", request.url),
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/trading/:path*", "/login", "/register"],
};
