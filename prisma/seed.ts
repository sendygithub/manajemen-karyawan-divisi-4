import { Gender, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.ejo.deleteMany();
  await prisma.laporan.deleteMany();
  await prisma.payroll.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.leave.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  // Create Departments
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        id: "dept-it",
        name: "Information Technology",
        jobdesk: "Mengelola sistem informasi dan teknologi perusahaan",
        plant: "Jakarta",
      },
    }),
    prisma.department.create({
      data: {
        id: "dept-hr",
        name: "Human Resources",
        jobdesk: "Mengelola sumber daya manusia dan rekrutmen",
        plant: "Jakarta",
      },
    }),
    prisma.department.create({
      data: {
        id: "dept-fin",
        name: "Finance",
        jobdesk: "Mengelola keuangan dan akuntansi perusahaan",
        plant: "Jakarta",
      },
    }),
    prisma.department.create({
      data: {
        id: "dept-mkt",
        name: "Marketing",
        jobdesk: "Mengelola strategi pemasaran dan branding",
        plant: "Jakarta",
      },
    }),
    prisma.department.create({
      data: {
        id: "dept-ops",
        name: "Operations",
        jobdesk: "Mengelola operasional harian perusahaan",
        plant: "Bandung",
      },
    }),
    prisma.department.create({
      data: {
        id: "dept-eng",
        name: "Engineering",
        jobdesk: "Mengelola perbaikan dan pemeliharaan mesin produksi",
        plant: "Jakarta",
      },
    }),
  ]);

  console.log(`✅ Created ${departments.length} departments`);

  // ──────────────────────────────────────────────
  // 1. ADMIN USER
  // ──────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 10);
  const adminUser = await prisma.user.create({
    data: {
      id: "user-admin",
      email: "admin@company.com",
      password: adminPassword,
      name: "Admin Utama",
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user created: admin@company.com / admin123`);

  // ──────────────────────────────────────────────
  // 2. HR USER
  // ──────────────────────────────────────────────
  const hrPassword = await bcrypt.hash("hr123", 10);
  const hrUser = await prisma.user.create({
    data: {
      id: "user-hr",
      email: "hr@company.com",
      password: hrPassword,
      name: "Dewi Lestari",
      role: "HR",
    },
  });

  await prisma.employee.create({
    data: {
      id: "emp-hr-001",
      name: "Dewi Lestari",
      position: "HR Manager",
      phone: "081234567893",
      gender: "FEMALE",
      joinDate: new Date("2021-05-01"),
      bankName: "BCA",
      bankAccount: "1234567893",
      userId: hrUser.id,
      departmentId: "dept-hr",
    },
  });
  console.log(`✅ HR user created: hr@company.com / hr123`);

  // ──────────────────────────────────────────────
  // 3. MANAGER USER
  // ──────────────────────────────────────────────
  const managerPassword = await bcrypt.hash("manager123", 10);
  const managerUser = await prisma.user.create({
    data: {
      id: "user-manager",
      email: "manager@company.com",
      password: managerPassword,
      name: "Bambang Suprapto",
      role: "MANAGER",
    },
  });

  await prisma.employee.create({
    data: {
      id: "emp-mgr-001",
      name: "Bambang Suprapto",
      position: "Department Manager",
      phone: "081234567899",
      gender: "MALE",
      joinDate: new Date("2020-03-01"),
      bankName: "Mandiri",
      bankAccount: "1234567899",
      userId: managerUser.id,
      departmentId: "dept-it",
    },
  });
  console.log(`✅ Manager user created: manager@company.com / manager123`);

  // ──────────────────────────────────────────────
  // 3b. ENGINEERING ADMIN USER
  // ──────────────────────────────────────────────
  const engineeringPassword = await bcrypt.hash("engineering123", 10);
  const engineeringUser = await prisma.user.create({
    data: {
      id: "user-engineering",
      email: "engineering@company.com",
      password: engineeringPassword,
      name: "Teknisi Engineering",
      role: "ADMIN",
    },
  });

  await prisma.employee.create({
    data: {
      id: "emp-eng-001",
      name: "Teknisi Engineering",
      position: "Engineering Supervisor",
      phone: "081234567888",
      gender: "MALE",
      joinDate: new Date("2022-01-01"),
      bankName: "BCA",
      bankAccount: "1234567888",
      userId: engineeringUser.id,
      departmentId: "dept-eng",
    },
  });
  console.log(
    `✅ Engineering user created: engineering@company.com / engineering123`,
  );

  // ──────────────────────────────────────────────
  // 4. EMPLOYEE USERS
  // ──────────────────────────────────────────────
  const employeePassword = await bcrypt.hash("employee123", 10);

  const employeeData = [
    {
      id: "emp-001",
      name: "Ahmad Fauzi",
      email: "ahmad@company.com",
      position: "Senior Frontend Developer",
      deptId: "dept-it",
      gender: "MALE",
      bankName: "BCA",
      bankAccount: "1234567890",
      phone: "081234567890",
      joinDate: new Date("2022-03-15"),
    },
    {
      id: "emp-002",
      name: "Siti Nurhaliza",
      email: "siti@company.com",
      position: "Backend Developer",
      deptId: "dept-it",
      gender: "FEMALE",
      bankName: "Mandiri",
      bankAccount: "1234567891",
      phone: "081234567891",
      joinDate: new Date("2023-01-10"),
    },
    {
      id: "emp-003",
      name: "Budi Santoso",
      email: "budi@company.com",
      position: "UI/UX Designer",
      deptId: "dept-it",
      gender: "MALE",
      bankName: "BNI",
      bankAccount: "1234567892",
      phone: "081234567892",
      joinDate: new Date("2022-07-20"),
    },
    {
      id: "emp-004",
      name: "Rudi Hartono",
      email: "rudi@company.com",
      position: "HR Staff",
      deptId: "dept-hr",
      gender: "MALE",
      bankName: "Mandiri",
      bankAccount: "1234567894",
      phone: "081234567894",
      joinDate: new Date("2023-06-15"),
    },
    {
      id: "emp-005",
      name: "Maya Indah",
      email: "maya@company.com",
      position: "Finance Manager",
      deptId: "dept-fin",
      gender: "FEMALE",
      bankName: "BCA",
      bankAccount: "1234567895",
      phone: "081234567895",
      joinDate: new Date("2021-08-01"),
    },
    {
      id: "emp-006",
      name: "Agus Wijaya",
      email: "agus@company.com",
      position: "Accountant",
      deptId: "dept-fin",
      gender: "MALE",
      bankName: "BNI",
      bankAccount: "1234567896",
      phone: "081234567896",
      joinDate: new Date("2022-11-01"),
    },
    {
      id: "emp-007",
      name: "Rina Marlina",
      email: "rina@company.com",
      position: "Marketing Manager",
      deptId: "dept-mkt",
      gender: "FEMALE",
      bankName: "Mandiri",
      bankAccount: "1234567897",
      phone: "081234567897",
      joinDate: new Date("2022-01-15"),
    },
    {
      id: "emp-008",
      name: "Deni Pratama",
      email: "deni@company.com",
      position: "Content Writer",
      deptId: "dept-mkt",
      gender: "MALE",
      bankName: "BCA",
      bankAccount: "1234567898",
      phone: "081234567898",
      joinDate: new Date("2023-03-01"),
    },
    {
      id: "emp-009",
      name: "Fitri Handayani",
      email: "fitri@company.com",
      position: "Operations Manager",
      deptId: "dept-ops",
      gender: "FEMALE",
      bankName: "BNI",
      bankAccount: "1234567899",
      phone: "081234567899",
      joinDate: new Date("2021-10-01"),
    },
    {
      id: "emp-010",
      name: "Hendra Gunawan",
      email: "hendra@company.com",
      position: "DevOps Engineer",
      deptId: "dept-it",
      gender: "MALE",
      bankName: "BCA",
      bankAccount: "1234567800",
      phone: "081234567800",
      joinDate: new Date("2023-08-15"),
    },
    {
      id: "emp-011",
      name: "Nina Sari",
      email: "nina@company.com",
      position: "HR Staff",
      deptId: "dept-hr",
      gender: "FEMALE",
      bankName: "Mandiri",
      bankAccount: "1234567801",
      phone: "081234567801",
      joinDate: new Date("2024-01-10"),
    },
    {
      id: "emp-012",
      name: "Doni Prasetyo",
      email: "doni@company.com",
      position: "Junior Developer",
      deptId: "dept-it",
      gender: "MALE",
      bankName: "BCA",
      bankAccount: "1234567802",
      phone: "081234567802",
      joinDate: new Date("2024-06-01"),
    },
  ];

  const employees = [];
  for (const emp of employeeData) {
    const user = await prisma.user.create({
      data: {
        id: `user-${emp.id}`,
        email: emp.email,
        password: employeePassword,
        name: emp.name,
        role: "EMPLOYEE",
      },
    });

    const employee = await prisma.employee.create({
      data: {
        id: emp.id,
        name: emp.name,
        position: emp.position,
        phone: emp.phone,
        gender: emp.gender as Gender,
        joinDate: emp.joinDate,
        bankName: emp.bankName,
        bankAccount: emp.bankAccount,
        userId: user.id,
        departmentId: emp.deptId,
      },
    });

    employees.push(employee);
  }

  console.log(`✅ Created ${employees.length} employee users`);
  console.log(`   (all employees password: employee123)`);

  // ──────────────────────────────────────────────
  // Create Payroll Data (last 3 months: April, May, June 2026)
  // ──────────────────────────────────────────────
  const currentYear = 2026;
  const months = [4, 5, 6]; // April, May, June

  const salaryData: Record<string, { base: number; allowance: number }> = {
    "emp-hr-001": { base: 18000000, allowance: 4000000 },
    "emp-mgr-001": { base: 20000000, allowance: 5000000 },
    "emp-001": { base: 15000000, allowance: 3000000 },
    "emp-002": { base: 12000000, allowance: 2000000 },
    "emp-003": { base: 11000000, allowance: 2000000 },
    "emp-004": { base: 7000000, allowance: 1000000 },
    "emp-005": { base: 18000000, allowance: 4000000 },
    "emp-006": { base: 9000000, allowance: 1500000 },
    "emp-007": { base: 16000000, allowance: 3500000 },
    "emp-008": { base: 7000000, allowance: 1000000 },
    "emp-009": { base: 16000000, allowance: 3500000 },
    "emp-010": { base: 13000000, allowance: 2500000 },
    "emp-011": { base: 6000000, allowance: 1000000 },
    "emp-012": { base: 8000000, allowance: 1500000 },
  };

  let payrollCount = 0;

  for (const month of months) {
    for (const emp of employees) {
      const salary = salaryData[emp.id];
      if (!salary) continue;

      const deduction = Math.round(salary.base * 0.05); // 5% deduction for BPJS/tax
      const bonus = month === 6 ? Math.round(salary.base * 0.1) : 0; // Bonus only in June
      const totalSalary = salary.base + salary.allowance + bonus - deduction;

      const isPaid = month < 6; // April & May are paid, June is pending
      const paidAt = isPaid ? new Date(2026, month - 1, 28) : null;

      await prisma.payroll.create({
        data: {
          employeeId: emp.id,
          month,
          year: currentYear,
          baseSalary: salary.base,
          allowance: salary.allowance,
          deduction,
          bonus,
          totalSalary,
          status: isPaid ? "PAID" : "PENDING",
          paidAt,
          notes: isPaid ? null : "Menunggu pembayaran",
        },
      });

      payrollCount++;
    }
  }

  // Also create payroll for HR and Manager employees
  const extraEmployees = [
    { id: "emp-hr-001", base: 18000000, allowance: 4000000 },
    { id: "emp-mgr-001", base: 20000000, allowance: 5000000 },
  ];

  for (const month of months) {
    for (const emp of extraEmployees) {
      const deduction = Math.round(emp.base * 0.05);
      const bonus = month === 6 ? Math.round(emp.base * 0.1) : 0;
      const totalSalary = emp.base + emp.allowance + bonus - deduction;
      const isPaid = month < 6;
      const paidAt = isPaid ? new Date(2026, month - 1, 28) : null;

      await prisma.payroll.create({
        data: {
          employeeId: emp.id,
          month,
          year: currentYear,
          baseSalary: emp.base,
          allowance: emp.allowance,
          deduction,
          bonus,
          totalSalary,
          status: isPaid ? "PAID" : "PENDING",
          paidAt,
          notes: isPaid ? null : "Menunggu pembayaran",
        },
      });

      payrollCount++;
    }
  }

  console.log(`✅ Created ${payrollCount} payroll records`);

  // ──────────────────────────────────────────────
  // Create Laporan (Dummy Data)
  // ──────────────────────────────────────────────
  const laporanData = [
    {
      employeeId: "emp-001",
      alatUkurMeter: "Mitutoyo 500-196-30",
      alatUkurBusur: "Mitutoyo 187-907",
      inputAPB: 150.5,
      noSpek: "SPK-2026-001",
      sudut: 90,
      lebar: 1200,
      kodeTreatment: "TREAT-A1",
      tanggalProduksi: new Date("2026-07-01"),
      expire: new Date("2027-07-01"),
      lebarAktual: 1198.5,
      sudutAktual: 89.8,
      jumlahRoll: 5,
      meter: 250,
    },
    {
      employeeId: "emp-002",
      alatUkurMeter: "INSIZE 1112-300",
      alatUkurBusur: "INSIZE 2212-90",
      inputAPB: 200.0,
      noSpek: "SPK-2026-002",
      sudut: 45,
      lebar: 900,
      kodeTreatment: "TREAT-B2",
      tanggalProduksi: new Date("2026-07-02"),
      expire: new Date("2027-07-02"),
      lebarAktual: 899.2,
      sudutAktual: 44.9,
      jumlahRoll: 3,
      meter: 180,
    },
    {
      employeeId: "emp-003",
      alatUkurMeter: "Mitutoyo 500-196-30",
      alatUkurBusur: "Mitutoyo 187-907",
      inputAPB: 175.8,
      noSpek: "SPK-2026-003",
      sudut: 60,
      lebar: 1500,
      kodeTreatment: "TREAT-C3",
      tanggalProduksi: new Date("2026-07-03"),
      expire: new Date("2027-07-03"),
      lebarAktual: 1499.0,
      sudutAktual: 60.1,
      jumlahRoll: 8,
      meter: 400,
    },
  ];

  for (const laporan of laporanData) {
    await prisma.laporan.create({
      data: laporan,
    });
  }

  console.log(`✅ Created ${laporanData.length} laporan records`);

  // ──────────────────────────────────────────────
  // Create EJO (Dummy Data)
  // ──────────────────────────────────────────────
  const ejoData = [
    {
      employeeId: "emp-001",
      divisi: 1,
      department: "Production",
      nomorMesin: 101,
      grub: "A",
      jenisKerusakan: "Bearing rusak",
      jenisPerbaikan: "MEKANIK",
      jamKerusakan: new Date("2026-07-10T08:30:00"),
      namaPart: "Bearing SKF 6205",
      picOperator: "Ahmad Fauzi",
    },
    {
      employeeId: "emp-002",
      divisi: 2,
      department: "Maintenance",
      nomorMesin: 205,
      grub: "B",
      jenisKerusakan: "Kabel putus",
      jenisPerbaikan: "ELEKTRIK",
      jamKerusakan: new Date("2026-07-11T14:15:00"),
      namaPart: "Kabel NYY 4x2.5mm",
      picOperator: "Siti Nurhaliza",
    },
    {
      employeeId: "emp-003",
      divisi: 1,
      department: "Production",
      nomorMesin: 108,
      grub: "A",
      jenisKerusakan: "Seal bocor",
      jenisPerbaikan: "MEKANIK",
      jamKerusakan: new Date("2026-07-12T10:00:00"),
      namaPart: "Oil Seal TC 35x55x8",
      picOperator: "Budi Santoso",
    },
  ];

  for (const ejo of ejoData) {
    await prisma.ejo.create({
      data: ejo,
    });
  }

  console.log(`✅ Created ${ejoData.length} ejo records`);
  console.log("🎉 Seeding completed successfully!");
  console.log("");
  console.log("📋 Daftar Akun:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(" ADMIN       : admin@company.com         / admin123");
  console.log(" HR          : hr@company.com            / hr123");
  console.log(" MANAGER     : manager@company.com       / manager123");
  console.log(" ENGINEERING : engineering@company.com   / engineering123");
  console.log(" EMPLOYEE    : ahmad@company.com         / employee123");
  console.log("               (dan employee lainnya)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("📋 Hak Akses:");
  console.log(" ADMIN   -> Semua fitur");
  console.log(" HR      -> Employee, Attendance, Leave");
  console.log(" MANAGER -> Approve Leave");
  console.log(" ENGINEERING -> EJO Management");
  console.log(" EMPLOYEE-> Lihat data sendiri");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
