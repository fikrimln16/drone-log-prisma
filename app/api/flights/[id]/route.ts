import { NextResponse } from "next/server";

import pool from "@/lib/db";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(req: Request, { params }: Params) {
  try {
    // AWAIT PARAMS
    const { id } = await params;

    await pool.query(
      `
      DELETE FROM drone_flight_history
      WHERE id = ?
      `,
      [id]
    );

    return NextResponse.json({
      success: true,
      message: "Flight deleted successfully",
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: "Delete failed",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params;

    const body = await req.json();

    await pool.query(
      `
      UPDATE drone_flight_history
      SET
        flight_date = ?,
        ama = ?,
        estate = ?,
        flight_id = ?,
        mission_name = ?,
        battery_id = ?,
        battery_id_2 = ?,
        battery_color = ?,
        start_percent = ?,
        end_percent = ?,
        start_volt = ?,
        end_volt = ?,
        start_time = ?,
        end_time = ?,
        duration_min = ?,
        notes = ?
      WHERE id = ?
      `,
      [
        body.flight_date,
        body.ama,
        body.estate,
        body.flight_id,
        body.mission_name,
        body.battery_id,
        body.battery_id_2,
        body.battery_color,
        body.start_percent,
        body.end_percent,
        body.start_volt,
        body.end_volt,
        body.start_time,
        body.end_time,
        body.duration_min,
        body.notes,
        id,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Flight updated successfully",
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,
        message: "Update failed",
      },
      {
        status: 500,
      }
    );
  }
}
