"use client";

import { motion } from "framer-motion";
import { DEPARTMENT_DATA, TOTAL_EMPLOYEES } from "../mock-data";
import { Building2, Users, UserCheck } from "lucide-react";

export default function DepartmentCards() {
  return (
    <section id="about" className="py-20 bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-4">
            <Building2 className="w-4 h-4 text-zinc-400" />
            <span className="text-sm text-zinc-500">Departemen</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Struktur Departemen Divisi 4
          </h2>
          <p className="mt-4 text-zinc-500 max-w-2xl mx-auto">
            Divisi 4 menaungi {DEPARTMENT_DATA.length} departemen dengan total{" "}
            {TOTAL_EMPLOYEES} karyawan yang berdedikasi tinggi.
          </p>
        </motion.div>

        {/* Department Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {DEPARTMENT_DATA.map((dept, index) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 p-6 overflow-hidden hover:border-white/20 transition-all shadow-2xl shadow-black/30"
            >
              {/* Accent bar */}
              <div
                className="absolute top-0 left-0 w-full h-1 opacity-50"
                style={{ backgroundColor: dept.color }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/10"
                    style={{ color: dept.color }}
                  >
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span
                    className="text-3xl font-bold text-zinc-700"
                    style={{ color: dept.color }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-white group-hover:text-zinc-300 transition-colors">
                  Departemen {dept.name}
                </h3>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-zinc-500">
                    <Users className="w-4 h-4 text-zinc-600" />
                    <span>
                      <strong className="text-zinc-200 font-medium">
                        {dept.totalEmployees}
                      </strong>{" "}
                      Karyawan
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-zinc-500">
                    <UserCheck className="w-4 h-4 text-zinc-600" />
                    <span>
                      Kepala: <span className="text-zinc-400">{dept.head}</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
