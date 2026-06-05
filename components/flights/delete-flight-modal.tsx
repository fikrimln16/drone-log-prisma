"use client";

import { Loader2, Trash2, X } from "lucide-react";

type Props = {
  open: boolean;

  flight: any;

  onClose: () => void;

  onDelete: () => void;

  loading?: boolean;
};

export default function DeleteFlightModal({
  open,
  flight,
  onClose,
  onDelete,
  loading,
}: Props) {
  if (!open || !flight) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[520px] rounded-[32px] bg-white p-8 shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>

            <h1 className="mt-6 text-3xl font-bold">Delete Flight</h1>

            <p className="mt-3 text-gray-500">
              Are you sure want to delete flight{" "}
              <span className="font-semibold text-black">
                {flight.flight_id}
              </span>{" "}
              from mission{" "}
              <span className="font-semibold text-black">
                {flight.mission_name}
              </span>
              ?
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full border transition hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FOOTER */}
        <div className="mt-10 flex flex-col-reverse gap-3 md:flex-row md:justify-end">
          <button
            onClick={onClose}
            className="h-[52px] rounded-2xl border px-6 font-semibold transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onDelete}
            className="flex h-[52px] items-center justify-center gap-3 rounded-2xl bg-red-600 px-6 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-5 w-5" />
                Delete Flight
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
