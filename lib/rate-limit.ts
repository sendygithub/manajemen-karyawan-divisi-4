// Rate limiter in-memory sederhana (sliding window).
// Catatan: di deploy multi-instance, ini hanya berlaku per-instance.
// Untuk produksi skala besar gunakan Redis/Upstash, tapi ini sudah menutup
// celah brute-force untuk aplikasi skala kecil.

type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

/**
 * @param key  identitas unik (misal IP + endpoint)
 * @param limit  maksimum request dalam window
 * @param windowMs  panjang window dalam milidetik
 * @returns true jika diizinkan, false jika kena limit
 */
export function rateLimit(
  key: string,
  limit = 10,
  windowMs = 60_000,
): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  entry.count += 1;
  if (entry.count > limit) {
    return false;
  }

  return true;
}

// Ambil IP dari request (mendukung proxy/Vercel).
export function getClientIp(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
