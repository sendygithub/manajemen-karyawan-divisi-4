"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, CalendarCheck, ClipboardCheck, Wallet } from "lucide-react";

type TabId = "hr" | "leave" | "attendance" | "payroll";

interface TabItem {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const TABS: TabItem[] = [
  { id: "hr", label: "Human Resources", icon: Users },
  { id: "leave", label: "Manajemen Cuti", icon: CalendarCheck },
  { id: "attendance", label: "Absensi", icon: ClipboardCheck },
  { id: "payroll", label: "Penggajian", icon: Wallet },
];

export default function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("hr");

  return (
    <section id="dashboard" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Dashboard Divisi 4
          </h2>
          <p className="mt-4 text-white/50 max-w-2xl mx-auto">
            Pantau data karyawan, cuti, absensi, dan penggajian dalam satu
            tampilan terintegrasi.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 p-1.5 rounded-2xl bg-slate-800/50 border border-white/5 max-w-3xl mx-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? "text-white" : "text-white/40 hover:text-white/70"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-600 rounded-xl"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            ></motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
