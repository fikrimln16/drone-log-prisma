"use client";

import { useState } from "react";

import { Download, Loader2, X } from "lucide-react";

import { toast } from "sonner";

import FlightDetailModal from "../flights/flight-detail-modal";

import useExportFilter from "./userExportFilter";

import ExportFilter from "./export-filter";

import ExportTable from "./export-table";

import { generateCSV } from "./export-utils";

type Props = {
  open: boolean;

  flights: any[];

  onClose: () => void;
};

export default function ExportCSVModal({ open, flights, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  const [selectedFlight, setSelectedFlight] = useState<any>(null);

  // FILTER
  const filters = useExportFilter(flights);

  // EXPORT
  async function handleExport() {
    try {
      setLoading(true);

      // UX DELAY
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // CSV CONTENT
      const csvContent = generateCSV(filters.filteredFlights);

      // BLOB
      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      // FILE NAME
      const today = new Date();

      const fileName = `FLIGHT_EXPORT_${today.toISOString().split("T")[0]}.csv`;

      // DOWNLOAD
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
    <>
      <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
        {/* MODAL */}
        <div className="flex h-[90vh] w-full max-w-[1400px] flex-col rounded-[32px] bg-white shadow-2xl">
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
              className="flex h-12 w-12 items-center justify-center rounded-full border transition hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* FILTER */}
          <ExportFilter filters={filters} />

          {/* TABLE */}
          <ExportTable
            flights={filters.filteredFlights}
            onDetail={(item) => setSelectedFlight(item)}
          />

          {/* FOOTER */}
          <div className="flex items-center justify-between border-t bg-white px-8 py-5">
            {/* TOTAL */}
            <p className="text-sm text-gray-500">
              {filters.filteredFlights.length} flights selected
            </p>

            {/* ACTION */}
            <div className="flex items-center gap-3">
              {/* CANCEL */}
              <button
                onClick={onClose}
                className="rounded-2xl border px-5 py-3 transition hover:bg-gray-100"
              >
                Cancel
              </button>

              {/* EXPORT */}
              <button
                disabled={filters.filteredFlights.length === 0 || loading}
                onClick={handleExport}
                className="flex min-w-[190px] items-center justify-center gap-3 rounded-2xl bg-black px-6 py-3 font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
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
      </div>

      {/* DETAIL MODAL */}
      <FlightDetailModal
        data={selectedFlight}
        onClose={() => setSelectedFlight(null)}
      />
    </>
  );
}
