// ============================================================
// Mock Data untuk Dashboard Landing Page
// PT. GAJAH TUNGGAL PLANT A — DIVISI 4
// ============================================================

export const COMPANY_INFO = {
  name: "PT. GAJAH TUNGGAL PLANT A",
  division: "DIVISI 4",
  tagline: "Bersama Mewujudkan Produktivitas & Inovasi Tanpa Batas",
  description:
    "Divisi 4 adalah tulang punggung operasional Plant A yang terdiri dari departemen ABC, ASQ, dan ASM. Kami berkomitmen untuk menjaga standar kualitas, keselamatan, dan efisiensi tertinggi dalam setiap proses produksi.",
} as const;

// --- Data Karyawan per Departemen ---
export interface DepartmentSummary {
  id: string;
  name: string;
  totalEmployees: number;
  head: string;
  color: string;
}

export const DEPARTMENT_DATA: DepartmentSummary[] = [
  {
    id: "abc",
    name: "ABC",
    totalEmployees: 42,
    head: "Bambang Supriyadi",
    color: "#3b82f6",
  },
  {
    id: "asq",
    name: "ASQ",
    totalEmployees: 38,
    head: "Siti Rahmawati",
    color: "#10b981",
  },
  {
    id: "asm",
    name: "ASM",
    totalEmployees: 35,
    head: "Hendra Gunawan",
    color: "#f59e0b",
  },
];

export const TOTAL_EMPLOYEES = DEPARTMENT_DATA.reduce(
  (acc, d) => acc + d.totalEmployees,
  0,
);

// --- Data Cuti ---
export interface LeaveSummary {
  status: "APPROVED" | "PENDING" | "REJECTED";
  count: number;
  label: string;
}

export const LEAVE_SUMMARY: LeaveSummary[] = [
  { status: "APPROVED", count: 12, label: "Disetujui" },
  { status: "PENDING", count: 5, label: "Pending" },
  { status: "REJECTED", count: 2, label: "Ditolak" },
];

export const RECENT_LEAVE_REQUESTS = [
  {
    id: 1,
    employee: "Ahmad Fauzi",
    department: "ABC",
    type: "Cuti Tahunan",
    startDate: "2026-07-01",
    endDate: "2026-07-03",
    status: "PENDING" as const,
  },
  {
    id: 2,
    employee: "Dewi Sartika",
    department: "ASQ",
    type: "Cuti Sakit",
    startDate: "2026-06-28",
    endDate: "2026-06-29",
    status: "APPROVED" as const,
  },
  {
    id: 3,
    employee: "Rudi Hartono",
    department: "ASM",
    type: "Cuti Pribadi",
    startDate: "2026-07-05",
    endDate: "2026-07-05",
    status: "REJECTED" as const,
  },
  {
    id: 4,
    employee: "Fitri Handayani",
    department: "ABC",
    type: "Cuti Tahunan",
    startDate: "2026-07-10",
    endDate: "2026-07-12",
    status: "PENDING" as const,
  },
  {
    id: 5,
    employee: "Agus Prasetyo",
    department: "ASQ",
    type: "Cuti Sakit",
    startDate: "2026-06-30",
    endDate: "2026-07-01",
    status: "APPROVED" as const,
  },
];

// --- Data Absensi ---
export interface AttendanceStats {
  month: string;
  percentage: number;
  present: number;
  late: number;
  absent: number;
  leave: number;
}

export const ATTENDANCE_MONTHLY: AttendanceStats = {
  month: "Juni 2026",
  percentage: 94.7,
  present: 1023,
  late: 32,
  absent: 18,
  leave: 15,
};

export const ATTENDANCE_DAILY_PERCENTAGE = 96.2;

export const ATTENDANCE_TREND = [
  { day: "Sen", percentage: 97 },
  { day: "Sel", percentage: 95 },
  { day: "Rab", percentage: 98 },
  { day: "Kam", percentage: 93 },
  { day: "Jum", percentage: 96 },
  { day: "Sab", percentage: 88 },
];

// --- Data Payroll ---
export interface PayrollSummary {
  month: string;
  totalSlips: number;
  paid: number;
  pending: number;
  totalAmount: number;
  averageSalary: number;
}

export const PAYROLL_THIS_MONTH: PayrollSummary = {
  month: "Juni 2026",
  totalSlips: 115,
  paid: 98,
  pending: 17,
  totalAmount: 1_875_000_000,
  averageSalary: 16_304_348,
};

// --- Data Aktivitas Terbaru ---
export const RECENT_ACTIVITIES = [
  {
    id: 1,
    action: "Pengajuan cuti baru",
    employee: "Ahmad Fauzi",
    time: "10 menit yang lalu",
  },
  {
    id: 2,
    action: "Slip gaji Juni dirilis",
    employee: "Divisi 4",
    time: "1 jam yang lalu",
  },
  {
    id: 3,
    action: "Absensi harian diperbarui",
    employee: "Sistem",
    time: "2 jam yang lalu",
  },
  {
    id: 4,
    action: "Karyawan baru terdaftar",
    employee: "Bambang Supriyadi",
    time: "1 hari yang lalu",
  },
  {
    id: 5,
    action: "Data payroll diverifikasi",
    employee: "Keuangan",
    time: "1 hari yang lalu",
  },
];

// --- Testimoni / Sambutan ---
export const WELCOME_MESSAGE = {
  title: "Selamat Datang di Dashboard Divisi 4",
  subtitle:
    "Bersama kita wujudkan lingkungan kerja yang produktif, transparan, dan inovatif.",
  quote:
    "“Kebersamaan adalah fondasi kesuksesan kami. Setiap anggota tim adalah pahlawan yang berkontribusi pada kemajuan Plant A.”",
  author: "Manajemen Divisi 4",
};
