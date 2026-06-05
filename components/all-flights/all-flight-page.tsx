"use client";

import Link from "next/link";

import { useEffect, useMemo, useState } from "react";

import { ArrowDown, ArrowUp, Download, RotateCcw } from "lucide-react";

import Navbar from "../layout/navbar";

import UploadCSV from "../upload-csv";

type SortKey =
  | "flight_date"
  | "ama"
  | "estate"
  | "flight_id"
  | "mission_name"
  | "pilot"
  | "battery_id"
  | "duration_min";

export default function AllFlightTable() {
  // DATA
  const [flights, setFlights] = useState<any[]>([]);

  // SEARCH
  const [search, setSearch] = useState("");

  // FILTER
  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [selectedMission, setSelectedMission] = useState("");

  const [selectedAma, setSelectedAma] = useState("");

  const [selectedEstate, setSelectedEstate] = useState("");

  const [selectedBattery, setSelectedBattery] = useState("");

  const [selectedPilot, setSelectedPilot] = useState("");

  // SORT
  const [sortBy, setSortBy] = useState<SortKey>("flight_date");

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // FETCH
  useEffect(() => {
    fetch("/api/flights")
      .then((res) => res.json())
      .then((data) => setFlights(data));
  }, []);

  // OPTIONS
  const missionOptions = [...new Set(flights.map((item) => item.mission_name))];

  const amaOptions = [...new Set(flights.map((item) => item.ama))];

  const estateOptions = [...new Set(flights.map((item) => item.estate))];

  const batteryOptions = [...new Set(flights.map((item) => item.battery_id))];

  const pilotOptions = [
    ...new Set(flights.map((item) => item.pilot).filter(Boolean)),
  ];

  // FILTERED
  const filteredFlights = useMemo(() => {
    return flights.filter((item) => {
      const validSearch =
        !search ||
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());

      const validMission =
        !selectedMission || item.mission_name === selectedMission;

      const validAma = !selectedAma || item.ama === selectedAma;

      const validEstate = !selectedEstate || item.estate === selectedEstate;

      const validBattery =
        !selectedBattery || item.battery_id === selectedBattery;

      const validPilot = !selectedPilot || item.pilot === selectedPilot;

      const itemDate = new Date(item.flight_date);

      const validStart = !startDate || itemDate >= new Date(startDate);

      const validEnd = !endDate || itemDate <= new Date(endDate);

      return (
        validSearch &&
        validMission &&
        validAma &&
        validEstate &&
        validBattery &&
        validPilot &&
        validStart &&
        validEnd
      );
    });
  }, [
    flights,
    search,
    selectedMission,
    selectedAma,
    selectedEstate,
    selectedBattery,
    selectedPilot,
    startDate,
    endDate,
  ]);

  // SORTED
  const sortedFlights = useMemo(() => {
    return [...filteredFlights].sort((a, b) => {
      const valueA = a[sortBy];

      const valueB = b[sortBy];

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      }

      return valueA < valueB ? 1 : -1;
    });
  }, [filteredFlights, sortBy, sortDirection]);

  // SORT HANDLER
  function handleSort(key: SortKey) {
    if (sortBy === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);

      setSortDirection("asc");
    }
  }

  // RESET
  function resetFilters() {
    setSearch("");

    setStartDate("");

    setEndDate("");

    setSelectedMission("");

    setSelectedAma("");

    setSelectedEstate("");

    setSelectedBattery("");

    setSelectedPilot("");
  }

  // EXPORT CSV
  function exportCSV() {
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

    const rows = sortedFlights.map((item) => [
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

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* NAVBAR */}
      <Navbar title="All Flights" subtitle="Complete drone flight history" />

      {/* CONTENT */}
      <div className="space-y-5 px-4 pt-[120px] pb-8">
        {/* BACK */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-2xl border bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:bg-gray-100"
        >
          ← Back to Dashboard
        </Link>

        {/* FILTER */}
        <div className="rounded-[32px] border bg-white p-5 shadow-sm">
          {/* SEARCH */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search flight..."
            className="mb-5 h-[54px] w-full rounded-2xl border px-5 outline-none"
          />

          {/* FILTER GRID */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {/* START */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-600">
                Start Date
              </label>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-[54px] w-full rounded-2xl border px-4 outline-none"
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
                className="h-[54px] w-full rounded-2xl border px-4 outline-none"
              />
            </div>

            {/* MISSION */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-600">
                Mission
              </label>

              <select
                value={selectedMission}
                onChange={(e) => setSelectedMission(e.target.value)}
                className="h-[54px] w-full rounded-2xl border px-4 outline-none"
              >
                <option value="">All Mission</option>

                {missionOptions.map((item) => (
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
                value={selectedAma}
                onChange={(e) => setSelectedAma(e.target.value)}
                className="h-[54px] w-full rounded-2xl border px-4 outline-none"
              >
                <option value="">All AMA</option>

                {amaOptions.map((item) => (
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
                value={selectedEstate}
                onChange={(e) => setSelectedEstate(e.target.value)}
                className="h-[54px] w-full rounded-2xl border px-4 outline-none"
              >
                <option value="">All Estate</option>

                {estateOptions.map((item) => (
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
                value={selectedBattery}
                onChange={(e) => setSelectedBattery(e.target.value)}
                className="h-[54px] w-full rounded-2xl border px-4 outline-none"
              >
                <option value="">All Battery</option>

                {batteryOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* PILOT */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-600">
                Pilot
              </label>

              <select
                value={selectedPilot}
                onChange={(e) => setSelectedPilot(e.target.value)}
                className="h-[54px] w-full rounded-2xl border px-4 outline-none"
              >
                <option value="">All Pilot</option>

                {pilotOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ACTION */}
          <div className="mt-5 flex items-center justify-between">
            <button
              onClick={resetFilters}
              className="flex h-[48px] items-center gap-2 rounded-2xl border px-5 transition hover:bg-gray-100"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Filters
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={exportCSV}
                className="flex h-[48px] items-center gap-2 rounded-2xl border bg-white px-5 font-semibold transition hover:bg-gray-100"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>

              <UploadCSV />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1400px]">
              <thead className="border-b bg-gray-50">
                <tr>
                  {[
                    {
                      label: "DATE",
                      key: "flight_date",
                    },
                    {
                      label: "AMA",
                      key: "ama",
                    },
                    {
                      label: "ESTATE",
                      key: "estate",
                    },
                    {
                      label: "FLIGHT ID",
                      key: "flight_id",
                    },
                    {
                      label: "MISSION",
                      key: "mission_name",
                    },
                    {
                      label: "PILOT",
                      key: "pilot",
                    },
                    {
                      label: "BATTERY",
                      key: "battery_id",
                    },
                    {
                      label: "DURATION",
                      key: "duration_min",
                    },
                  ].map((column) => (
                    <th
                      key={column.key}
                      onClick={() => handleSort(column.key as SortKey)}
                      className="cursor-pointer p-5 text-left text-sm font-bold tracking-wide text-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        {column.label}

                        {sortBy === column.key ? (
                          sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4 text-blue-600" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-blue-600" />
                          )
                        ) : (
                          <ArrowDown className="h-4 w-4 text-gray-300" />
                        )}
                      </div>
                    </th>
                  ))}

                  <th className="p-5 text-right text-sm font-bold tracking-wide text-gray-700">
                    ACTION
                  </th>
                </tr>
              </thead>

              <tbody>
                {sortedFlights.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b transition hover:bg-gray-50"
                  >
                    {/* DATE */}
                    <td className="p-5">
                      {new Date(item.flight_date).toLocaleDateString("id-ID")}
                    </td>

                    {/* AMA */}
                    <td className="p-5">
                      <span className="rounded-full bg-purple-100 px-4 py-1 text-sm text-purple-700">
                        {item.ama}
                      </span>
                    </td>

                    {/* ESTATE */}
                    <td className="p-5">
                      <span className="rounded-full bg-green-100 px-4 py-1 text-sm text-green-700">
                        {item.estate}
                      </span>
                    </td>

                    {/* FLIGHT */}
                    <td className="p-5">
                      <span className="rounded-full bg-blue-100 px-4 py-1 text-sm text-blue-700">
                        {item.flight_id}
                      </span>
                    </td>

                    {/* MISSION */}
                    <td className="p-5 font-medium">{item.mission_name}</td>

                    {/* PILOT */}
                    <td className="p-5">
                      <span className="rounded-full bg-cyan-100 px-4 py-1 text-sm text-cyan-700">
                        {item.pilot || "-"}
                      </span>
                    </td>

                    {/* BATTERY */}
                    <td className="p-5">{item.battery_id}</td>

                    {/* DURATION */}
                    <td className="p-5">
                      <span className="rounded-full bg-yellow-100 px-4 py-1 text-sm text-yellow-700">
                        {item.duration_min} min
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="p-5">
                      <div className="flex justify-end gap-2">
                        <button className="rounded-xl border px-4 py-2 text-sm transition hover:bg-gray-100">
                          Detail
                        </button>

                        <button className="rounded-xl bg-blue-50 px-4 py-2 text-sm text-blue-600 transition hover:bg-blue-100">
                          Edit
                        </button>

                        <button className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600 transition hover:bg-red-100">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {sortedFlights.length === 0 && (
                  <tr>
                    <td colSpan={9} className="p-10 text-center text-gray-500">
                      No flights found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
