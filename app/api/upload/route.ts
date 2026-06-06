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

import Papa from "papaparse";

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

export async function POST(
  req: Request
) {
  try {
    // FILE
    const formData =
      await req.formData();

    const file = formData.get(
      "file"
    ) as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    // READ CSV
    const text = await file.text();

    // PARSE CSV
    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    const rows = parsed.data as any[];

    console.log(rows);

    // FORMAT DATA
    const formattedData = rows.map(
      (item) => ({
        flight_date: parseDate(
          item.flight_date
        ),

        ama: item.ama || "",

        estate:
          item.estate || "",

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
          Number(
            item.start_percent
          ) || 0,

        end_percent:
          Number(
            item.end_percent
          ) || 0,

        start_volt:
          Number(item.start_volt) ||
          0,

        end_volt:
          Number(item.end_volt) ||
          0,

        start_time:
          parseDateTime(
            item.flight_date,
            item.start_time
          ),

        end_time:
          parseDateTime(
            item.flight_date,
            item.end_time
          ),

        duration_min:
          Number(
            item.duration_min
          ) || 0,

        notes: item.notes || "",
      })
    );

    console.log(formattedData);

    // INSERT
    await prisma.flight.createMany({
      data: formattedData,
    });

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