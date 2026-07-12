import { NextResponse } from "next/server";
import { updateLaporan } from "service/laporan.service";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const laporan = await updateLaporan(id, body);
    return NextResponse.json(laporan);
  } catch (error) {
    console.error("Error updating laporan:", error);
    return NextResponse.json(
      { error: "Failed to update laporan" },
      { status: 500 },
    );
  }
}
