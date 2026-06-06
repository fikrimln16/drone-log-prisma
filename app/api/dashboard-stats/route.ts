// import pool from "@/lib/db";

// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     function calculateGrowth(current: number, previous: number) {
//       if (previous === 0) return 0;

//       return Number((((current - previous) / previous) * 100).toFixed(1));
//     }

//     // =====================================================
//     // MAIN STATS
//     // =====================================================

//     const [statsRows]: any = await pool.query(`
//         SELECT
//           COUNT(DISTINCT mission_name) AS total_missions,

//           COUNT(*) AS total_flights,

//           SUM(duration_min) AS total_duration,

//           AVG(duration_min) AS avg_duration

//         FROM drone_flight_history
//       `);

//     // =====================================================
//     // ACTIVE FLIGHTS TODAY
//     // =====================================================

//     const [activeRows]: any = await pool.query(`
//         SELECT COUNT(*) AS active_flights
//         FROM drone_flight_history
//         WHERE DATE(flight_date)=CURDATE()
//       `);

//     // =====================================================
//     // ACTIVE FLIGHT LIST
//     // =====================================================

//     const [activeFlightRows]: any = await pool.query(`
//         SELECT
//           id,
//           flight_id,
//           mission_name,
//           battery_id,
//           start_time,
//           end_time,
//           duration_min,
//           end_percent
//         FROM drone_flight_history
//         WHERE DATE(flight_date)=CURDATE()
//         ORDER BY start_time DESC
//       `);

//     // =====================================================
//     // LOW BATTERY ALERT
//     // =====================================================

//     const [batteryRows]: any = await pool.query(`
//         SELECT COUNT(*) AS battery_alerts
//         FROM drone_flight_history
//         WHERE
//           DATE(flight_date)=CURDATE()
//           AND end_percent <= 20
//       `);

//     // =====================================================
//     // LOW BATTERY FLIGHT LIST
//     // =====================================================

//     const [lowBatteryToday]: any = await pool.query(`
//         SELECT
//           flight_id,
//           battery_id,
//           end_percent
//         FROM drone_flight_history
//         WHERE
//           DATE(flight_date)=CURDATE()
//           AND end_percent <= 20
//         ORDER BY end_percent ASC
//         LIMIT 3
//       `);

//     // =====================================================
//     // MOST ACTIVE MISSION
//     // =====================================================

//     const [missionRows]: any = await pool.query(`
//         SELECT
//           mission_name,
//           COUNT(*) AS total
//         FROM drone_flight_history
//         GROUP BY mission_name
//         ORDER BY total DESC
//         LIMIT 1
//       `);

//     // =====================================================
//     // LATEST UPLOAD
//     // =====================================================

//     const [uploadRows]: any = await pool.query(`
//         SELECT
//           MAX(created_at) AS latest_upload
//         FROM drone_flight_history
//       `);

//     // =====================================================
//     // CURRENT 7 DAYS
//     // =====================================================

//     const [currentFlights]: any = await pool.query(`
//         SELECT COUNT(*) AS total
//         FROM drone_flight_history
//         WHERE flight_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
//       `);

//     const [currentDuration]: any = await pool.query(`
//         SELECT SUM(duration_min) AS total
//         FROM drone_flight_history
//         WHERE flight_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
//       `);

//     const [currentMission]: any = await pool.query(`
//         SELECT COUNT(DISTINCT mission_name) AS total
//         FROM drone_flight_history
//         WHERE flight_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
//       `);

//     const [currentAvg]: any = await pool.query(`
//         SELECT AVG(duration_min) AS total
//         FROM drone_flight_history
//         WHERE flight_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
//       `);

//     // =====================================================
//     // PREVIOUS 7 DAYS
//     // =====================================================

//     const [previousFlights]: any = await pool.query(`
//         SELECT COUNT(*) AS total
//         FROM drone_flight_history
//         WHERE flight_date BETWEEN
//           DATE_SUB(CURDATE(), INTERVAL 14 DAY)
//           AND
//           DATE_SUB(CURDATE(), INTERVAL 7 DAY)
//       `);

//     const [previousDuration]: any = await pool.query(`
//         SELECT SUM(duration_min) AS total
//         FROM drone_flight_history
//         WHERE flight_date BETWEEN
//           DATE_SUB(CURDATE(), INTERVAL 14 DAY)
//           AND
//           DATE_SUB(CURDATE(), INTERVAL 7 DAY)
//       `);

//     const [previousMission]: any = await pool.query(`
//         SELECT COUNT(DISTINCT mission_name) AS total
//         FROM drone_flight_history
//         WHERE flight_date BETWEEN
//           DATE_SUB(CURDATE(), INTERVAL 14 DAY)
//           AND
//           DATE_SUB(CURDATE(), INTERVAL 7 DAY)
//       `);

//     const [previousAvg]: any = await pool.query(`
//         SELECT AVG(duration_min) AS total
//         FROM drone_flight_history
//         WHERE flight_date BETWEEN
//           DATE_SUB(CURDATE(), INTERVAL 14 DAY)
//           AND
//           DATE_SUB(CURDATE(), INTERVAL 7 DAY)
//       `);

//     const [topPilotRows]: any = await pool.query(`
//       SELECT
//         pilot,
//         COUNT(*) AS flights,
//         SUM(duration_min) AS duration,
//         MAX(mission_name) AS mission
//       FROM drone_flight_history
//       WHERE pilot IS NOT NULL
//         AND pilot != ''
//       GROUP BY pilot
//       ORDER BY duration DESC
//       LIMIT 1
//     `);
//     // =====================================================
//     // RESPONSE
//     // =====================================================

//     return NextResponse.json({
//       // MAIN STATS
//       total_missions: statsRows[0]?.total_missions || 0,

//       total_flights: statsRows[0]?.total_flights || 0,

//       total_duration: statsRows[0]?.total_duration || 0,

//       avg_duration: Number(
//         parseFloat(statsRows[0]?.avg_duration || 0).toFixed(1)
//       ),

//       // ACTIVE
//       active_flights: activeRows[0]?.active_flights || 0,

//       active_flight_list: activeFlightRows || [],

//       // BATTERY
//       battery_alerts: batteryRows[0]?.battery_alerts || 0,

//       low_battery_flights: lowBatteryToday || [],

//       // MOST ACTIVE
//       most_active_mission: missionRows[0]?.mission_name || "-",

//       // UPLOAD
//       latest_upload: uploadRows[0]?.latest_upload || null,

//       // GROWTH
//       mission_growth: calculateGrowth(
//         currentMission[0]?.total || 0,
//         previousMission[0]?.total || 0
//       ),

//       flight_growth: calculateGrowth(
//         currentFlights[0]?.total || 0,
//         previousFlights[0]?.total || 0
//       ),

//       duration_growth: calculateGrowth(
//         currentDuration[0]?.total || 0,
//         previousDuration[0]?.total || 0
//       ),

//       avg_growth: calculateGrowth(
//         currentAvg[0]?.total || 0,
//         previousAvg[0]?.total || 0
//       ),

//       top_pilot: topPilotRows[0] || null,
//     });
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
    // =====================================================
    // HELPER
    // =====================================================

    function calculateGrowth(
      current: number,
      previous: number
    ) {
      if (previous === 0) return 0;

      return Number(
        (
          ((current - previous) / previous) *
          100
        ).toFixed(1)
      );
    }

    // =====================================================
    // DATE RANGE
    // =====================================================

    const today = new Date();

    const startToday = new Date();

    startToday.setHours(0, 0, 0, 0);

    const endToday = new Date();

    endToday.setHours(23, 59, 59, 999);

    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(today.getDate() - 7);

    const fourteenDaysAgo = new Date();

    fourteenDaysAgo.setDate(today.getDate() - 14);

    // =====================================================
    // MAIN STATS
    // =====================================================

    const totalMissions =
      await prisma.flight.groupBy({
        by: ["mission_name"],
      });

    const totalFlights =
      await prisma.flight.count();

    const statsAggregate =
      await prisma.flight.aggregate({
        _sum: {
          duration_min: true,
        },

        _avg: {
          duration_min: true,
        },
      });

    // =====================================================
    // ACTIVE FLIGHTS TODAY
    // =====================================================

    const activeFlights =
      await prisma.flight.count({
        where: {
          flight_date: {
            gte: startToday,

            lte: endToday,
          },
        },
      });

    // =====================================================
    // ACTIVE FLIGHT LIST
    // =====================================================

    const activeFlightRows =
      await prisma.flight.findMany({
        where: {
          flight_date: {
            gte: startToday,

            lte: endToday,
          },
        },

        select: {
          id: true,

          flight_id: true,

          mission_name: true,

          battery_id: true,

          start_time: true,

          end_time: true,

          duration_min: true,

          end_percent: true,
        },

        orderBy: {
          start_time: "desc",
        },
      });

    // =====================================================
    // LOW BATTERY ALERT
    // =====================================================

    const batteryAlerts =
      await prisma.flight.count({
        where: {
          flight_date: {
            gte: startToday,

            lte: endToday,
          },

          end_percent: {
            lte: 20,
          },
        },
      });

    // =====================================================
    // LOW BATTERY FLIGHT LIST
    // =====================================================

    const lowBatteryToday =
      await prisma.flight.findMany({
        where: {
          flight_date: {
            gte: startToday,

            lte: endToday,
          },

          end_percent: {
            lte: 20,
          },
        },

        select: {
          flight_id: true,

          battery_id: true,

          end_percent: true,
        },

        orderBy: {
          end_percent: "asc",
        },

        take: 3,
      });

    // =====================================================
    // MOST ACTIVE MISSION
    // =====================================================

    const missionRows =
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

        take: 1,
      });

    // =====================================================
    // LATEST UPLOAD
    // =====================================================

    const uploadRows =
      await prisma.flight.findFirst({
        orderBy: {
          created_at: "desc",
        },

        select: {
          created_at: true,
        },
      });

    // =====================================================
    // CURRENT 7 DAYS
    // =====================================================

    const currentFlights =
      await prisma.flight.count({
        where: {
          flight_date: {
            gte: sevenDaysAgo,
          },
        },
      });

    const currentDuration =
      await prisma.flight.aggregate({
        where: {
          flight_date: {
            gte: sevenDaysAgo,
          },
        },

        _sum: {
          duration_min: true,
        },
      });

    const currentMission =
      await prisma.flight.groupBy({
        by: ["mission_name"],

        where: {
          flight_date: {
            gte: sevenDaysAgo,
          },
        },
      });

    const currentAvg =
      await prisma.flight.aggregate({
        where: {
          flight_date: {
            gte: sevenDaysAgo,
          },
        },

        _avg: {
          duration_min: true,
        },
      });

    // =====================================================
    // PREVIOUS 7 DAYS
    // =====================================================

    const previousFlights =
      await prisma.flight.count({
        where: {
          flight_date: {
            gte: fourteenDaysAgo,

            lt: sevenDaysAgo,
          },
        },
      });

    const previousDuration =
      await prisma.flight.aggregate({
        where: {
          flight_date: {
            gte: fourteenDaysAgo,

            lt: sevenDaysAgo,
          },
        },

        _sum: {
          duration_min: true,
        },
      });

    const previousMission =
      await prisma.flight.groupBy({
        by: ["mission_name"],

        where: {
          flight_date: {
            gte: fourteenDaysAgo,

            lt: sevenDaysAgo,
          },
        },
      });

    const previousAvg =
      await prisma.flight.aggregate({
        where: {
          flight_date: {
            gte: fourteenDaysAgo,

            lt: sevenDaysAgo,
          },
        },

        _avg: {
          duration_min: true,
        },
      });

    // =====================================================
    // TOP PILOT
    // =====================================================

    const topPilotRaw =
      await prisma.flight.groupBy({
        by: ["pilot"],

        where: {
          pilot: {
            not: "",
          },
        },

        _count: {
          id: true,
        },

        _sum: {
          duration_min: true,
        },

        orderBy: {
          _sum: {
            duration_min: "desc",
          },
        },

        take: 1,
      });

    let topPilot = null;

    if (
      topPilotRaw.length > 0 &&
      topPilotRaw[0].pilot
    ) {
      const latestMission =
        await prisma.flight.findFirst({
          where: {
            pilot: topPilotRaw[0].pilot || "",
          },

          orderBy: {
            flight_date: "desc",
          },

          select: {
            mission_name: true,
          },
        });

      topPilot = {
        pilot: topPilotRaw[0].pilot,

        flights:
          topPilotRaw[0]._count.id,

        duration:
          topPilotRaw[0]._sum
            .duration_min || 0,

        mission:
          latestMission?.mission_name ||
          "-",
      };
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      // MAIN STATS
      total_missions:
        totalMissions.length || 0,

      total_flights: totalFlights || 0,

      total_duration:
        statsAggregate._sum.duration_min ||
        0,

      avg_duration: Number(
        (
          statsAggregate._avg
            .duration_min || 0
        ).toFixed(1)
      ),

      // ACTIVE
      active_flights: activeFlights || 0,

      active_flight_list:
        activeFlightRows || [],

      // BATTERY
      battery_alerts:
        batteryAlerts || 0,

      low_battery_flights:
        lowBatteryToday || [],

      // MOST ACTIVE
      most_active_mission:
        missionRows[0]?.mission_name ||
        "-",

      // UPLOAD
      latest_upload:
        uploadRows?.created_at || null,

      // GROWTH
      mission_growth: calculateGrowth(
        currentMission.length || 0,
        previousMission.length || 0
      ),

      flight_growth: calculateGrowth(
        currentFlights || 0,
        previousFlights || 0
      ),

      duration_growth: calculateGrowth(
        currentDuration._sum
          .duration_min || 0,
        previousDuration._sum
          .duration_min || 0
      ),

      avg_growth: calculateGrowth(
        currentAvg._avg.duration_min || 0,
        previousAvg._avg.duration_min ||
          0
      ),

      // TOP PILOT
      top_pilot: topPilot,
    });
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