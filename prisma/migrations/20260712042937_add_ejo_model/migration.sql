-- CreateTable
CREATE TABLE "Ejo" (
    "id" TEXT NOT NULL,
    "nomorEjo" SERIAL NOT NULL,
    "employeeId" TEXT NOT NULL,
    "divisi" INTEGER NOT NULL,
    "department" TEXT NOT NULL,
    "nomorMesin" INTEGER NOT NULL,
    "grub" TEXT NOT NULL,
    "jenisKerusakan" TEXT NOT NULL,
    "jenisPerbaikan" TEXT NOT NULL,
    "jamKerusakan" TIMESTAMP(3) NOT NULL,
    "namaPart" TEXT NOT NULL,
    "picOperator" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'MENUNGGU_KONFIRMASI',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ejo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Ejo_employeeId_idx" ON "Ejo"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Ejo_nomorEjo_key" ON "Ejo"("nomorEjo");

-- AddForeignKey
ALTER TABLE "Ejo" ADD CONSTRAINT "Ejo_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
