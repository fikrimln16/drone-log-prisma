import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

// =====================================================
// PARSE DATE
// FORMAT:
// 01-01-2026
// =====================================================

function parseDate(dateString: string) {
  const [day, month, year] =
    dateString.split("-");

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  );
}

// =====================================================
// PARSE DATETIME
// FORMAT:
// 01-01-2026 + 13:00
// =====================================================

function parseDateTime(
  dateString: string,
  timeString: string
) {
  const [day, month, year] =
    dateString.split("-");

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
        // DATE
        flight_date:
          item.flight_date
            ? parseDate(
                item.flight_date
              )
            : new Date(),

        // TEXT
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

        // NUMBER
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

        // DATETIME
        start_time:
          item.start_time &&
          item.flight_date
            ? parseDateTime(
                item.flight_date,
                item.start_time
              )
            : undefined,

        end_time:
          item.end_time &&
          item.flight_date
            ? parseDateTime(
                item.flight_date,
                item.end_time
              )
            : undefined,

        // NUMBER
        duration_min:
          item.duration_min !==
          undefined
            ? Number(
                item.duration_min
              )
            : 0,

        // NOTES
        notes: item.notes || "",
      })
    );

    console.log(formattedData);

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