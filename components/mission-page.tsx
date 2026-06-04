"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import { ArrowDown, ArrowLeft, ArrowUp, Plane, Plus } from "lucide-react";

import FlightDetailModal from "./flight-detail-modal";

import AddFlightModal from "./add-flight-model";
import DeleteFlightModal from "./delete-flight-modal";
import EditFlightModal from "./edit-flight-modal";

import { toast } from "sonner";

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

export default function MissionPage({ mission }: Props) {
  const [flights, setFlights] = useState<any[]>([]);

  const [selectedFlight, setSelectedFlight] = useState<any>(null);

  const [openAdd, setOpenAdd] = useState(false);

  // SORT
  const [sortBy, setSortBy] = useState<SortKey>("flight_date");

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [deleteFlight, setDeleteFlight] = useState<any>(null);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editFlight, setEditFlight] = useState<any>(null);

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
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
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
        valueA = new Date(valueA).getTime();

        valueB = new Date(valueB).getTime();
      }

      // STRING
      if (typeof valueA === "string" && typeof valueB === "string") {
        if (sortDirection === "asc") {
          return valueA.localeCompare(valueB);
        }

        return valueB.localeCompare(valueA);
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
  const totalDuration = flights.reduce(
    (a, b) => a + Number(b.duration_min || 0),
    0
  );

  const avgDuration = Math.round(totalDuration / (flights.length || 1));

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

  // DELETE
  async function handleDeleteFlight() {
    if (!deleteFlight) return;

    try {
      setDeleteLoading(true);

      // DELAY ANIMATION
      await new Promise((resolve) => setTimeout(resolve, 800));

      const res = await fetch(`/api/flights/${deleteFlight.id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      toast.success(result.message);

      // REFRESH TABLE
      setFlights((prev) => prev.filter((x) => x.id !== deleteFlight.id));

      setDeleteFlight(null);
    } catch (err) {
      console.error(err);

      toast.error("Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 z-[999] flex min-h-[92px] w-full flex-col gap-4 border-b bg-white/90 px-4 py-4 backdrop-blur-md md:h-[92px] md:flex-row md:items-center md:justify-between md:px-8 md:py-0">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {/* LOGO */}
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-blue-600 shadow-lg md:h-[58px] md:w-[58px]">
            <Plane className="h-6 w-6 text-white md:h-7 md:w-7" />
          </div>

          {/* TITLE */}
          <div>
            <h1 className="text-2xl font-bold md:text-4xl">Flight Check</h1>

            <p className="text-sm text-gray-500 md:text-lg">
              UAV Flight Log Manager
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mx-auto w-full px-4 pt-[140px] pb-8 md:px-6 xl:max-w-[1600px] xl:px-8">
        {/* HEADER */}
        <div className="mb-8">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 text-gray-500 transition hover:text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>

          {/* TITLE + BUTTON */}
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-4xl font-bold md:text-6xl">{mission}</h1>

              <p className="mt-3 text-base text-gray-500 md:text-xl">
                {flights.length} flights logged
              </p>
            </div>

            {/* ADD BUTTON */}
            <button
              onClick={() => setOpenAdd(true)}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-black px-6 py-4 text-base font-semibold text-white shadow-lg transition hover:scale-[1.02] md:w-auto md:text-lg"
            >
              <Plus className="h-5 w-5" />
              Add Flight
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatsCard title="TOTAL FLIGHTS" value={flights.length} />

          <StatsCard title="TOTAL DURATION" value={`${totalDuration} min`} />

          <StatsCard title="AVG DURATION" value={`${avgDuration} min`} />
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              {/* HEAD */}
              <thead className="border-b bg-gray-50">
                <tr>
                  {/* DATE */}
                  <th className="p-4 text-left md:p-6">
                    <button
                      onClick={() => handleSort("flight_date")}
                      className="flex cursor-pointer items-center gap-2 text-xs font-bold tracking-wide md:text-sm"
                    >
                      DATE
                      {renderSortIcon("flight_date")}
                    </button>
                  </th>

                  {/* AMA */}
                  <th className="p-4 text-left md:p-6">
                    <button
                      onClick={() => handleSort("ama")}
                      className="flex cursor-pointer items-center gap-2 text-xs font-bold tracking-wide md:text-sm"
                    >
                      AMA
                      {renderSortIcon("ama")}
                    </button>
                  </th>

                  {/* ESTATE */}
                  <th className="p-4 text-left md:p-6">
                    <button
                      onClick={() => handleSort("estate")}
                      className="flex cursor-pointer items-center gap-2 text-xs font-bold tracking-wide md:text-sm"
                    >
                      ESTATE
                      {renderSortIcon("estate")}
                    </button>
                  </th>

                  {/* FLIGHT ID */}
                  <th className="p-4 text-left md:p-6">
                    <button
                      onClick={() => handleSort("flight_id")}
                      className="flex cursor-pointer items-center gap-2 text-xs font-bold tracking-wide md:text-sm"
                    >
                      FLIGHT ID
                      {renderSortIcon("flight_id")}
                    </button>
                  </th>

                  {/* BATTERY */}
                  <th className="p-4 text-left md:p-6">
                    <button
                      onClick={() => handleSort("battery_id")}
                      className="flex cursor-pointer items-center gap-2 text-xs font-bold tracking-wide md:text-sm"
                    >
                      BATTERY
                      {renderSortIcon("battery_id")}
                    </button>
                  </th>

                  {/* DURATION */}
                  <th className="p-4 text-left md:p-6">
                    <button
                      onClick={() => handleSort("duration_min")}
                      className="flex cursor-pointer items-center gap-2 text-xs font-bold tracking-wide md:text-sm"
                    >
                      DURATION
                      {renderSortIcon("duration_min")}
                    </button>
                  </th>

                  {/* NOTES */}
                  <th className="p-4 text-left md:p-6">
                    <button
                      onClick={() => handleSort("notes")}
                      className="flex cursor-pointer items-center gap-2 text-xs font-bold tracking-wide md:text-sm"
                    >
                      NOTES
                      {renderSortIcon("notes")}
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
                {sortedFlights.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b transition hover:bg-gray-50"
                  >
                    {/* DATE */}
                    <td className="p-4 text-sm md:p-6 md:text-lg">
                      {new Date(item.flight_date).toLocaleDateString("id-ID")}
                    </td>

                    {/* AMA */}
                    <td className="p-4 md:p-6">
                      <span className="rounded-full bg-purple-100 px-3 py-1 text-xs text-purple-700 md:px-4 md:text-sm">
                        {item.ama}
                      </span>
                    </td>

                    {/* ESTATE */}
                    <td className="p-4 md:p-6">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700 md:px-4 md:text-sm">
                        {item.estate}
                      </span>
                    </td>

                    {/* FLIGHT ID */}
                    <td className="p-4 md:p-6">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700 md:px-4 md:text-sm">
                        {item.flight_id}
                      </span>
                    </td>

                    {/* BATTERY */}
                    <td className="p-4 text-sm md:p-6 md:text-lg">
                      {item.battery_id}
                    </td>

                    {/* DURATION */}
                    <td className="p-4 md:p-6">
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs text-yellow-700 md:px-4 md:text-sm">
                        {item.duration_min} min
                      </span>
                    </td>

                    {/* NOTES */}
                    <td className="max-w-[250px] p-4 text-sm md:p-6 md:text-lg">
                      <p className="truncate">{item.notes}</p>
                    </td>

                    {/* ACTION */}
                    <td className="p-4 text-right md:p-6">
                      <button
                        onClick={() => setSelectedFlight(item)}
                        className="rounded-2xl border bg-white px-4 py-2 text-sm transition hover:bg-gray-100 md:px-5"
                      >
                        Detail
                      </button>

                      {/* EDIT */}
                      <button
                        onClick={() => setEditFlight(item)}
                        className="rounded-2xl bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-100 md:px-5"
                      >
                        Edit
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() => setDeleteFlight(item)}
                        className="rounded-2xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 md:px-5"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {/* EMPTY */}
                {sortedFlights.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-20 text-center text-gray-400">
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
        onClose={() => setSelectedFlight(null)}
      />

      {/* ADD MODAL */}
      <AddFlightModal
        mission={mission}
        open={openAdd}
        onClose={() => setOpenAdd(false)}
      />

      <DeleteFlightModal
        open={!!deleteFlight}
        flight={deleteFlight}
        loading={deleteLoading}
        onClose={() => setDeleteFlight(null)}
        onDelete={handleDeleteFlight}
      />

      <EditFlightModal
        open={!!editFlight}
        data={editFlight}
        onClose={() => setEditFlight(null)}
        onSuccess={(updated) => {
          setFlights((prev) =>
            prev.map((item) => (item.id === updated.id ? updated : item))
          );
        }}
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
    <div className="rounded-[32px] border bg-white p-6 shadow-sm md:p-8">
      <p className="text-xs font-medium tracking-wide text-gray-500 uppercase md:text-sm">
        {title}
      </p>

      <h1 className="mt-4 text-4xl font-bold md:mt-5 md:text-6xl">{value}</h1>
    </div>
  );
}
