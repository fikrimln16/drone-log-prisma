// import pool from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function GET(
//   req: Request,
//   context: {
//     params: Promise<{ mission: string }>;
//   }
// ) {
//   try {
//     const { mission } = await context.params;

//     const [rows] = await pool.query(
//       `
//       SELECT *
//       FROM drone_flight_history
//       WHERE mission_name = ?
//       ORDER BY flight_date DESC
//       `,
//       [mission]
//     );

//     return NextResponse.json(rows);
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       { message: "Error fetch mission detail" },
//       { status: 500 }
//     );
//   }
// }

import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: {
    params: Promise<{
      mission: string;
    }>;
  }
) {
  try {
    // PARAMS
    const { mission } =
      await context.params;

    // GET FLIGHTS BY MISSION
    const rows =
      await prisma.flight.findMany({
        where: {
          mission_name: mission,
        },

        orderBy: {
          flight_date: "desc",
        },
      });

    // RESPONSE
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          "Error fetch mission detail",
      },
      {
        status: 500,
      }
    );
  }
}