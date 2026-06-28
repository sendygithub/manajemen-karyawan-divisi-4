import { getServerSession } from "next-auth";
import { authOptions } from "lib/auth";
import { redirect } from "next/navigation";
import { getPayrollById } from "service/payroll.service";
import PayrollSlip from "@/components/payroll/PayrollSlip";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PayrollDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard/employee");
  }

  const { id } = await params;
  const payroll = await getPayrollById(id);

  if (!payroll) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-400">
            Payroll Not Found
          </h2>
          <p className="text-zinc-500 mt-2">
            The payroll you are looking for does not exist.
          </p>
          <a
            href="/dashboard/admin/payroll"
            className="inline-block mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            Back to Payroll
          </a>
        </div>
      </div>
    );
  }

  return <PayrollSlip payroll={payroll} />;
}
