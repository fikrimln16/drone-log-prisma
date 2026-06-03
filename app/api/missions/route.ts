import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT
        mission_name,

        COUNT(*) as total_flights,

        SUM(duration_min) as total_duration,

        ROUND(AVG(duration_min), 1) as avg_duration,

        MAX(flight_date) as last_flight

      FROM drone_flight_history

      GROUP BY mission_name

      ORDER BY last_flight DESC
    `);

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Error fetch missions" },
      { status: 500 }
    );
  }
}