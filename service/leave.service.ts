// Client fetcher untuk modul Leave.
// CATATAN: file ini hanya boleh berisi kode yang aman dijalankan di browser.
// Data diambil lewat API route (/api/leave), bukan Prisma langsung.

export type LeaveForm = {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
};

export async function createLeave(data: LeaveForm) {
  const response = await fetch("/api/leave", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed create leave request");
  }

  return result;
}

export async function getLeaves() {
  const response = await fetch("/api/leave");

  if (!response.ok) {
    throw new Error("Failed get leaves");
  }

  return response.json();
}
