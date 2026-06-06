import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const flights =
      await prisma.flight.findMany({
        take: 5,
      });

    return NextResponse.json(flights);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Error",
      },
      {
        status: 500,
      }
    );
  }
}