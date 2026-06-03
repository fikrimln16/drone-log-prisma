"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Plane,
  Plus,
} from "lucide-react";

import FlightDetailModal from "./flight-detail-modal";

import AddFlightModal from "./add-flight-model";

type Props = {
  mission: string;
};

type SortKey =
  | "flight_date"
  | "ama"
  | "estate"
  | "flight_id"
  | "battery_id"
  | "duration_min"
  | "notes";

export default function MissionPage({
  mission,
}: Props) {
  const [flights, setFlights] = useState<
    any[]
  >([]);

  const [selectedFlight, setSelectedFlight] =
    useState<any>(null);

  const [openAdd, setOpenAdd] =
    useState(false);

  // SORT
  const [sortBy, setSortBy] =
    useState<SortKey>("flight_date");

  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetch(`/api/missions/${mission}`)
      .then((res) => res.json())
      .then((res) => {
        setFlights(res);
      });
  }, [mission]);

  // SORT FUNCTION
  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : "asc"
      );
    } else {
      setSortBy(key);
      setSortDirection("asc");
    }
  };

  // SORTED DATA
  const sortedFlights = useMemo(() => {
    const copied = [...flights];

    copied.sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      // DATE
      if (sortBy === "flight_date") {
        valueA = new Date(
          valueA
        ).getTime();

        valueB = new Date(
          valueB
        ).getTime();
      }

      // STRING
      if (
        typeof valueA === "string" &&
        typeof valueB === "string"
      ) {
        if (sortDirection === "asc") {
          return valueA.localeCompare(
            valueB
          );
        }

        return valueB.localeCompare(
          valueA
        );
      }

      // NUMBER
      if (sortDirection === "asc") {
        return valueA - valueB;
      }

      return valueB - valueA;
    });

    return copied;
  }, [flights, sortBy, sortDirection]);

  // STATS
  const totalDuration =
    flights.reduce(
      (a, b) =>
        a + Number(b.duration_min || 0),
      0
    );

  const avgDuration = Math.round(
    totalDuration /
      (flights.length || 1)
  );

  // SORT ICON
  const renderSortIcon = (
    key: SortKey
  ) => {
    if (sortBy !== key) {
      return (
        <ArrowDown className="h-4 w-4 text-gray-300" />
      );
    }

    return sortDirection === "asc" ? (
      <ArrowDown className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowUp className="h-4 w-4 text-blue-600" />
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 z-[999] flex h-[92px] w-full items-center justify-between border-b bg-white/90 px-8 backdrop-blur-md">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {/* LOGO */}
          <div className="flex h-[58px] w-[58px] items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
            <Plane className="h-7 w-7 text-white" />
          </div>

          {/* TITLE */}
          <div>
            <h1 className="text-4xl font-bold">
              Flight Check
            </h1>

            <p className="text-lg text-gray-500">
              UAV Flight Log Manager
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto w-[1600px] pt-[125px] pb-10">
        {/* HEADER */}
        <div className="mb-10">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 text-gray-500 transition hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          {/* TITLE + BUTTON */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-6xl font-bold">
                {mission}
              </h1>

              <p className="mt-3 text-xl text-gray-500">
                {flights.length} flights
                logged
              </p>
            </div>

            {/* ADD BUTTON */}
            <button
              onClick={() =>
                setOpenAdd(true)
              }
              className="flex items-center gap-3 rounded-2xl bg-black px-7 py-4 text-lg font-semibold text-white shadow-lg transition hover:scale-[1.02]"
            >
              <Plus className="h-5 w-5" />
              Add Flight
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="mb-8 grid grid-cols-3 gap-6">
          <StatsCard
            title="TOTAL FLIGHTS"
            value={flights.length}
          />

          <StatsCard
            title="TOTAL DURATION"
            value={`${totalDuration} min`}
          />

          <StatsCard
            title="AVG DURATION"
            value={`${avgDuration} min`}
          />
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
          <div className="overflow-auto">
            <table className="w-full min-w-[1600px]">
              {/* HEAD */}
              <thead className="border-b bg-gray-50">
                <tr>
                  {/* DATE */}
                  <th className="p-6 text-left">
                    <button
                      onClick={() =>
                        handleSort(
                          "flight_date"
                        )
                      }
                      className="flex cursor-pointer items-center gap-2 text-sm font-bold tracking-wide"
                    >
                      DATE
                      {renderSortIcon(
                        "flight_date"
                      )}
                    </button>
                  </th>

                  {/* AMA */}
                  <th className="p-6 text-left">
                    <button
                      onClick={() =>
                        handleSort("ama")
                      }
                      className="flex cursor-pointer items-center gap-2 text-sm font-bold tracking-wide"
                    >
                      AMA
                      {renderSortIcon("ama")}
                    </button>
                  </th>

                  {/* ESTATE */}
                  <th className="p-6 text-left">
                    <button
                      onClick={() =>
                        handleSort(
                          "estate"
                        )
                      }
                      className="flex cursor-pointer items-center gap-2 text-sm font-bold tracking-wide"
                    >
                      ESTATE
                      {renderSortIcon(
                        "estate"
                      )}
                    </button>
                  </th>

                  {/* FLIGHT ID */}
                  <th className="p-6 text-left">
                    <button
                      onClick={() =>
                        handleSort(
                          "flight_id"
                        )
                      }
                      className="flex cursor-pointer items-center gap-2 text-sm font-bold tracking-wide"
                    >
                      FLIGHT ID
                      {renderSortIcon(
                        "flight_id"
                      )}
                    </button>
                  </th>

                  {/* BATTERY */}
                  <th className="p-6 text-left">
                    <button
                      onClick={() =>
                        handleSort(
                          "battery_id"
                        )
                      }
                      className="flex cursor-pointer items-center gap-2 text-sm font-bold tracking-wide"
                    >
                      BATTERY
                      {renderSortIcon(
                        "battery_id"
                      )}
                    </button>
                  </th>

                  {/* DURATION */}
                  <th className="p-6 text-left">
                    <button
                      onClick={() =>
                        handleSort(
                          "duration_min"
                        )
                      }
                      className="flex cursor-pointer items-center gap-2 text-sm font-bold tracking-wide"
                    >
                      DURATION
                      {renderSortIcon(
                        "duration_min"
                      )}
                    </button>
                  </th>

                  {/* NOTES */}
                  <th className="p-6 text-left">
                    <button
                      onClick={() =>
                        handleSort("notes")
                      }
                      className="flex cursor-pointer items-center gap-2 text-sm font-bold tracking-wide"
                    >
                      NOTES
                      {renderSortIcon(
                        "notes"
                      )}
                    </button>
                  </th>

                  {/* ACTION */}
                  <th className="p-6 text-right text-sm font-bold tracking-wide">
                    ACTION
                  </th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {sortedFlights.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b transition hover:bg-gray-50"
                  >
                    {/* DATE */}
                    <td className="p-6 text-lg">
                      {new Date(
                        item.flight_date
                      ).toLocaleDateString(
                        "id-ID"
                      )}
                    </td>

                    {/* AMA */}
                    <td className="p-6">
                      <span className="rounded-full bg-purple-100 px-4 py-1 text-sm text-purple-700">
                        {item.ama}
                      </span>
                    </td>

                    {/* ESTATE */}
                    <td className="p-6">
                      <span className="rounded-full bg-green-100 px-4 py-1 text-sm text-green-700">
                        {item.estate}
                      </span>
                    </td>

                    {/* FLIGHT ID */}
                    <td className="p-6">
                      <span className="rounded-full bg-blue-100 px-4 py-1 text-sm text-blue-700">
                        {item.flight_id}
                      </span>
                    </td>

                    {/* BATTERY */}
                    <td className="p-6 text-lg">
                      {item.battery_id}
                    </td>

                    {/* DURATION */}
                    <td className="p-6">
                      <span className="rounded-full bg-yellow-100 px-4 py-1 text-sm text-yellow-700">
                        {item.duration_min}{" "}
                        min
                      </span>
                    </td>

                    {/* NOTES */}
                    <td className="p-6 text-lg">
                      {item.notes}
                    </td>

                    {/* ACTION */}
                    <td className="p-6 text-right">
                      <button
                        onClick={() =>
                          setSelectedFlight(
                            item
                          )
                        }
                        className="rounded-2xl border bg-white px-5 py-2 transition hover:bg-gray-100"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}

                {/* EMPTY */}
                {sortedFlights.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-20 text-center text-gray-400"
                    >
                      No flights found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DETAIL MODAL */}
      <FlightDetailModal
        data={selectedFlight}
        onClose={() =>
          setSelectedFlight(null)
        }
      />

      {/* ADD MODAL */}
      <AddFlightModal
        mission={mission}
        open={openAdd}
        onClose={() =>
          setOpenAdd(false)
        }
      />
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
    <div className="rounded-[32px] border bg-white p-8 shadow-sm">
      <p className="text-sm font-medium tracking-wide text-gray-500 uppercase">
        {title}
      </p>

      <h1 className="mt-5 text-6xl font-bold">
        {value}
      </h1>
    </div>
  );
}