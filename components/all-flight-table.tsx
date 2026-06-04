"use client";

import { useEffect, useState } from "react";

import Navbar from "./navbar";

import FlightDetailModal from "./flight-detail-modal";

import EditFlightModal from "./edit-flight-modal";

import DeleteFlightModal from "./delete-flight-modal";

import { ArrowDown, ArrowLeft, ArrowUp } from "lucide-react";

import Link from "next/link";

export default function AllFlightsPage() {
  const [flights, setFlights] = useState<any[]>([]);

  const [selectedFlight, setSelectedFlight] = useState<any>(null);

  const [editFlight, setEditFlight] = useState<any>(null);

  const [deleteFlight, setDeleteFlight] = useState<any>(null);

  const [search, setSearch] = useState("");

  const [sortConfig, setSortConfig] = useState({
    key: "flight_date",

    direction: "desc",
  });

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  // FETCH
  useEffect(() => {
    fetch("/api/flights")
      .then((res) => res.json())
      .then((res) => {
        setFlights(res);
      });
  }, []);

  // SEARCH
  const filteredFlights = flights.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  // SORT
  const sortedFlights = [...filteredFlights].sort((a: any, b: any) => {
    const key = sortConfig.key;

    if (sortConfig.direction === "asc") {
      return a[key] > b[key] ? 1 : -1;
    }

    return a[key] < b[key] ? 1 : -1;
  });

  // PAGINATION
  const totalPages = Math.ceil(sortedFlights.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;

  const endIndex = startIndex + rowsPerPage;

  const paginatedFlights = sortedFlights.slice(startIndex, endIndex);

  // SORT HANDLER
  function handleSort(key: string) {
    setSortConfig((prev: any) => ({
      key,

      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }

  // SORT ICON
  function SortIcon({ column }: { column: string }) {
    if (sortConfig.key !== column) {
      return <ArrowDown className="h-4 w-4 text-gray-300" />;
    }

    return sortConfig.direction === "asc" ? (
      <ArrowDown className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowUp className="h-4 w-4 text-blue-600" />
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* NAVBAR */}
      <Navbar title="All Flights" subtitle="Complete drone flight history" />

      {/* CONTENT */}
      <div className="px-4 pt-[120px] pb-10 md:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 rounded-2xl border bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:border-blue-500 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search flight..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);

              setCurrentPage(1);
            }}
            className="h-[54px] w-full rounded-2xl border bg-white px-5 outline-none md:max-w-[360px]"
          />

          {/* INFO */}
          <div className="text-sm text-gray-500">
            Total{" "}
            <span className="font-semibold text-black">
              {sortedFlights.length}
            </span>{" "}
            flights
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1500px]">
              {/* HEAD */}
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
                      label: "BATTERY",
                      key: "battery_id",
                    },
                    {
                      label: "DURATION",
                      key: "duration_min",
                    },
                  ].map((item) => (
                    <th
                      key={item.key}
                      onClick={() => handleSort(item.key)}
                      className="cursor-pointer p-6 text-left text-sm font-bold tracking-wide"
                    >
                      <div className="flex items-center gap-2">
                        {item.label}

                        <SortIcon column={item.key} />
                      </div>
                    </th>
                  ))}

                  {/* ACTION */}
                  <th className="p-6 text-right text-sm font-bold tracking-wide">
                    ACTION
                  </th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {paginatedFlights.map((item: any) => (
                  <tr
                    key={item.id}
                    className="border-b transition hover:bg-gray-50"
                  >
                    {/* DATE */}
                    <td className="p-6">
                      {new Date(item.flight_date).toLocaleDateString("id-ID")}
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

                    {/* FLIGHT */}
                    <td className="p-6">
                      <span className="rounded-full bg-blue-100 px-4 py-1 text-sm text-blue-700">
                        {item.flight_id}
                      </span>
                    </td>

                    {/* MISSION */}
                    <td className="p-6 font-medium">{item.mission_name}</td>

                    {/* BATTERY */}
                    <td className="p-6">{item.battery_id}</td>

                    {/* DURATION */}
                    <td className="p-6">
                      <span className="rounded-full bg-yellow-100 px-4 py-1 text-sm text-yellow-700">
                        {item.duration_min} min
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="p-6">
                      <div className="flex justify-end gap-2">
                        {/* DETAIL */}
                        <button
                          onClick={() => setSelectedFlight(item)}
                          className="rounded-xl border px-4 py-2 text-sm transition hover:bg-gray-100"
                        >
                          Detail
                        </button>

                        {/* EDIT */}
                        <button
                          onClick={() => setEditFlight(item)}
                          className="rounded-xl bg-blue-50 px-4 py-2 text-sm text-blue-600 transition hover:bg-blue-100"
                        >
                          Edit
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() => setDeleteFlight(item)}
                          className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* EMPTY */}
                {paginatedFlights.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-20 text-center text-gray-400">
                      No flights found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col items-center justify-between gap-4 border-t bg-white px-6 py-5 md:flex-row">
            {/* INFO */}
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-black">{startIndex + 1}</span>
              –
              <span className="font-semibold text-black">
                {Math.min(endIndex, sortedFlights.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-black">
                {sortedFlights.length}
              </span>{" "}
              flights
            </p>

            {/* BUTTONS */}
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

      {/* MODALS */}
      <FlightDetailModal
        data={selectedFlight}
        onClose={() => setSelectedFlight(null)}
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

      <DeleteFlightModal
        data={deleteFlight}
        onClose={() => setDeleteFlight(null)}
        onSuccess={(id) => {
          setFlights((prev) => prev.filter((item) => item.id !== id));
        }}
      />
    </div>
  );
}
