import { DefaultSession } from "next-auth";

// Role union yang dipakai aplikasi — harus sinkron dengan enum Role di Prisma.
export type AppRole = "ADMIN" | "HR" | "MANAGER" | "EMPLOYEE";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: AppRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: AppRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: AppRole;
  }
}
