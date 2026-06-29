"use client";

import { motion } from "framer-motion";
import { DEPARTMENT_DATA, TOTAL_EMPLOYEES } from "../mock-data";
import { Users, Building2, UserCheck, TrendingUp } from "lucide-react";

export default function HRTab() {
  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          icon={Users}
          label="Total Karyawan"
          value={String(TOTAL_EMPLOYEES)}
          color="blue"
          delay={0}
        />
        <SummaryCard
          icon={Building2}
          label="Departemen"
          value="3"
          color="emerald"
          delay={0.05}
        />
        <SummaryCard
          icon={UserCheck}
          label="Kepala Dept."
          value="3"
          color="amber"
          delay={0.1}
        />
        <SummaryCard
          icon={TrendingUp}
          label="Retensi"
          value="98%"
          color="violet"
          delay={0.15}
        />
      </div>

      {/* Department Detail Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-slate-800/50 border border-white/5 overflow-hidden"
      >
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">
            Data Karyawan per Departemen
          </h3>
          <p className="text-sm text-white/40 mt-1">
            Ringkasan jumlah karyawan di setiap departemen Divisi 4
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-white/40 font-medium">
                  Departemen
                </th>
                <th className="text-left p-4 text-white/40 font-medium">
                  Kepala Departemen
                </th>
                <th className="text-right p-4 text-white/40 font-medium">
                  Jumlah Karyawan
                </th>
                <th className="text-right p-4 text-white/40 font-medium">
                  Persentase
                </th>
              </tr>
            </thead>
            <tbody>
              {DEPARTMENT_DATA.map((dept, i) => (
                <motion.tr
                  key={dept.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      />
                      <span className="text-white font-medium">
                        {dept.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-white/60">{dept.head}</td>
                  <td className="p-4 text-right text-white font-medium">
                    {dept.totalEmployees}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-24 h-2 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${
                              (dept.totalEmployees / TOTAL_EMPLOYEES) * 100
                            }%`,
                          }}
                          transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: dept.color }}
                        />
                      </div>
                      <span className="text-white/40 text-xs w-10 text-right">
                        {Math.round(
                          (dept.totalEmployees / TOTAL_EMPLOYEES) * 100,
                        )}
                        %
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: "blue" | "emerald" | "amber" | "violet";
  delay: number;
}) {
  const colorMap = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400",
    emerald:
      "from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 text-emerald-400",
    amber:
      "from-amber-500/20 to-amber-600/10 border-amber-500/20 text-amber-400",
    violet:
      "from-violet-500/20 to-violet-600/10 border-violet-500/20 text-violet-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`rounded-xl bg-gradient-to-br ${colorMap[color]} p-5 border`}
    >
      <Icon className="w-5 h-5 mb-3" />
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-white/50 mt-1">{label}</div>
    </motion.div>
  );
}
