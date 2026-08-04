import { redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { authOptions } from "../../../lib/auth";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "EMPLOYEE" && session.user.role !== "ADMIN") {
    redirect("/dashboard/employee");
  }

  return <>{children}</>;
}
