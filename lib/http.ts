import { NextResponse } from "next/server";

// Helper respons API yang konsisten.
// Semua error memakai bentuk { message } — tidak pernah membocorkan detail internal.

export function ok(data?: unknown, message?: string) {
  return NextResponse.json(
    message ? { success: true, message, data } : { success: true, data },
  );
}

export function created(data: unknown, message = "Created") {
  return NextResponse.json({ success: true, message, data }, { status: 201 });
}

export function badRequest(message: string) {
  return NextResponse.json({ message }, { status: 400 });
}

export function unauthorized(message = "Unauthorized") {
  return NextResponse.json({ message }, { status: 401 });
}

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ message }, { status: 403 });
}

export function notFound(message = "Data not found") {
  return NextResponse.json({ message }, { status: 404 });
}

export function serverError(error?: unknown, fallback = "Internal server error") {
  // Error tetap dicatat untuk debugging, tapi tidak dikirim ke client.
  if (error) console.error(error);
  return NextResponse.json({ message: fallback }, { status: 500 });
}
