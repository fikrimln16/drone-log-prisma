"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import { ArrowDown, ArrowUp, Search } from "lucide-react";

import UploadCSV from "./upload-csv";

import Navbar from "./navbar";

import DashboardCharts from "./dashboard-charts";

type Mission = {
  mission_name: string;

  total_flights: number;

  total_duration: number;

  avg_duration: number;

  last_flight: string;
};

type DashboardStats = {
  total_missions: number;

  total_flights: number;

  total_duration: number;

  avg_duration: number;
};

type SortKey =
  | "mission_name"
  | "last_flight"
  | "total_flights"
  | "total_duration"
  | "avg_duration";

export default function MissionTable() {
  const [missions, setMissions] = useState<Mission[]>([]);

  const [stats, setStats] = useState<DashboardStats>({
    total_missions: 0,
    total_flights: 0,
    total_duration: 0,
    avg_duration: 0,
  });

  const [search, setSearch] = useState("");

  // SORT
  const [sortBy, setSortBy] = useState<SortKey>("last_flight");

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  // FETCH DATA
  useEffect(() => {
    // MISSIONS
    fetch("/api/missions")
      .then((res) => res.json())
      .then((res) => {
        if (Array.isArray(res)) {
          setMissions(res);
        }
      });

    // DASHBOARD STATS
    fetch("/api/dashboard-stats")
      .then((res) => res.json())
      .then((res) => {
        setStats(res);
      });
  }, []);

  // SORT
  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);

      setSortDirection("asc");
    }
  };

  // FILTER + SORT
  const filteredMissions = useMemo(() => {
    const filtered = missions.filter((item) =>
      item.mission_name.toLowerCase().includes(search.toLowerCase())
    );

    filtered.sort((a, b) => {
      let valueA = a[sortBy];

      let valueB = b[sortBy];

      // DATE
      if (sortBy === "last_flight") {
        valueA = new Date(valueA).getTime();

        valueB = new Date(valueB).getTime();
      }

      // STRING
      if (
        typeof valueA === "string" &&
        typeof valueB === "string" &&
        isNaN(Number(valueA)) &&
        isNaN(Number(valueB))
      ) {
        if (sortDirection === "asc") {
          return valueA.localeCompare(valueB);
        }

        return valueB.localeCompare(valueA);
      }

      // NUMBER
      const numA = parseFloat(String(valueA));

      const numB = parseFloat(String(valueB));

      if (!isNaN(numA) && !isNaN(numB)) {
        if (sortDirection === "asc") {
          return numA - numB;
        }

        return numB - numA;
      }

      return 0;
    });

    return filtered;
  }, [missions, search, sortBy, sortDirection]);

  // SORT ICON
  const renderSortIcon = (key: SortKey) => {
    if (sortBy !== key) {
      return <ArrowDown className="h-4 w-4 text-gray-300" />;
    }

    return sortDirection === "asc" ? (
      <ArrowDown className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowUp className="h-4 w-4 text-blue-600" />
    );
  };

  // PAGINATION
  const totalPages = Math.ceil(filteredMissions.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;

  const endIndex = startIndex + rowsPerPage;

  const paginatedMissions = filteredMissions.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <Navbar title="Mission Dashboard" subtitle="Drone Flight Management" />

      {/* CONTENT */}
      <div className="space-y-6 px-4 pt-[140px] pb-8 md:px-6 xl:px-8">
        {/* STATS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard title="TOTAL MISSIONS" value={stats.total_missions} />

          <StatsCard title="TOTAL FLIGHTS" value={stats.total_flights} />

          <StatsCard
            title="TOTAL DURATION"
            value={`${stats.total_duration} min`}
          />

          <StatsCard
            title="AVG DURATION"
            value={`${Math.round(stats.avg_duration || 0)} min`}
          />
        </div>

        {/* CHART */}
        <DashboardCharts />

        {/* ACTION BAR */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* SEARCH */}
          <div className="relative w-full md:w-[420px]">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);

                setCurrentPage(1);
              }}
              placeholder="Search mission..."
              className="h-[54px] w-full rounded-2xl border bg-white pl-12 text-sm transition outline-none focus:border-blue-500 md:text-base"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* VIEW ALL */}
            <Link href="/flights">
              <button className="flex h-[56px] items-center justify-center rounded-2xl border bg-white px-6 font-semibold shadow-sm transition hover:border-blue-500 hover:bg-blue-50">
                View All Flights
              </button>
            </Link>

            {/* UPLOAD */}
            <UploadCSV />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              {/* HEAD */}
              <thead className="border-b bg-gray-50">
                <tr>
                  {/* MISSION */}
                  <th className="p-4 text-left md:p-6">
                    <button
                      onClick={() => handleSort("mission_name")}
                      className="flex items-center gap-2 text-xs font-bold tracking-wide md:text-sm"
                    >
                      MISSION
                      {renderSortIcon("mission_name")}
                    </button>
                  </th>

                  {/* LAST FLIGHT */}
                  <th className="p-4 text-left md:p-6">
                    <button
                      onClick={() => handleSort("last_flight")}
                      className="flex items-center gap-2 text-xs font-bold tracking-wide md:text-sm"
                    >
                      LAST FLIGHT
                      {renderSortIcon("last_flight")}
                    </button>
                  </th>

                  {/* FLIGHTS */}
                  <th className="p-4 text-left md:p-6">
                    <button
                      onClick={() => handleSort("total_flights")}
                      className="flex items-center gap-2 text-xs font-bold tracking-wide md:text-sm"
                    >
                      FLIGHTS
                      {renderSortIcon("total_flights")}
                    </button>
                  </th>

                  {/* TOTAL */}
                  <th className="p-4 text-left md:p-6">
                    <button
                      onClick={() => handleSort("total_duration")}
                      className="flex items-center gap-2 text-xs font-bold tracking-wide md:text-sm"
                    >
                      TOTAL DURATION
                      {renderSortIcon("total_duration")}
                    </button>
                  </th>

                  {/* AVG */}
                  <th className="p-4 text-left md:p-6">
                    <button
                      onClick={() => handleSort("avg_duration")}
                      className="flex items-center gap-2 text-xs font-bold tracking-wide md:text-sm"
                    >
                      AVG DURATION
                      {renderSortIcon("avg_duration")}
                    </button>
                  </th>

                  {/* ACTION */}
                  <th className="p-4 text-right text-xs font-bold tracking-wide md:p-6 md:text-sm">
                    ACTION
                  </th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {paginatedMissions.map((item) => (
                  <tr
                    key={item.mission_name}
                    className="border-b transition hover:bg-gray-50"
                  >
                    {/* MISSION */}
                    <td className="p-4 md:p-6">
                      <span className="rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold text-blue-700 md:text-sm">
                        {item.mission_name}
                      </span>
                    </td>

                    {/* LAST */}
                    <td className="p-4 text-sm md:p-6 md:text-lg">
                      {new Date(item.last_flight).toLocaleDateString("id-ID")}
                    </td>

                    {/* FLIGHTS */}
                    <td className="p-4 md:p-6">
                      <span className="rounded-full bg-purple-100 px-4 py-1 text-xs text-purple-700 md:text-sm">
                        {item.total_flights} flights
                      </span>
                    </td>

                    {/* TOTAL */}
                    <td className="p-4 md:p-6">
                      <span className="rounded-full bg-yellow-100 px-4 py-1 text-xs text-yellow-700 md:text-sm">
                        {item.total_duration} min
                      </span>
                    </td>

                    {/* AVG */}
                    <td className="p-4 text-sm md:p-6 md:text-lg">
                      {item.avg_duration} min
                    </td>

                    {/* ACTION */}
                    <td className="p-4 text-right md:p-6">
                      <Link
                        href={`/missions/${item.mission_name}`}
                        className="inline-flex rounded-2xl border bg-white px-4 py-2 text-sm transition hover:bg-gray-100 md:px-5"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}

                {/* EMPTY */}
                {paginatedMissions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-20 text-center text-gray-400">
                      No missions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="flex flex-col items-center justify-between gap-4 border-t bg-white px-6 py-5 md:flex-row">
              {/* INFO */}
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-black">
                  {startIndex + 1}
                </span>
                –
                <span className="font-semibold text-black">
                  {Math.min(endIndex, filteredMissions.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-black">
                  {filteredMissions.length}
                </span>{" "}
                missions
              </p>

              {/* BUTTON */}
              <div className="flex items-center gap-2">
                {/* PREV */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="rounded-xl border px-4 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Prev
                </button>

                {/* PAGE */}
                {Array.from({
                  length: totalPages,
                }).map((_, index) => {
                  const page = index + 1;

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-10 w-10 rounded-xl text-sm font-semibold transition ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "border hover:bg-gray-100"
                      } `}
                    >
                      {page}
                    </button>
                  );
                })}

                {/* NEXT */}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="rounded-xl border px-4 py-2 text-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
}: {
  title: string;

  value: string | number;
}) {
  return (
    <div className="rounded-[32px] border bg-white p-6 shadow-sm md:p-8">
      <p className="text-xs font-medium tracking-wide text-gray-500 uppercase md:text-sm">
        {title}
      </p>

      <h1 className="mt-4 text-4xl font-bold md:mt-5 md:text-6xl">{value}</h1>
    </div>
  );
}
