// Seed khusus user trading — IDEMPOTENT (upsert), aman dijalankan kapan saja.
// Tidak menghapus data apapun. Jalankan: npx tsx scripts/seed-trading-user.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "trading@mygajah.com";
  const password = await bcrypt.hash("trading123", 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password, // refresh hash kalau seed dijalankan ulang
      name: "Trading User",
      role: "EMPLOYEE",
    },
    create: {
      email,
      password,
      name: "Trading User",
      role: "EMPLOYEE",
    },
  });

  console.log(`✅ User trading siap: ${email} / trading123 (id: ${user.id}, role: ${user.role})`);
}

main()
  .catch((e) => {
    console.error("❌ Seed gagal:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
