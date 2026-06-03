import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM drone_flight_history
      ORDER BY id DESC
    `);

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