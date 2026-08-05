"use client";

import { motion } from "framer-motion";
import { DEPARTMENT_DATA, TOTAL_EMPLOYEES } from "../mock-data";
import { Building2, Users, UserCheck } from "lucide-react";

export default function DepartmentCards() {
  return (
    <section id="about" className="relative py-24 bg-[#121110] overflow-hidden">
      {/* Same tread texture as hero, keeps the two sections feeling like one system */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, #F5B700 0px, #F5B700 1px, transparent 1px, transparent 14px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#F5B700] text-black font-black text-xs tracking-tighter">
              GT
            </div>
            <span className="w-px h-4 bg-white/15" />
            <span className="text-xs uppercase tracking-[0.2em] text-[#B8B5AC] font-medium">
              Struktur Organisasi
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-[#F4F1EA]">
            Departemen Divisi 4
          </h2>
          <div className="mt-4 h-1 w-16 bg-[#F5B700]" />

          <p className="mt-6 text-[#B8B5AC] leading-relaxed">
            Divisi 4 menaungi{" "}
            <span className="text-[#F5B700] font-semibold">
              {DEPARTMENT_DATA.length} departemen
            </span>{" "}
            dengan total{" "}
            <span className="text-[#F5B700] font-semibold">
              {TOTAL_EMPLOYEES} karyawan
            </span>{" "}
            yang berdedikasi tinggi.
          </p>
        </motion.div>

        {/* Department cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {DEPARTMENT_DATA.map((dept, index) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative rounded-2xl bg-gradient-to-b from-[#1C1A17] to-[#0D0C0B] border border-white/10 p-6 overflow-hidden hover:border-[#F5B700]/30 transition-colors shadow-xl shadow-black/30"
            >
              {/* Accent bar keeps dept.color for wayfinding between departments */}
              <div
                className="absolute top-0 left-0 w-full h-[3px]"
                style={{ backgroundColor: dept.color, opacity: 0.7 }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/10"
                    style={{ color: dept.color }}
                  >
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="font-mono text-2xl font-bold text-[#F5B700]/80">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="text-lg font-bold uppercase tracking-tight text-[#F4F1EA] group-hover:text-[#F5B700] transition-colors">
                  {dept.name}
                </h3>

                <div className="mt-6 space-y-3 pt-5 border-t border-white/10">
                  <div className="flex items-center gap-3 text-sm text-[#8A877E]">
                    <Users className="w-4 h-4 text-[#6B6862]" />
                    <span>
                      <strong className="text-[#E5E2D8] font-semibold">
                        {dept.totalEmployees}
                      </strong>{" "}
                      Karyawan
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#8A877E]">
                    <UserCheck className="w-4 h-4 text-[#6B6862]" />
                    <span>
                      Kepala:{" "}
                      <span className="text-[#B8B5AC]">{dept.head}</span>
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
