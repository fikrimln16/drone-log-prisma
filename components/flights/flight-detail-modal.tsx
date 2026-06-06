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

  // FORMAT DATE
  function formatDate(date: string) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  }

  // FORMAT TIME
  function formatTime(date: string) {
    if (!date) return "-";

    return new Date(date).toLocaleTimeString(
      "id-ID",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  // FORMAT DATETIME
  function formatDateTime(date: string) {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      "id-ID",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      {/* MODAL */}
      <div className="relative flex max-h-[92vh] w-full max-w-[1100px] flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl">
        {/* HEADER */}
        <div className="border-b px-6 py-6 md:px-8">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 flex h-11 w-11 items-center justify-center rounded-full border transition hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>

          <p className="text-xs font-semibold tracking-[0.3em] text-gray-400 uppercase">
            Flight Detail
          </p>

          <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="break-words text-3xl font-bold tracking-tight md:text-5xl">
                {data.flight_id}
              </h1>

              <p className="mt-2 text-gray-500">
                Complete drone flight information
              </p>
            </div>

            <div className="w-fit rounded-2xl bg-blue-50 px-5 py-3">
              <p className="text-xs font-semibold tracking-wide text-blue-500 uppercase">
                Mission
              </p>

              <p className="mt-1 text-lg font-bold text-blue-700 break-words">
                {data.mission_name}
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-8 md:py-7">
          <div className="space-y-8">
            {/* FLIGHT INFO */}
            <Section title="Flight Information">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Item
                  label="Flight Date"
                  value={formatDate(data.flight_date)}
                />

                <Item label="AMA" value={data.ama} />

                <Item label="Estate" value={data.estate} />

                <Item label="Pilot" value={data.pilot} />

                <Item
                  label="Flight Duration"
                  value={`${data.duration_min || "-"} min`}
                />

                <Item
                  label="Created At"
                  value={formatDateTime(data.created_at)}
                />
              </div>
            </Section>

            {/* BATTERY */}
            <Section title="Battery Information">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <Item
                  label="Battery ID"
                  value={data.battery_id}
                />

                <Item
                  label="Battery ID 2"
                  value={data.battery_id_2}
                />

                <Item
                  label="Battery Color"
                  value={data.battery_color}
                />

                <Item
                  label="Start Percent"
                  value={`${data.start_percent || "-"}%`}
                  variant="green"
                />

                <Item
                  label="End Percent"
                  value={`${data.end_percent || "-"}%`}
                  variant={
                    data.end_percent <= 20
                      ? "red"
                      : data.end_percent <= 50
                        ? "yellow"
                        : "green"
                  }
                />

                <Item
                  label="Start Volt"
                  value={`${data.start_volt || "-"}V`}
                />

                <Item
                  label="End Volt"
                  value={`${data.end_volt || "-"}V`}
                />
              </div>
            </Section>

            {/* TIME */}
            <Section title="Flight Time">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Item
                  label="Start Time"
                  value={formatTime(data.start_time)}
                />

                <Item
                  label="End Time"
                  value={formatTime(data.end_time)}
                />
              </div>
            </Section>

            {/* NOTES */}
            <Section title="Notes">
              <div className="rounded-2xl border bg-gray-50 p-6">
                <p className="text-base leading-relaxed break-words text-gray-700">
                  {data.notes || "No additional notes"}
                </p>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;

  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-blue-500" />

        <h2 className="text-sm font-bold tracking-[0.25em] text-gray-500 uppercase">
          {title}
        </h2>
      </div>

      {children}
    </div>
  );
}

function Item({
  label,
  value,
  variant = "default",
}: {
  label: string;

  value: any;

  variant?: "default" | "green" | "yellow" | "red";
}) {
  const variantStyle = {
    default: "bg-gray-50 text-black",

    green: "bg-green-50 text-green-700",

    yellow: "bg-yellow-50 text-yellow-700",

    red: "bg-red-50 text-red-700",
  };

  return (
    <div
      className={`rounded-2xl border p-5 transition hover:shadow-sm ${variantStyle[variant]}`}
    >
      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
        {label}
      </p>

      <p className="mt-3 break-words text-lg font-bold md:text-xl">
        {value || "-"}
      </p>
    </div>
  );
}