import type { PayrollSummary } from "@/types/type.payroll";

type Props = {
  summary: PayrollSummary;
};

export default function PayrollSummaryCard({ summary }: Props) {
  const cards = [
    {
      title: "Total Employee",
      value: summary.totalEmployee,
      color: "text-blue-400",
    },
    {
      title: "Total Payroll Bulan Ini",
      value: summary.totalPayrollThisMonth,
      color: "text-purple-400",
    },
    {
      title: "Total Gaji Dibayar",
      value: `Rp ${summary.totalPayrollAmount.toLocaleString("id-ID")}`,
      color: "text-green-400",
    },
    {
      title: "Pending Payroll",
      value: summary.totalPending,
      color: "text-yellow-400",
    },
    {
      title: "Payroll Sudah Dibayar",
      value: summary.totalPaid,
      color: "text-emerald-400",
    },
    {
      title: "Average Salary",
      value: `Rp ${summary.averageSalary.toLocaleString("id-ID")}`,
      color: "text-cyan-400",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <p className="text-zinc-400 text-sm">{card.title}</p>
          <h2 className={`text-3xl font-bold mt-3 ${card.color}`}>
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}
