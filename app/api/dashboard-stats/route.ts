import pool from "@/lib/db";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows]: any = await pool.query(`
      SELECT
        COUNT(DISTINCT mission_name) AS total_missions,
        COUNT(*) AS total_flights,
        SUM(duration_min) AS total_duration,
        AVG(duration_min) AS avg_duration
      FROM drone_flight_history
    `);

    return NextResponse.json(rows[0]);
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
