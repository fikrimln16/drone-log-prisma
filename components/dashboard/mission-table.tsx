"use client";

import { useState } from "react";

import Navbar from "../layout/navbar";

import DashboardCharts from "../dashboard-charts";

import UploadCSV from "../upload-csv";

import ActiveFlightsModal from "../active-flight-modal";

// DASHBOARD COMPONENTS
import DashboardKPI from "./dashboard-kpi";

import DashboardOperation from "./dashboard-operation";

import DashboardTable from "./dashboard-table";

// HOOKS
import useDashboardData from "@/hooks/useDashboardData";

import useMissionFilter from "@/hooks/useMissionFilter";

import usePagination from "@/hooks/usePagination";

export default function MissionTable() {
  // SEARCH
  const [search, setSearch] = useState("");

  // ACTIVE MODAL
  const [openActiveModal, setOpenActiveModal] = useState(false);

  // FETCH DATA
  const { missions, stats } = useDashboardData();

  // FILTER
  const filteredMissions = useMissionFilter({
    missions,

    search,

    sortBy: "last_flight",

    sortDirection: "desc",
  });

  // PAGINATION
  const { paginatedData, currentPage, setCurrentPage, totalPages } =
    usePagination(filteredMissions);

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* NAVBAR */}
      <Navbar title="Mission Dashboard" subtitle="Drone Flight Management" />

      {/* CONTENT */}
      <div className="space-y-6 px-4 pt-[140px] pb-8 md:px-6 xl:px-8">
        {/* KPI */}
        <DashboardKPI stats={stats} />

        {/* OPERATION */}
        <DashboardOperation
          stats={stats}
          onOpenActive={() => setOpenActiveModal(true)}
        />

        {/* CHART */}
        <DashboardCharts />

        {/* ACTION */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* SEARCH */}
          <div className="relative w-full md:w-[420px]">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);

                setCurrentPage(1);
              }}
              placeholder="Search mission..."
              className="h-[54px] w-full rounded-2xl border bg-white px-5 text-sm transition outline-none focus:border-blue-500 md:text-base"
            />
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <UploadCSV />
          </div>
        </div>

        {/* TABLE */}
        <DashboardTable missions={paginatedData} />

        {/* PAGINATION */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page <span className="font-semibold text-black">{currentPage}</span>{" "}
            of <span className="font-semibold text-black">{totalPages}</span>
          </p>

          <div className="flex items-center gap-2">
            {/* PREV */}
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="rounded-xl border px-4 py-2 text-sm transition hover:bg-gray-100 disabled:opacity-40"
            >
              Previous
            </button>

            {/* NEXT */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="rounded-xl border px-4 py-2 text-sm transition hover:bg-gray-100 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVE FLIGHT MODAL */}
      <ActiveFlightsModal
        open={openActiveModal}
        onClose={() => setOpenActiveModal(false)}
        flights={stats.active_flight_list || []}
      />
    </div>
  );
}
