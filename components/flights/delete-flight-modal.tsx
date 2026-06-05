"use client";

import { Loader2, Trash2, X } from "lucide-react";

import { useState } from "react";

import { toast } from "sonner";

type Props = {
  open: boolean;

  flight: any;

  onClose: () => void;

  onDelete: (deletedId: number) => void;
};

export default function DeleteFlightModal({
  open,
  flight,
  onClose,
  onDelete,
}: Props) {
  const [loading, setLoading] = useState(false);

  if (!open || !flight) return null;

  async function handleDelete() {
    try {
      setLoading(true);

      const res = await fetch(`/api/flights/${flight.id}`, {
        method: "DELETE",
      });

      // fake loading animation
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (!res.ok) {
        throw new Error("Failed to delete flight");
      }

      toast.success("Flight deleted successfully");

      onDelete(flight.id);
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete flight");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* CARD */}
      <div className="w-[500px] rounded-[32px] bg-white p-8 shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Delete Flight</h1>

            <p className="mt-2 text-gray-500">This action cannot be undone.</p>
          </div>

          <button
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-full border transition hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="mt-8 rounded-2xl border bg-red-50 p-5">
          <p className="text-sm text-gray-500">Flight ID</p>

          <p className="mt-2 text-xl font-bold">{flight.flight_id}</p>

          <p className="mt-4 text-sm text-gray-500">Mission</p>

          <p className="mt-2 font-semibold">{flight.mission_name}</p>
        </div>

        {/* ACTION */}
        <div className="mt-8 flex justify-end gap-3">
          {/* CANCEL */}
          <button
            onClick={onClose}
            className="rounded-2xl border px-6 py-3 font-semibold transition hover:bg-gray-100"
          >
            Cancel
          </button>

          {/* DELETE */}
          <button
            disabled={loading}
            onClick={handleDelete}
            className="flex min-w-[160px] items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
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
