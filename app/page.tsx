// ============================================================
// Landing Page — Dashboard Internal Perusahaan
// PT. GAJAH TUNGGAL PLANT A — DIVISI 4
// ============================================================
// Struktur Folder:
// app/
//   landing/
//     mock-data.ts              → Data dummy terstruktur
//     components/
//       HeroSection.tsx         → Hero dengan skeleton foto tim
//       DepartmentCards.tsx     → Kartu statistik per departemen
//       Footer.tsx              → Footer informasi perusahaan
//
// Catatan Integrasi Database (Prisma ORM):
// - Schema Prisma sudah tersedia di prisma/schema.prisma
//   dengan model: User, Employee, Department, Leave, Attendance, Payroll
// ============================================================

import HeroSection from "./landing/components/HeroSection";
import DepartmentCards from "./landing/components/DepartmentCards";
import Footer from "./landing/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      {/* Bagian Hero — Sambutan & Foto Tim */}
      <HeroSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
