// import { NextResponse } from "next/server";

// import pool from "@/lib/db";

// type Params = {
//   params: Promise<{
//     id: string;
//   }>;
// };

// export async function DELETE(req: Request, { params }: Params) {
//   try {
//     // AWAIT PARAMS
//     const { id } = await params;

//     await pool.query(
//       `
//       DELETE FROM drone_flight_history
//       WHERE id = ?
//       `,
//       [id]
//     );

//     return NextResponse.json({
//       success: true,
//       message: "Flight deleted successfully",
//     });
//   } catch (err) {
//     console.error(err);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Delete failed",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }

// export async function PUT(req: Request, { params }: Params) {
//   try {
//     const { id } = await params;

//     const body = await req.json();

//     await pool.query(
//       `
//       UPDATE drone_flight_history
//       SET
//         flight_date = ?,
//         ama = ?,
//         estate = ?,
//         pilot = ?,
//         flight_id = ?,
//         mission_name = ?,
//         battery_id = ?,
//         battery_id_2 = ?,
//         battery_color = ?,
//         start_percent = ?,
//         end_percent = ?,
//         start_volt = ?,
//         end_volt = ?,
//         start_time = ?,
//         end_time = ?,
//         duration_min = ?,
//         notes = ?
//       WHERE id = ?
//       `,
//       [
//         body.flight_date,
//         body.ama,
//         body.estate,
//         body.pilot,
//         body.flight_id,
//         body.mission_name,
//         body.battery_id,
//         body.battery_id_2,
//         body.battery_color,
//         body.start_percent,
//         body.end_percent,
//         body.start_volt,
//         body.end_volt,
//         body.start_time,
//         body.end_time,
//         body.duration_min,
//         body.notes,
//         id,
//       ]
//     );

//     return NextResponse.json({
//       success: true,
//       message: "Flight updated successfully",
//     });
//   } catch (err) {
//     console.error(err);

//     return NextResponse.json(
//       {
//         success: false,
//         message: "Update failed",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// =====================================================
// DELETE
// =====================================================

export async function DELETE(
  req: Request,
  { params }: Params
) {
  try {
    // PARAMS
    const { id } = await params;

    // DELETE
    await prisma.flight.delete({
      where: {
        id: Number(id),
      },
    });

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

// =====================================================
// UPDATE
// =====================================================

export async function PUT(
  req: Request,
  { params }: Params
) {
  try {
    // PARAMS
    const { id } = await params;

    // BODY
    const body = await req.json();

    // UPDATE
    const updatedFlight =
      await prisma.flight.update({
        where: {
          id: Number(id),
        },

        data: {
          flight_date: body.flight_date
            ? new Date(body.flight_date)
            : undefined,

          ama: body.ama || undefined,

          estate: body.estate || undefined,

          pilot: body.pilot || undefined,

          flight_id:
            body.flight_id || undefined,

          mission_name:
            body.mission_name ||
            undefined,

          battery_id:
            body.battery_id ||
            undefined,

          battery_id_2:
            body.battery_id_2 ||
            undefined,

          battery_color:
            body.battery_color ||
            undefined,

          start_percent:
            body.start_percent !==
            undefined
              ? Number(body.start_percent)
              : undefined,

          end_percent:
            body.end_percent !==
            undefined
              ? Number(body.end_percent)
              : undefined,

          start_volt:
            body.start_volt !==
            undefined
              ? Number(body.start_volt)
              : undefined,

          end_volt:
            body.end_volt !==
            undefined
              ? Number(body.end_volt)
              : undefined,

          start_time: body.start_time
            ? new Date(body.start_time)
            : undefined,

          end_time: body.end_time
            ? new Date(body.end_time)
            : undefined,

          duration_min:
            body.duration_min !==
            undefined
              ? Number(body.duration_min)
              : undefined,

          notes: body.notes || undefined,
        },
      });

    return NextResponse.json({
      success: true,

      message:
        "Flight updated successfully",

      data: updatedFlight,
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