export default function exportFlightsCSV(flights: any[]) {
  const headers = [
    "Flight Date",
    "AMA",
    "Estate",
    "Flight ID",
    "Mission",
    "Pilot",
    "Battery",
    "Duration",
  ];

  const rows = flights.map((item) => [
    item.flight_date,
    item.ama,
    item.estate,
    item.flight_id,
    item.mission_name,
    item.pilot,
    item.battery_id,
    item.duration_min,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = "all-flights.csv";

  link.click();
}
