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
