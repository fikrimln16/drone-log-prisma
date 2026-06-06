// import { NextResponse } from "next/server";

// import pool from "@/lib/db";

// export async function GET() {
//   try {
//     // ACTIVITY CHART
//     const [activityRows]: any = await pool.query(`
//       SELECT
//         DATE_FORMAT(flight_date, '%d %b') as day,
//         COUNT(*) as flights
//       FROM drone_flight_history
//       GROUP BY flight_date
//       ORDER BY flight_date ASC
//       LIMIT 7
//     `);

//     // DURATION CHART
//     const [durationRows]: any = await pool.query(`
//       SELECT
//         mission_name as mission,
//         SUM(duration_min) as duration
//       FROM drone_flight_history
//       GROUP BY mission_name
//       ORDER BY duration DESC
//       LIMIT 5
//     `);

//     // TOTAL FLIGHT CHART
//     const [totalFlightRows]: any = await pool.query(`
//       SELECT
//         mission_name as mission,
//         COUNT(*) as total
//       FROM drone_flight_history
//       GROUP BY mission_name
//       ORDER BY total DESC
//       LIMIT 5
//     `);

//     return NextResponse.json({
//       activity: activityRows,

//       duration: durationRows,

//       totalFlight: totalFlightRows,
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         message: "Failed load chart data",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // =====================================================
    // ACTIVITY CHART
    // =====================================================

    const activityRaw =
      await prisma.flight.groupBy({
        by: ["flight_date"],

        _count: {
          id: true,
        },

        orderBy: {
          flight_date: "asc",
        },

        take: 7,
      });

    const activityRows = activityRaw.map(
      (item) => ({
        day: new Date(
          item.flight_date
        ).toLocaleDateString("id-ID", {
          day: "2-digit",

          month: "short",
        }),

        flights: item._count.id,
      })
    );

    // =====================================================
    // DURATION CHART
    // =====================================================

    const durationRaw =
      await prisma.flight.groupBy({
        by: ["mission_name"],

        _sum: {
          duration_min: true,
        },

        orderBy: {
          _sum: {
            duration_min: "desc",
          },
        },

        take: 5,
      });

    const durationRows = durationRaw.map(
      (item) => ({
        mission: item.mission_name,

        duration:
          item._sum.duration_min || 0,
      })
    );

    // =====================================================
    // TOTAL FLIGHT CHART
    // =====================================================

    const totalFlightRaw =
      await prisma.flight.groupBy({
        by: ["mission_name"],

        _count: {
          id: true,
        },

        orderBy: {
          _count: {
            id: "desc",
          },
        },

        take: 5,
      });

    const totalFlightRows =
      totalFlightRaw.map((item) => ({
        mission: item.mission_name,

        total: item._count.id,
      }));

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      activity: activityRows,

      duration: durationRows,

      totalFlight: totalFlightRows,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed load chart data",
      },
      {
        status: 500,
      }
    );
  }
}