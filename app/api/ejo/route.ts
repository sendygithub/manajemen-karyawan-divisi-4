import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { createEjo, getEjos } from "service/ejo.service";

export async function GET() {
  try {
    const ejos = await getEjos();
    return NextResponse.json(ejos);
  } catch (error) {
    console.error("Error fetching ejos:", error);
    return NextResponse.json(
      { error: "Failed to fetch ejos" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the employee record associated with this user
    const employee = await prisma.employee.findUnique({
      where: { userId: session.user.id },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "Employee record not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const ejo = await createEjo(employee.id, {
      ...body,
      picOperator: employee.name,
    });
    return NextResponse.json(ejo, { status: 201 });
  } catch (error) {
    console.error("Error creating ejo:", error);
    return NextResponse.json(
      { error: "Failed to create ejo" },
      { status: 500 },
    );
  }
}
