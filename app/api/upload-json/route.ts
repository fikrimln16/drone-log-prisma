// import { NextResponse } from "next/server";

// import pool from "@/lib/db";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     console.log(body);

//     for (const item of body) {
//       await pool.query(
//         `
//         INSERT INTO drone_flight_history (
//           flight_date,
//           ama,
//           estate,
//           pilot,
//           flight_id,
//           mission_name,
//           battery_id,
//           battery_id_2,
//           battery_color,
//           start_percent,
//           end_percent,
//           start_volt,
//           end_volt,
//           start_time,
//           end_time,
//           duration_min,
//           notes
//         )
//         VALUES (
//           ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
//         )
//         `,
//         [
//           item.flight_date,

//           item.ama,

//           item.estate,

//           item.pilot,

//           item.flight_id,

//           item.mission_name,

//           item.battery_id,

//           item.battery_id_2,

//           item.battery_color,

//           item.start_percent,

//           item.end_percent,

//           item.start_volt,

//           item.end_volt,

//           item.start_time,

//           item.end_time,

//           item.duration_min,

//           item.notes || "",
//         ]
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: "CSV uploaded successfully",
//     });
//   } catch (err) {
//     console.error(err);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Upload failed",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    // =====================================================
    // BODY
    // =====================================================

    const body = await req.json();

    console.log(body);

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!Array.isArray(body)) {
      return NextResponse.json(
        {
          success: false,

          message: "Invalid payload",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // FORMAT DATA
    // =====================================================

    const formattedData = body.map(
      (item) => ({
        flight_date: item.flight_date
          ? new Date(item.flight_date)
          : new Date(),

        ama: item.ama || "",

        estate: item.estate || "",

        pilot: item.pilot || "",

        flight_id:
          item.flight_id || "",

        mission_name:
          item.mission_name || "",

        battery_id:
          item.battery_id || "",

        battery_id_2:
          item.battery_id_2 || "",

        battery_color:
          item.battery_color || "",

        start_percent:
          item.start_percent !==
          undefined
            ? Number(
                item.start_percent
              )
            : 0,

        end_percent:
          item.end_percent !==
          undefined
            ? Number(
                item.end_percent
              )
            : 0,

        start_volt:
          item.start_volt !==
          undefined
            ? Number(item.start_volt)
            : 0,

        end_volt:
          item.end_volt !==
          undefined
            ? Number(item.end_volt)
            : 0,

        start_time: item.start_time
          ? new Date(item.start_time)
          : undefined,

        end_time: item.end_time
          ? new Date(item.end_time)
          : undefined,

        duration_min:
          item.duration_min !==
          undefined
            ? Number(
                item.duration_min
              )
            : 0,

        notes: item.notes || "",
      })
    );

    // =====================================================
    // INSERT MANY
    // =====================================================

    await prisma.flight.createMany({
      data: formattedData,
    });

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,

      message:
        "CSV uploaded successfully",
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        success: false,

        message: "Upload failed",
      },
      {
        status: 500,
      }
    );
  }
}