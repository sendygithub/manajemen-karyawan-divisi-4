// Helper validasi ringan tanpa dependency eksternal.
// Dipakai di semua API route supaya validasi konsisten.

export function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export function isEmail(v: unknown): v is string {
  return (
    typeof v === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) &&
    v.length <= 254
  );
}

export function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

// Terima string tanggal yang valid (ISO atau format yang bisa di-parse) atau Date.
export function isValidDateInput(v: unknown): v is string | Date {
  if (v instanceof Date) return !Number.isNaN(v.getTime());
  if (typeof v !== "string" || v.trim() === "") return false;
  const d = new Date(v);
  return !Number.isNaN(d.getTime());
}

export function parseDate(v: unknown): Date | null {
  if (v instanceof Date && !Number.isNaN(v.getTime())) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return null;
}
