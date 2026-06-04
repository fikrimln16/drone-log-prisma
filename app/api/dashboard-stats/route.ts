import pool from "@/lib/db";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    function calculateGrowth(current: number, previous: number) {
      if (previous === 0) return 0;

      return Number((((current - previous) / previous) * 100).toFixed(1));
    }

    // =====================================================
    // MAIN STATS
    // =====================================================

    const [statsRows]: any = await pool.query(`
        SELECT
          COUNT(DISTINCT mission_name) AS total_missions,

          COUNT(*) AS total_flights,

          SUM(duration_min) AS total_duration,

          AVG(duration_min) AS avg_duration

        FROM drone_flight_history
      `);

    // =====================================================
    // ACTIVE FLIGHTS TODAY
    // =====================================================

    const [activeRows]: any = await pool.query(`
        SELECT COUNT(*) AS active_flights
        FROM drone_flight_history
        WHERE DATE(flight_date)=CURDATE()
      `);

    // =====================================================
    // ACTIVE FLIGHT LIST
    // =====================================================

    const [activeFlightRows]: any = await pool.query(`
        SELECT
          id,
          flight_id,
          mission_name,
          battery_id,
          start_time,
          end_time,
          duration_min,
          end_percent
        FROM drone_flight_history
        WHERE DATE(flight_date)=CURDATE()
        ORDER BY start_time DESC
      `);

    // =====================================================
    // LOW BATTERY ALERT
    // =====================================================

    const [batteryRows]: any = await pool.query(`
        SELECT COUNT(*) AS battery_alerts
        FROM drone_flight_history
        WHERE
          DATE(flight_date)=CURDATE()
          AND end_percent <= 20
      `);

    // =====================================================
    // LOW BATTERY FLIGHT LIST
    // =====================================================

    const [lowBatteryToday]: any = await pool.query(`
        SELECT
          flight_id,
          battery_id,
          end_percent
        FROM drone_flight_history
        WHERE
          DATE(flight_date)=CURDATE()
          AND end_percent <= 20
        ORDER BY end_percent ASC
        LIMIT 3
      `);

    // =====================================================
    // MOST ACTIVE MISSION
    // =====================================================

    const [missionRows]: any = await pool.query(`
        SELECT
          mission_name,
          COUNT(*) AS total
        FROM drone_flight_history
        GROUP BY mission_name
        ORDER BY total DESC
        LIMIT 1
      `);

    // =====================================================
    // LATEST UPLOAD
    // =====================================================

    const [uploadRows]: any = await pool.query(`
        SELECT
          MAX(created_at) AS latest_upload
        FROM drone_flight_history
      `);

    // =====================================================
    // CURRENT 7 DAYS
    // =====================================================

    const [currentFlights]: any = await pool.query(`
        SELECT COUNT(*) AS total
        FROM drone_flight_history
        WHERE flight_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      `);

    const [currentDuration]: any = await pool.query(`
        SELECT SUM(duration_min) AS total
        FROM drone_flight_history
        WHERE flight_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      `);

    const [currentMission]: any = await pool.query(`
        SELECT COUNT(DISTINCT mission_name) AS total
        FROM drone_flight_history
        WHERE flight_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      `);

    const [currentAvg]: any = await pool.query(`
        SELECT AVG(duration_min) AS total
        FROM drone_flight_history
        WHERE flight_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      `);

    // =====================================================
    // PREVIOUS 7 DAYS
    // =====================================================

    const [previousFlights]: any = await pool.query(`
        SELECT COUNT(*) AS total
        FROM drone_flight_history
        WHERE flight_date BETWEEN
          DATE_SUB(CURDATE(), INTERVAL 14 DAY)
          AND
          DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      `);

    const [previousDuration]: any = await pool.query(`
        SELECT SUM(duration_min) AS total
        FROM drone_flight_history
        WHERE flight_date BETWEEN
          DATE_SUB(CURDATE(), INTERVAL 14 DAY)
          AND
          DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      `);

    const [previousMission]: any = await pool.query(`
        SELECT COUNT(DISTINCT mission_name) AS total
        FROM drone_flight_history
        WHERE flight_date BETWEEN
          DATE_SUB(CURDATE(), INTERVAL 14 DAY)
          AND
          DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      `);

    const [previousAvg]: any = await pool.query(`
        SELECT AVG(duration_min) AS total
        FROM drone_flight_history
        WHERE flight_date BETWEEN
          DATE_SUB(CURDATE(), INTERVAL 14 DAY)
          AND
          DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      `);

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      // MAIN STATS
      total_missions: statsRows[0]?.total_missions || 0,

      total_flights: statsRows[0]?.total_flights || 0,

      total_duration: statsRows[0]?.total_duration || 0,

      avg_duration: Number(
        parseFloat(statsRows[0]?.avg_duration || 0).toFixed(1)
      ),

      // ACTIVE
      active_flights: activeRows[0]?.active_flights || 0,

      active_flight_list: activeFlightRows || [],

      // BATTERY
      battery_alerts: batteryRows[0]?.battery_alerts || 0,

      low_battery_flights: lowBatteryToday || [],

      // MOST ACTIVE
      most_active_mission: missionRows[0]?.mission_name || "-",

      // UPLOAD
      latest_upload: uploadRows[0]?.latest_upload || null,

      // GROWTH
      mission_growth: calculateGrowth(
        currentMission[0]?.total || 0,
        previousMission[0]?.total || 0
      ),

      flight_growth: calculateGrowth(
        currentFlights[0]?.total || 0,
        previousFlights[0]?.total || 0
      ),

      duration_growth: calculateGrowth(
        currentDuration[0]?.total || 0,
        previousDuration[0]?.total || 0
      ),

      avg_growth: calculateGrowth(
        currentAvg[0]?.total || 0,
        previousAvg[0]?.total || 0
      ),
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
