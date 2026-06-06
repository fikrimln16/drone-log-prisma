// import pool from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const [rows] = await pool.query(`
//       SELECT
//         mission_name,

//         COUNT(*) as total_flights,

//         SUM(duration_min) as total_duration,

//         ROUND(AVG(duration_min), 1) as avg_duration,

//         MAX(flight_date) as last_flight

//       FROM drone_flight_history

//       GROUP BY mission_name

//       ORDER BY last_flight DESC
//     `);

//     return NextResponse.json(rows);
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       { message: "Error fetch missions" },
//       { status: 500 }
//     );
//   }
// }
import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    // GROUP MISSIONS
    const missions =
      await prisma.flight.groupBy({
        by: ["mission_name"],

        _count: {
          id: true,
        },

        _sum: {
          duration_min: true,
        },

        _avg: {
          duration_min: true,
        },

        _max: {
          flight_date: true,
        },

        orderBy: {
          _max: {
            flight_date: "desc",
          },
        },
      });

    // FORMAT RESPONSE
    const rows = missions.map(
      (item) => ({
        mission_name:
          item.mission_name,

        total_flights:
          item._count.id,

        total_duration:
          item._sum.duration_min || 0,

        avg_duration: Number(
          (
            item._avg.duration_min || 0
          ).toFixed(1)
        ),

        last_flight:
          item._max.flight_date,
      })
    );

    // RESPONSE
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          "Error fetch missions",
      },
      {
        status: 500,
      }
    );
  }
}