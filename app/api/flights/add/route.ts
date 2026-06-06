// import { NextResponse } from "next/server";

// import pool from "@/lib/db";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const {
//       flight_date,

//       ama,

//       estate,

//       pilot,

//       flight_id,

//       mission_name,

//       battery_id,

//       battery_id_2,

//       battery_color,

//       start_percent,

//       end_percent,

//       start_volt,

//       end_volt,

//       start_time,

//       end_time,

//       duration_min,

//       notes,
//     } = body;

//     // VALIDASI
//     if (
//       !flight_date ||
//       !ama ||
//       !estate ||
//       !pilot ||
//       !flight_id ||
//       !mission_name ||
//       !battery_id ||
//       !battery_id_2 ||
//       !battery_color ||
//       start_percent === undefined ||
//       end_percent === undefined ||
//       !start_volt ||
//       !end_volt ||
//       !start_time ||
//       !end_time ||
//       !duration_min
//     ) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Semua field wajib diisi",
//         },
//         {
//           status: 400,
//         }
//       );
//     }

//     await pool.query(
//       `
//       INSERT INTO drone_flight_history
//       (
//         flight_date,
//         ama,
//         estate,
//         pilot,
//         flight_id,
//         mission_name,
//         battery_id,
//         battery_id_2,
//         battery_color,
//         start_percent,
//         end_percent,
//         start_volt,
//         end_volt,
//         start_time,
//         end_time,
//         duration_min,
//         notes
//       )
//       VALUES
//       (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `,
//       [
//         flight_date,

//         ama,

//         estate,

//         pilot,

//         flight_id,

//         mission_name,

//         battery_id,

//         battery_id_2,

//         battery_color,

//         start_percent,

//         end_percent,

//         start_volt,

//         end_volt,

//         start_time,

//         end_time,

//         duration_min,

//         notes || "",
//       ]
//     );

//     return NextResponse.json({
//       success: true,
//       message: "Flight berhasil ditambahkan",
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Internal server error",
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

    const {
      flight_date,

      ama,

      estate,

      pilot,

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

    // =====================================================
    // VALIDATION
    // =====================================================

    if (
      !flight_date ||
      !ama ||
      !estate ||
      !pilot ||
      !flight_id ||
      !mission_name ||
      !battery_id ||
      !battery_id_2 ||
      !battery_color ||
      start_percent === undefined ||
      end_percent === undefined ||
      start_volt === undefined ||
      end_volt === undefined ||
      !start_time ||
      !end_time ||
      duration_min === undefined
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

    // =====================================================
    // FORMAT DATETIME
    // =====================================================

    const startDateTime = new Date(
      `${flight_date}T${start_time}:00`
    );

    const endDateTime = new Date(
      `${flight_date}T${end_time}:00`
    );

    // =====================================================
    // INVALID DATE CHECK
    // =====================================================

    if (
      isNaN(startDateTime.getTime()) ||
      isNaN(endDateTime.getTime())
    ) {
      return NextResponse.json(
        {
          success: false,

          message:
            "Format waktu tidak valid",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // CREATE
    // =====================================================

    const newFlight =
      await prisma.flight.create({
        data: {
          // JANGAN KIRIM ID
          // Prisma auto increment

          flight_date: new Date(
            flight_date
          ),

          ama,

          estate,

          pilot,

          flight_id,

          mission_name,

          battery_id,

          battery_id_2,

          battery_color,

          start_percent:
            Number(start_percent),

          end_percent:
            Number(end_percent),

          start_volt:
            Number(start_volt),

          end_volt:
            Number(end_volt),

          start_time: startDateTime,

          end_time: endDateTime,

          duration_min:
            Number(duration_min),

          notes: notes || "",
        },
      });

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,

      message:
        "Flight berhasil ditambahkan",

      data: newFlight,
    });
  } catch (error: any) {
    console.error(error);

    // UNIQUE ERROR
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          success: false,

          message:
            "Data flight sudah ada",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,

        message:
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}