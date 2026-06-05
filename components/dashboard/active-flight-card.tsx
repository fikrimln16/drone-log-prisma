"use client";

import { Plane } from "lucide-react";

type Props = {
  total: number;

  onOpen: () => void;
};

export default function ActiveFlightCard({ total, onOpen }: Props) {
  return (
    <div className="flex min-h-[220px] flex-col justify-between rounded-[28px] border bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500">Active Flights</p>

          <h1 className="mt-3 text-4xl font-bold">{total}</h1>

          <p className="mt-2 text-sm text-gray-500">Flights today</p>
        </div>

        <div className="rounded-2xl bg-green-100 p-4">
          <Plane className="h-6 w-6 text-green-600" />
        </div>
      </div>

      <button
        onClick={onOpen}
        className="mt-6 flex h-[48px] items-center justify-center rounded-2xl border bg-white text-sm font-semibold transition hover:bg-gray-100"
      >
        View Active Flights
      </button>
    </div>
  );
}
