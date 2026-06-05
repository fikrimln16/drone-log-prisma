"use client";

import { useEffect, useMemo, useState } from "react";

import { Download, Loader2, X } from "lucide-react";

import { toast } from "sonner";

import FlightDetailModal from "./flights/flight-detail-modal";

type Props = {
  open: boolean;

  flights: any[];

  onClose: () => void;
};

export default function ExportCSVModal({ open, flights, onClose }: Props) {
  const [search, setSearch] = useState("");

  const [mission, setMission] = useState("");

  const [ama, setAma] = useState("");

  const [estate, setEstate] = useState("");

  const [battery, setBattery] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedFlight, setSelectedFlight] = useState<any>(null);

  const missions = useMemo(() => {
    return [...new Set(flights.map((item) => item.mission_name))];
  }, [flights]);

  const amas = [...new Set(flights.map((item) => item.ama))];

  const estates = [...new Set(flights.map((item) => item.estate))];

  const batteries = [...new Set(flights.map((item) => item.battery_id))];

  // FILTER
  const filteredFlights = flights.filter((item) => {
    const itemDate = new Date(item.flight_date);

    // SEARCH
    const validSearch =
      !search ||
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

    // MISSION
    const validMission = !mission || item.mission_name === mission;

    // AMA
    const validAma = !ama || item.ama === ama;

    // ESTATE
    const validEstate = !estate || item.estate === estate;

    // BATTERY
    const validBattery = !battery || item.battery_id === battery;

    // DATE
    const validStart = !startDate || itemDate >= new Date(startDate);

    const validEnd = !endDate || itemDate <= new Date(endDate);

    return (
      validSearch &&
      validMission &&
      validAma &&
      validEstate &&
      validBattery &&
      validStart &&
      validEnd
    );
  });

  // EXPORT
  async function handleExport() {
    try {
      setLoading(true);

      // DELAY UX
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const headers = [
        "flight_date",
        "ama",
        "estate",
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

        ...filteredFlights.map((item) =>
          [
            item.flight_date,
            item.ama,
            item.estate,
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

      const fileName = `FLIGHT_EXPORT_${today.toISOString().split("T")[0]}.csv`;

      const link = document.createElement("a");

      const url = URL.createObjectURL(blob);

      link.href = url;

      link.download = fileName;

      link.click();

      URL.revokeObjectURL(url);

      toast.success("CSV exported successfully");

      // AUTO CLOSE
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (error) {
      console.error(error);

      toast.error("Export failed");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      {/* MODAL */}
      <div className="flex h-[90vh] w-full max-w-[1400px] flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between border-b px-8 py-6">
          <div>
            <h1 className="text-4xl font-bold">Export Flight CSV</h1>

            <p className="mt-2 text-gray-500">
              Filter and preview flight data before exporting
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-full border hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FILTER */}
        <div className="border-b bg-gray-50 px-8 py-6">
          {/* TOP */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search flight..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-[54px] w-full rounded-2xl border bg-white px-5 outline-none"
            />
          </div>

          {/* FILTER GRID */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
            {/* START */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-600">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-[54px] w-full rounded-2xl border bg-white px-4 outline-none"
              />
            </div>

            {/* END */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-600">
                End Date
              </label>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-[54px] w-full rounded-2xl border bg-white px-4 outline-none"
              />
            </div>

            {/* MISSION */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-600">
                Mission
              </label>

              <select
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                className="h-[54px] w-full rounded-2xl border bg-white px-4 outline-none"
              >
                <option value="">All Missions</option>

                {missions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* AMA */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-600">
                AMA
              </label>

              <select
                value={ama}
                onChange={(e) => setAma(e.target.value)}
                className="h-[54px] w-full rounded-2xl border bg-white px-4 outline-none"
              >
                <option value="">All AMA</option>

                {amas.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* ESTATE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-600">
                Estate
              </label>

              <select
                value={estate}
                onChange={(e) => setEstate(e.target.value)}
                className="h-[54px] w-full rounded-2xl border bg-white px-4 outline-none"
              >
                <option value="">All Estate</option>

                {estates.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* BATTERY */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-600">
                Battery
              </label>

              <select
                value={battery}
                onChange={(e) => setBattery(e.target.value)}
                className="h-[54px] w-full rounded-2xl border bg-white px-4 outline-none"
              >
                <option value="">All Battery</option>

                {batteries.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* RESET */}
          <div className="mt-5">
            <button
              onClick={() => {
                setSearch("");
                setMission("");
                setAma("");
                setEstate("");
                setBattery("");
                setStartDate("");
                setEndDate("");
              }}
              className="rounded-2xl border bg-white px-5 py-3 font-medium hover:bg-gray-100"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="flex-1 overflow-auto">
          <table className="w-full min-w-[1400px]">
            <thead className="sticky top-0 border-b bg-white">
              <tr>
                {[
                  "DATE",
                  "AMA",
                  "ESTATE",
                  "FLIGHT ID",
                  "MISSION",
                  "BATTERY",
                  "DURATION",
                  "ACTION",
                ].map((item) => (
                  <th key={item} className="p-5 text-left text-sm font-bold">
                    {item}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredFlights.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="p-5">
                    {new Date(item.flight_date).toLocaleDateString("id-ID")}
                  </td>

                  <td className="p-5">{item.ama}</td>

                  <td className="p-5">{item.estate}</td>

                  <td className="p-5">{item.flight_id}</td>

                  <td className="p-5">{item.mission_name}</td>

                  <td className="p-5">{item.battery_id}</td>

                  <td className="p-5">{item.duration_min} min</td>

                  <td className="p-5">
                    <button
                      onClick={() => setSelectedFlight(item)}
                      className="rounded-xl border px-4 py-2 text-sm transition hover:bg-gray-100"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t px-8 py-5">
          <p className="text-sm text-gray-500">
            {filteredFlights.length} flights selected
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-2xl border px-5 py-3 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              disabled={filteredFlights.length === 0 || loading}
              onClick={handleExport}
              className="flex min-w-[180px] items-center justify-center gap-3 rounded-2xl bg-black px-6 py-3 font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5" />
                  Export CSV
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      <FlightDetailModal
        data={selectedFlight}
        onClose={() => setSelectedFlight(null)}
      />
    </div>
  );
}
