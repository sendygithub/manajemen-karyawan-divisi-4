import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "../../../lib/auth";

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "MANAGER" && session.user.role !== "ADMIN") {
    redirect("/dashboard/employee");
  }

  return <>{children}</>;
}
