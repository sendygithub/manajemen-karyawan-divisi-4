import { LeaveRequest } from "@/types/type.leaverequest";
import { useState } from "react";
import { toast } from "sonner";

const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
  {
    id: 1,
    leaveType: "Annual Leave",
    startDate: "2026-06-10",
    endDate: "2026-06-12",
    reason: "Family vacation",
    status: "Approved",
  },
  {
    id: 2,
    leaveType: "Sick Leave",
    startDate: "2026-06-02",
    endDate: "2026-06-03",
    reason: "Fever",
    status: "Rejected",
  },
  {
    id: 3,
    leaveType: "Personal Leave",
    startDate: "2026-06-20",
    endDate: "2026-06-21",
    reason: "Personal matters",
    status: "Pending",
  },
]);
export async function createLeave(data: {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}) {
  try {
    const response = await fetch("/api/leave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        // TODO: Ganti hardcode ID ini dengan id karyawan asli dari session login NextAuth kamu nanti
        employeeId: "cmq3z29ng0001ug2cus2cisc4",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Gagal mengirim pengajuan cuti");
    }

    // Masukkan data baru yang sukses dari server ke bagian paling atas list tabel
    setLeaveRequests([result.data, ...leaveRequests]);
    toast.success("Cuti berhasil dibuat!");
    // Reset Form & Tutup Modal
    setForm({
      leaveType: "",
      startDate: "",
      endDate: "",
      reason: "",
    });
    setOpen(false);
  } catch (error: any) {
    console.error(error);
    alert(error.message || "Terjadi gangguan koneksi sistem.");
  }

  function setLeaveRequests(arg0: any[]) {
    throw new Error("Function not implemented.");
  }
  function setOpen(arg0: boolean) {
    throw new Error("Function not implemented.");
  }

  function setForm(arg0: {
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
  }) {
    throw new Error("Function not implemented.");
  }
}
