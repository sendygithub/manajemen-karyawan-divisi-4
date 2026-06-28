import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
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
  ]);

  console.log(`✅ Created ${departments.length} departments`);

  // Create Admin User
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

  // Create Employee Users
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
      name: "Dewi Lestari",
      email: "dewi@company.com",
      position: "HR Manager",
      deptId: "dept-hr",
      gender: "FEMALE",
      bankName: "BCA",
      bankAccount: "1234567893",
      phone: "081234567893",
      joinDate: new Date("2021-05-01"),
    },
    {
      id: "emp-005",
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
      id: "emp-006",
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
      id: "emp-007",
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
      id: "emp-008",
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
      id: "emp-009",
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
      id: "emp-010",
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
      id: "emp-011",
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
      id: "emp-012",
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
        gender: emp.gender as any,
        joinDate: emp.joinDate,
        bankName: emp.bankName,
        bankAccount: emp.bankAccount,
        userId: user.id,
        departmentId: emp.deptId,
      },
    });

    employees.push(employee);
  }

  console.log(`✅ Created ${employees.length} employees`);

  // Create Payroll Data (last 3 months: April, May, June 2026)
  const currentYear = 2026;
  const months = [4, 5, 6]; // April, May, June

  const salaryData: Record<string, { base: number; allowance: number }> = {
    "emp-001": { base: 15000000, allowance: 3000000 },
    "emp-002": { base: 12000000, allowance: 2000000 },
    "emp-003": { base: 11000000, allowance: 2000000 },
    "emp-004": { base: 18000000, allowance: 4000000 },
    "emp-005": { base: 7000000, allowance: 1000000 },
    "emp-006": { base: 18000000, allowance: 4000000 },
    "emp-007": { base: 9000000, allowance: 1500000 },
    "emp-008": { base: 16000000, allowance: 3500000 },
    "emp-009": { base: 7000000, allowance: 1000000 },
    "emp-010": { base: 16000000, allowance: 3500000 },
    "emp-011": { base: 13000000, allowance: 2500000 },
    "emp-012": { base: 6000000, allowance: 1000000 },
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

  console.log(`✅ Created ${payrollCount} payroll records`);
  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
