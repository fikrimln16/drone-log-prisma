import { NextResponse } from "next/server";

import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      flight_date,

      ama,

      estate,

      flight_id,

      mission_name,

      battery_id,

      battery_id_2,

      battery_color,

      start_percent,

      end_percent,

      start_volt,

      end_volt,

      start_time,

      end_time,

      duration_min,

      notes,
    } = body;

    // VALIDASI
    if (
      !flight_date ||
      !ama ||
      !estate ||
      !flight_id ||
      !mission_name ||
      !battery_id ||
      !battery_id_2 ||
      !battery_color ||
      start_percent === undefined ||
      end_percent === undefined ||
      !start_volt ||
      !end_volt ||
      !start_time ||
      !end_time ||
      !duration_min
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Semua field wajib diisi",
        },
        {
          status: 400,
        }
      );
    }

    await pool.query(
      `
      INSERT INTO drone_flight_history
      (
        flight_date,
        ama,
        estate,
        flight_id,
        mission_name,
        battery_id,
        battery_id_2,
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
      VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        flight_date,

        ama,

        estate,

        flight_id,

        mission_name,

        battery_id,

        battery_id_2,

        battery_color,

        start_percent,

        end_percent,

        start_volt,

        end_volt,

        start_time,

        end_time,

        duration_min,

        notes || "",
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Flight berhasil ditambahkan",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}