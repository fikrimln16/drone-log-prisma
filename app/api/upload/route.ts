import pool from "@/lib/db";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          message: "No file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    const text = await file.text();

    const rows = text.split("\n");

    rows.shift();

    for (const row of rows) {
      if (!row.trim()) continue;

      const cols = row.split(",");

      await pool.query(
        `
        INSERT INTO drone_flight_history
        (
          flight_date,
          flight_id,
          mission_name,
          battery_id,
          battery_color,
          start_percent,
          end_percent,
          start_volt,
          end_volt,
          start_time,
          end_time,
          duration_min,
          notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          cols[0],
          cols[1],
          cols[2],
          cols[3],
          cols[4],
          cols[5],
          cols[6],
          cols[7],
          cols[8],
          cols[9],
          cols[10],
          cols[11],
          cols[12],
        ]
      );
    }

    return NextResponse.json({
      message: "CSV uploaded successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}