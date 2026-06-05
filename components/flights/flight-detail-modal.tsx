"use client";

import { X } from "lucide-react";

type Props = {
  data: any;
  onClose: () => void;
};

export default function FlightDetailModal({
  data,
  onClose,
}: Props) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* CARD */}
      <div className="relative max-h-[90vh] w-[950px] overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>

        {/* HEADER */}
        <div className="mb-8 border-b pb-6">
          <p className="text-sm font-medium tracking-widest text-gray-400 uppercase">
            Flight Detail
          </p>

          {/* TITLE */}
          <h1 className="mt-3 text-5xl font-bold tracking-tight">
            {data.flight_id}
          </h1>

          <p className="mt-3 text-lg text-gray-500">
            Complete drone flight information
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 gap-5">
          {/* DATE */}
          <Item
            label="Flight Date"
            value={
              data.flight_date
                ? new Date(
                    data.flight_date
                  ).toLocaleDateString("id-ID")
                : "-"
            }
          />

          {/* MISSION */}
          <Item
            label="Mission Name"
            value={data.mission_name}
          />

          {/* AMA */}
          <Item label="AMA" value={data.ama} />

          {/* ESTATE */}
          <Item
            label="Estate"
            value={data.estate}
          />

          {/* BATTERY 1 */}
          <Item
            label="Battery ID"
            value={data.battery_id}
          />

          {/* BATTERY 2 */}
          <Item
            label="Battery ID 2"
            value={data.battery_id_2}
          />

          {/* COLOR */}
          <Item
            label="Battery Color"
            value={data.battery_color}
          />

          {/* DURATION */}
          <Item
            label="Duration"
            value={`${data.duration_min ?? "-"} min`}
          />

          {/* START % */}
          <Item
            label="Start Percent"
            value={`${data.start_percent ?? "-"}%`}
          />

          {/* END % */}
          <Item
            label="End Percent"
            value={`${data.end_percent ?? "-"}%`}
          />

          {/* START VOLT */}
          <Item
            label="Start Volt"
            value={`${data.start_volt ?? "-"}V`}
          />

          {/* END VOLT */}
          <Item
            label="End Volt"
            value={`${data.end_volt ?? "-"}V`}
          />

          {/* START TIME */}
          <Item
            label="Start Time"
            value={data.start_time}
          />

          {/* END TIME */}
          <Item
            label="End Time"
            value={data.end_time}
          />

          {/* NOTES */}
          <div className="col-span-2">
            <Item
              label="Notes"
              value={data.notes}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Item({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="rounded-2xl border bg-gray-50 p-5">
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold break-words">
        {value || "-"}
      </p>
    </div>
  );
}