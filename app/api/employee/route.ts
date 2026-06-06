import { NextResponse } from "next/server";

import { prisma } from "../../../lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log(body);

    const { name, email, position, department } = body;

    // VALIDATION
    if (!name || !email || !position || !department) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        {
          status: 400,
        },
      );
    }

    // CHECK EMAIL
    const existingEmployee = await prisma.employee.findUnique({
      where: {
        email,
      },
    });

    if (existingEmployee) {
      return NextResponse.json(
        {
          message: "Email already exists",
        },
        {
          status: 400,
        },
      );
    }

    // CREATE EMPLOYEE
    const employee = await prisma.employee.create({
      data: {
        name,
        email,
        position,
        department,

        // sementara dummy
        userId: "temp-user-id",
      },
    });

    return NextResponse.json(
      {
        message: "Employee created",

        employee,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
