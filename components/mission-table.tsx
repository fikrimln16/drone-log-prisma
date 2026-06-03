"use client";

import Link from "next/link";

import { useEffect, useMemo, useState } from "react";

import { ArrowDown, ArrowUp, Plane, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import UploadCSV from "./upload-csv";

type Mission = {
  mission_name: string;
  total_flights: number;
  total_duration: number;
  avg_duration: number;
  last_flight: string;
};

type SortColumn =
  | "mission_name"
  | "last_flight"
  | "total_flights"
  | "total_duration"
  | "avg_duration";

export default function MissionTable() {
  const [missions, setMissions] = useState<Mission[]>([]);

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState<SortColumn>("last_flight");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetch("/api/missions")
      .then((res) => res.json())
      .then((res) => {
        if (Array.isArray(res)) {
          setMissions(res);
        }
      });
  }, []);

  // SORT
  const handleSort = (column: SortColumn) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);

      setSortOrder("asc");
    }
  };

  // SORT ICON
  // DESC = UP
  // ASC = DOWN
  const renderSortIcon = (column: SortColumn) => {
    if (sortBy !== column) {
      return <ArrowDown className="h-4 w-4 opacity-30" />;
    }

    return sortOrder === "desc" ? (
      <ArrowUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-blue-600" />
    );
  };

  // FILTER + SORT
  const filteredMissions = useMemo(() => {
    const filtered = missions.filter((item) =>
      item.mission_name.toLowerCase().includes(search.toLowerCase())
    );

    filtered.sort((a, b) => {
      const aValue = a[sortBy];

      const bValue = b[sortBy];

      // NUMBER
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      // STRING
      return sortOrder === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    return filtered;
  }, [missions, search, sortBy, sortOrder]);

  // STATS
  const totalFlights = missions.reduce(
    (a, b) => a + Number(b.total_flights),
    0
  );

  const totalDuration = missions.reduce(
    (a, b) => a + Number(b.total_duration),
    0
  );

  const avgDuration = Math.round(
    missions.reduce((a, b) => a + Number(b.avg_duration), 0) /
      (missions.length || 1)
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* FIXED NAVBAR */}
      <div className="fixed top-0 left-0 z-[999] flex h-[92px] w-full items-center justify-between border-b bg-white/90 px-8 backdrop-blur-md">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {/* LOGO */}
          <div className="flex h-[58px] w-[58px] items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
            <Plane className="h-7 w-7 text-white" />
          </div>

          {/* TITLE */}
          <div>
            <h1 className="text-4xl font-bold">Flight Check</h1>

            <p className="text-lg text-gray-500">UAV Flight Log Manager</p>
          </div>
        </div>

        {/* RIGHT */}
        <UploadCSV />
      </div>

      {/* CONTENT */}
      <div className="space-y-8 px-8 pt-[125px] pb-10">
        {/* STATS */}
        <div className="grid grid-cols-4 gap-6">
          <StatsCard
            title="MISSIONS"
            value={missions.length}
            subtitle="unique missions"
          />

          <StatsCard
            title="TOTAL FLIGHTS"
            value={totalFlights}
            subtitle="all flights"
          />

          <StatsCard
            title="TOTAL DURATION"
            value={`${totalDuration} min`}
            subtitle="flight duration"
          />

          <StatsCard
            title="AVG DURATION"
            value={`${avgDuration} min`}
            subtitle="average flight"
          />
        </div>

        {/* TABLE */}
        <Card className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
          <CardContent className="p-0">
            {/* SEARCH */}
            <div className="flex items-center justify-between border-b px-8 py-6">
              <div className="relative w-[420px]">
                <Search className="absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search missions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-[58px] w-full rounded-full border bg-gray-50 pr-5 pl-14 text-lg transition outline-none focus:border-blue-500"
                />
              </div>

              <p className="text-lg text-gray-500">
                {filteredMissions.length} mission
              </p>
            </div>

            {/* TABLE CONTENT */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    {/* MISSION */}
                    <th className="px-8 py-5 text-left">
                      <button
                        onClick={() => handleSort("mission_name")}
                        className="flex cursor-pointer items-center gap-2 text-sm font-bold tracking-wide transition hover:text-blue-600"
                      >
                        MISSION NAME
                        {renderSortIcon("mission_name")}
                      </button>
                    </th>

                    {/* LAST FLIGHT */}
                    <th className="px-8 py-5 text-left">
                      <button
                        onClick={() => handleSort("last_flight")}
                        className="flex cursor-pointer items-center gap-2 text-sm font-bold tracking-wide transition hover:text-blue-600"
                      >
                        LAST FLIGHT
                        {renderSortIcon("last_flight")}
                      </button>
                    </th>

                    {/* FLIGHTS */}
                    <th className="px-8 py-5 text-left">
                      <button
                        onClick={() => handleSort("total_flights")}
                        className="flex cursor-pointer items-center gap-2 text-sm font-bold tracking-wide transition hover:text-blue-600"
                      >
                        FLIGHTS
                        {renderSortIcon("total_flights")}
                      </button>
                    </th>

                    {/* TOTAL DURATION */}
                    <th className="px-8 py-5 text-left">
                      <button
                        onClick={() => handleSort("total_duration")}
                        className="flex cursor-pointer items-center gap-2 text-sm font-bold tracking-wide transition hover:text-blue-600"
                      >
                        TOTAL DURATION
                        {renderSortIcon("total_duration")}
                      </button>
                    </th>

                    {/* AVG */}
                    <th className="px-8 py-5 text-left">
                      <button
                        onClick={() => handleSort("avg_duration")}
                        className="flex cursor-pointer items-center gap-2 text-sm font-bold tracking-wide transition hover:text-blue-600"
                      >
                        AVG DURATION
                        {renderSortIcon("avg_duration")}
                      </button>
                    </th>

                    {/* ACTION */}
                    <th className="px-8 py-5 text-right text-sm font-bold tracking-wide">
                      ACTION
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMissions.map((item) => (
                    <tr
                      key={item.mission_name}
                      className="border-b transition hover:bg-gray-50"
                    >
                      {/* MISSION */}
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100">
                            <Plane className="h-5 w-5 text-orange-500" />
                          </div>

                          <div>
                            <p className="text-xl font-semibold text-blue-600">
                              {item.mission_name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* LAST FLIGHT */}
                      <td className="px-8 py-6 text-lg">
                        {new Date(item.last_flight).toLocaleDateString(
                          "id-ID",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>

                      {/* FLIGHTS */}
                      <td className="px-8 py-6">
                        <Badge
                          variant="secondary"
                          className="rounded-full px-4 py-1 text-sm"
                        >
                          {item.total_flights} flights
                        </Badge>
                      </td>

                      {/* DURATION */}
                      <td className="px-8 py-6">
                        <Badge className="rounded-full bg-yellow-100 px-4 py-1 text-sm text-yellow-700 hover:bg-yellow-100">
                          {item.total_duration} min
                        </Badge>
                      </td>

                      {/* AVG */}
                      <td className="px-8 py-6 text-lg">
                        {item.avg_duration} min / flight
                      </td>

                      {/* ACTION */}
                      <td className="px-8 py-6 text-right">
                        <Link href={`/missions/${item.mission_name}`}>
                          <Button className="h-[48px] rounded-2xl border bg-white px-6 text-black shadow-none hover:bg-gray-100">
                            View →
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}

                  {/* EMPTY */}
                  {filteredMissions.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-20 text-center text-gray-400"
                      >
                        No missions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string | number;
  subtitle: string;
}) {
  return (
    <Card className="rounded-[32px] border bg-white shadow-sm">
      <CardContent className="p-8">
        <p className="text-sm font-medium tracking-wide text-gray-500 uppercase">
          {title}
        </p>

        <h1 className="mt-5 text-5xl font-bold">{value}</h1>

        <p className="mt-4 text-gray-500">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
