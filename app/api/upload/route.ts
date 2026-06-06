// import pool from "@/lib/db";

// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();

//     const file = formData.get("file") as File;

//     if (!file) {
//       return NextResponse.json(
//         {
//           message: "No file uploaded",
//         },
//         {
//           status: 400,
//         }
//       );
//     }

//     const text = await file.text();

//     const rows = text.split("\n");

//     rows.shift();

//     for (const row of rows) {
//       if (!row.trim()) continue;

//       const cols = row.split(",");

//       await pool.query(
//         `
//         INSERT INTO drone_flight_history
//         (
//           flight_date,
//           flight_id,
//           mission_name,
//           battery_id,
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
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//         `,
//         [
//           cols[0],
//           cols[1],
//           cols[2],
//           cols[3],
//           cols[4],
//           cols[5],
//           cols[6],
//           cols[7],
//           cols[8],
//           cols[9],
//           cols[10],
//           cols[11],
//           cols[12],
//         ]
//       );
//     }

//     return NextResponse.json({
//       message: "CSV uploaded successfully",
//     });
//   } catch (error) {
//     console.error(error);

//     return NextResponse.json(
//       {
//         message: "Upload failed",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

import { prisma } from "@/lib/prisma";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // =====================================================
    // GET FILE
    // =====================================================

    const formData =
      await req.formData();

    const file = formData.get(
      "file"
    ) as File;

    // =====================================================
    // VALIDATION
    // =====================================================

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

    // =====================================================
    // READ CSV
    // =====================================================

    const text = await file.text();

    const rows = text.split("\n");

    // REMOVE HEADER
    rows.shift();

    // =====================================================
    // PREPARE DATA
    // =====================================================

    const data = rows
      .filter((row) => row.trim())
      .map((row) => {
        const cols = row
          .split(",")
          .map((col) => col.trim());

        return {
          flight_date: cols[0]
            ? new Date(cols[0])
            : new Date(),

          flight_id: cols[1] || "",

          mission_name:
            cols[2] || "",

          battery_id:
            cols[3] || "",

          battery_color:
            cols[4] || "",

          start_percent: cols[5]
            ? Number(cols[5])
            : 0,

          end_percent: cols[6]
            ? Number(cols[6])
            : 0,

          start_volt: cols[7]
            ? Number(cols[7])
            : 0,

          end_volt: cols[8]
            ? Number(cols[8])
            : 0,

          start_time: cols[9]
            ? new Date(cols[9])
            : undefined,

          end_time: cols[10]
            ? new Date(cols[10])
            : undefined,

          duration_min: cols[11]
            ? Number(cols[11])
            : 0,

          notes: cols[12] || "",
        };
      });

    // =====================================================
    // INSERT MANY
    // =====================================================

    await prisma.flight.createMany({
      data,
    });

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      message:
        "CSV uploaded successfully",
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