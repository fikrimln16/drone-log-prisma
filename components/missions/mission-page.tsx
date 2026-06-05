"use client";

import { useState } from "react";

import Navbar from "../layout/navbar";

import MissionHeader from "./mission-header";

import MissionTable from "./mission-table";

import AddFlightModal from "../flights/modals/add-flight-model";

import DeleteFlightModal from "../flights/delete-flight-modal";

import EditFlightModal from "../flights/modals/edit-flight-modal";

import FlightDetailModal from "../flights/flight-detail-modal";

import ExportCSVModal from "../export/export-csv-modal";

import useMissionFlights from "@/hooks/useMissionFlight";

import useMissionSort from "@/hooks/useMissionSort";

import MissionKpiGrid from "./kpi/mission-kpi-grid";

type Props = {
  mission: string;
};

export default function MissionPage({ mission }: Props) {
  // FETCH
  const { flights, setFlights } = useMissionFlights(mission);

  // SORT
  const { sortedFlights, handleSort, sortBy, sortDirection } =
    useMissionSort(flights);

  // MODAL
  const [openAdd, setOpenAdd] = useState(false);

  const [openExport, setOpenExport] = useState(false);

  const [selectedFlight, setSelectedFlight] = useState<any>(null);

  const [deleteFlight, setDeleteFlight] = useState<any>(null);

  const [editFlight, setEditFlight] = useState<any>(null);

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* NAVBAR */}
      <Navbar title="Flight Check" subtitle="UAV Flight Log Manager" />

      {/* CONTENT */}
      <div className="mx-auto w-full px-4 pt-[140px] pb-8 md:px-6 xl:max-w-[1600px] xl:px-8">
        {/* HEADER */}
        <MissionHeader
          mission={mission}
          totalFlights={flights.length}
          onOpenExport={() => setOpenExport(true)}
          onAdd={() => setOpenAdd(true)}
        />

        {/* KPI */}
        <MissionKpiGrid flights={flights} />

        {/* TABLE */}
        <MissionTable
          flights={sortedFlights}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onSort={handleSort}
          onDetail={(item) => setSelectedFlight(item)}
          onEdit={(item) => setEditFlight(item)}
          onDelete={(item) => setDeleteFlight(item)}
        />
      </div>

      {/* DETAIL */}
      <FlightDetailModal
        data={selectedFlight}
        onClose={() => setSelectedFlight(null)}
      />

      {/* ADD */}
      <AddFlightModal
        mission={mission}
        open={openAdd}
        onClose={() => setOpenAdd(false)}
      />

      {/* EXPORT */}
      <ExportCSVModal
        open={openExport}
        flights={flights}
        onClose={() => setOpenExport(false)}
      />

      {/* DELETE */}
      <DeleteFlightModal
        open={!!deleteFlight}
        flight={deleteFlight}
        onClose={() => setDeleteFlight(null)}
        onDelete={(deletedId) => {
          setFlights((prev) => prev.filter((item) => item.id !== deletedId));

          setDeleteFlight(null);
        }}
      />

      {/* EDIT */}
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
