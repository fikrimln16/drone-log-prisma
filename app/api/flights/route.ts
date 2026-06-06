// import pool from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const [rows] = await pool.query(`
//       SELECT *
//       FROM drone_flight_history
//       ORDER BY id DESC
//     `);

//     return NextResponse.json(rows);
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         message: "Database Error",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }
import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    // GET ALL FLIGHTS
    const rows = await prisma.flight.findMany({
      orderBy: {
        id: "desc",
      },
    });

    // RESPONSE
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Database Error",
      },
      {
        status: 500,
      }
    );
  }
}