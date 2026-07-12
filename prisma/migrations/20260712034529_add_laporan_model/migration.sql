-- CreateTable
CREATE TABLE "Laporan" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "alatUkurMeter" TEXT NOT NULL,
    "alatUkurBusur" TEXT NOT NULL,
    "inputAPB" DOUBLE PRECISION NOT NULL,
    "noSpek" TEXT NOT NULL,
    "sudut" DOUBLE PRECISION NOT NULL,
    "lebar" DOUBLE PRECISION NOT NULL,
    "kodeTreatment" TEXT NOT NULL,
    "tanggalProduksi" TIMESTAMP(3) NOT NULL,
    "expire" TIMESTAMP(3) NOT NULL,
    "lebarAktual" DOUBLE PRECISION NOT NULL,
    "sudutAktual" DOUBLE PRECISION NOT NULL,
    "jumlahRoll" INTEGER NOT NULL,
    "meter" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Laporan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Laporan_employeeId_idx" ON "Laporan"("employeeId");

-- AddForeignKey
ALTER TABLE "Laporan" ADD CONSTRAINT "Laporan_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
