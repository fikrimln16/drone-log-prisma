"use client";

import Link from "next/link";

import { useMemo, useState } from "react";

import { ArrowDown, ArrowUp } from "lucide-react";

type Props = {
  missions: any[];
};

type SortKey =
  | "mission_name"
  | "last_flight"
  | "total_flights"
  | "total_duration"
  | "avg_duration";

export default function DashboardTable({ missions }: Props) {
  // SORT
  const [sortBy, setSortBy] = useState<SortKey>("last_flight");

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // SORTED DATA
  const sortedMissions = useMemo(() => {
    return [...missions].sort((a, b) => {
      const valueA = a[sortBy];

      const valueB = b[sortBy];

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      }

      return valueA < valueB ? 1 : -1;
    });
  }, [missions, sortBy, sortDirection]);

  // HANDLE SORT
  function handleSort(key: SortKey) {
    if (sortBy === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);

      setSortDirection("desc");
    }
  }

  // SORT ICON
  function SortIcon({ column }: { column: SortKey }) {
    if (sortBy !== column) {
      return <ArrowDown className="h-4 w-4 text-gray-300" />;
    }

    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="h-4 w-4 text-blue-600" />
    );
  }

  return (
    <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          {/* HEAD */}
          <thead className="border-b bg-gray-50">
            <tr>
              {/* MISSION */}
              <th
                onClick={() => handleSort("mission_name")}
                className="cursor-pointer p-6 text-left text-sm font-bold transition hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  MISSION
                  <SortIcon column="mission_name" />
                </div>
              </th>

              {/* LAST FLIGHT */}
              <th
                onClick={() => handleSort("last_flight")}
                className="cursor-pointer p-6 text-left text-sm font-bold transition hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  LAST FLIGHT
                  <SortIcon column="last_flight" />
                </div>
              </th>

              {/* FLIGHTS */}
              <th
                onClick={() => handleSort("total_flights")}
                className="cursor-pointer p-6 text-left text-sm font-bold transition hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  FLIGHTS
                  <SortIcon column="total_flights" />
                </div>
              </th>

              {/* TOTAL DURATION */}
              <th
                onClick={() => handleSort("total_duration")}
                className="cursor-pointer p-6 text-left text-sm font-bold transition hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  TOTAL DURATION
                  <SortIcon column="total_duration" />
                </div>
              </th>

              {/* AVG */}
              <th
                onClick={() => handleSort("avg_duration")}
                className="cursor-pointer p-6 text-left text-sm font-bold transition hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  AVG DURATION
                  <SortIcon column="avg_duration" />
                </div>
              </th>

              {/* ACTION */}
              <th className="p-6 text-right text-sm font-bold">ACTION</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {sortedMissions.map((item) => (
              <tr
                key={item.mission_name}
                className="border-b transition hover:bg-gray-50"
              >
                {/* MISSION */}
                <td className="p-6">
                  <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
                    {item.mission_name}
                  </span>
                </td>

                {/* LAST */}
                <td className="p-6 text-lg">
                  {new Date(item.last_flight).toLocaleDateString("id-ID")}
                </td>

                {/* FLIGHTS */}
                <td className="p-6">
                  <span className="rounded-full bg-purple-100 px-4 py-1 text-sm text-purple-700">
                    {item.total_flights} flights
                  </span>
                </td>

                {/* TOTAL */}
                <td className="p-6">
                  <span className="rounded-full bg-yellow-100 px-4 py-1 text-sm text-yellow-700">
                    {item.total_duration} min
                  </span>
                </td>

                {/* AVG */}
                <td className="p-6 text-lg">{item.avg_duration} min</td>

                {/* ACTION */}
                <td className="p-6 text-right">
                  <Link
                    href={`/missions/${item.mission_name}`}
                    className="inline-flex rounded-2xl border bg-white px-5 py-2 text-sm transition hover:bg-gray-100"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {/* EMPTY */}
            {sortedMissions.length === 0 && (
              <tr>
                <td colSpan={6} className="py-20 text-center text-gray-400">
                  No missions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
