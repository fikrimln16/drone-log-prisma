"use client";

import { toast } from "sonner";

export default function useExportCSV() {
  function exportCSV(mission: string, flights: any[]) {
    if (!flights.length) return;

    const headers = [
      "flight_date",
      "ama",
      "estate",
      "pilot",
      "flight_id",
      "mission_name",
      "battery_id",
      "battery_id_2",
      "battery_color",
      "start_percent",
      "end_percent",
      "start_volt",
      "end_volt",
      "start_time",
      "end_time",
      "duration_min",
      "notes",
    ];

    const csvRows = [
      headers.join(","),

      ...flights.map((item) =>
        [
          item.flight_date,
          item.ama,
          item.estate,
          item.pilot,
          item.flight_id,
          item.mission_name,
          item.battery_id,
          item.battery_id_2,
          item.battery_color,
          item.start_percent,
          item.end_percent,
          item.start_volt,
          item.end_volt,
          item.start_time,
          item.end_time,
          item.duration_min,
          `"${item.notes || ""}"`,
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const today = new Date();

    const date =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0");

    const fileName = `${mission.toUpperCase()}_${date}.csv`;

    const link = document.createElement("a");

    const url = URL.createObjectURL(blob);

    link.href = url;

    link.download = fileName;

    link.click();

    URL.revokeObjectURL(url);

    toast.success("CSV exported successfully");
  }

  return {
    exportCSV,
  };
}
