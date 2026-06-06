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
    // HELPER
    // =====================================================

    function parseDate(
      dateString: string
    ) {
      const [day, month, year] =
        dateString.split("/");

      return new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      );
    }

    function parseDateTime(
      dateString: string,
      timeString: string
    ) {
      const [day, month, year] =
        dateString.split("/");

      const [hour, minute] =
        timeString.split(":");

      return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
        0
      );
    }

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
          // DATE
          flight_date: cols[0]
            ? parseDate(cols[0])
            : new Date(),

          // TEXT
          ama: cols[1] || "",

          estate: cols[2] || "",

          pilot: cols[3] || "",

          flight_id: cols[4] || "",

          mission_name:
            cols[5] || "",

          battery_id:
            cols[6] || "",

          battery_id_2:
            cols[7] || "",

          battery_color:
            cols[8] || "",

          // NUMBER
          start_percent: cols[9]
            ? Number(cols[9])
            : 0,

          end_percent: cols[10]
            ? Number(cols[10])
            : 0,

          start_volt: cols[11]
            ? Number(cols[11])
            : 0,

          end_volt: cols[12]
            ? Number(cols[12])
            : 0,

          // DATETIME
          start_time:
            cols[13] && cols[0]
              ? parseDateTime(
                  cols[0],
                  cols[13]
                )
              : undefined,

          end_time:
            cols[14] && cols[0]
              ? parseDateTime(
                  cols[0],
                  cols[14]
                )
              : undefined,

          // DURATION
          duration_min: cols[15]
            ? Number(cols[15])
            : 0,

          // NOTES
          notes: cols[16] || "",
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
      success: true,

      message:
        "CSV uploaded successfully",
    });
  } catch (error) {
    console.error(error);

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