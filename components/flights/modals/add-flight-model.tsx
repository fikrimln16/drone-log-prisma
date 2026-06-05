"use client";

import { Loader2, X } from "lucide-react";

import useAddFlightForm from "@/hooks/useAddFlightForm";

import FlightFormSection from "../flight-form-section";

import FlightInput from "../flight-input";

import BatterySelect from "../forms/battery-select";

type Props = {
  mission: string;

  open: boolean;

  onClose: () => void;
};

export default function AddFlightModal({ mission, open, onClose }: Props) {
  const { form, setForm, errors, loading, isValid, handleSubmit } =
    useAddFlightForm(mission, onClose);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* MODAL */}
      <div className="flex h-[90vh] w-[1100px] flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between border-b px-10 py-8">
          <div>
            <h1 className="text-5xl font-bold">New Flight Log</h1>

            <p className="mt-3 text-lg text-gray-500">Mission: {mission}</p>
          </div>

          <button
            onClick={onClose}
            className="flex h-14 w-14 items-center justify-center rounded-full border transition hover:bg-gray-100"
          >
            <X className="h-7 w-7" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-10 py-8">
          <div className="space-y-10">
            {/* FLIGHT INFO */}
            <FlightFormSection title="Flight Information">
              <div className="grid grid-cols-2 gap-6">
                <FlightInput
                  label="Flight Date"
                  type="date"
                  value={form.flight_date}
                  error={errors.flight_date}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      flight_date: value,
                    })
                  }
                />

                <FlightInput
                  label="Flight ID"
                  value={form.flight_id}
                  error={errors.flight_id}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      flight_id: value,
                    })
                  }
                />

                <FlightInput
                  label="AMA"
                  value={form.ama}
                  error={errors.ama}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      ama: value,
                    })
                  }
                />

                <FlightInput
                  label="Estate"
                  value={form.estate}
                  error={errors.estate}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      estate: value,
                    })
                  }
                />

                <FlightInput
                  label="Battery ID"
                  value={form.battery_id}
                  error={errors.battery_id}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      battery_id: value,
                    })
                  }
                />

                <FlightInput
                  label="Battery ID 2"
                  value={form.battery_id_2}
                  error={errors.battery_id_2}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      battery_id_2: value,
                    })
                  }
                />

                <BatterySelect
                  label="Battery Color"
                  value={form.battery_color}
                  error={errors.battery_color}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      battery_color: value,
                    })
                  }
                />
              </div>
            </FlightFormSection>

            {/* BATTERY */}
            <FlightFormSection title="Battery Information">
              <div className="grid grid-cols-2 gap-6">
                <FlightInput
                  label="Start Percent"
                  type="number"
                  value={form.start_percent}
                  error={errors.start_percent}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      start_percent: value,
                    })
                  }
                />

                <FlightInput
                  label="End Percent"
                  type="number"
                  value={form.end_percent}
                  error={errors.end_percent}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      end_percent: value,
                    })
                  }
                />

                <FlightInput
                  label="Start Volt"
                  type="number"
                  value={form.start_volt}
                  error={errors.start_volt}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      start_volt: value,
                    })
                  }
                />

                <FlightInput
                  label="End Volt"
                  type="number"
                  value={form.end_volt}
                  error={errors.end_volt}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      end_volt: value,
                    })
                  }
                />
              </div>
            </FlightFormSection>

            {/* TIME */}
            <FlightFormSection title="Flight Time">
              <div className="grid grid-cols-3 gap-6">
                <FlightInput
                  label="Start Time"
                  type="time"
                  value={form.start_time}
                  error={errors.start_time}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      start_time: value,
                    })
                  }
                />

                <FlightInput
                  label="End Time"
                  type="time"
                  value={form.end_time}
                  error={errors.end_time}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      end_time: value,
                    })
                  }
                />

                <FlightInput
                  label="Duration (min)"
                  type="number"
                  value={form.duration_min}
                  error={errors.duration_min}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      duration_min: value,
                    })
                  }
                />
              </div>
            </FlightFormSection>

            {/* NOTES */}
            <FlightFormSection title="Notes">
              <div>
                <label className="mb-2 block text-sm font-bold tracking-wide text-gray-600 uppercase">
                  Additional Notes
                </label>

                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      notes: e.target.value,
                    })
                  }
                  className="min-h-[160px] w-full rounded-2xl border border-gray-200 bg-gray-50 p-5 text-lg transition outline-none focus:border-blue-500"
                  placeholder="Optional notes..."
                />
              </div>
            </FlightFormSection>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-4 border-t px-10 py-6">
          {/* CANCEL */}
          <button
            onClick={onClose}
            className="rounded-2xl border px-6 py-3 font-medium transition hover:bg-gray-100"
          >
            Cancel
          </button>

          {/* SAVE */}
          <button
            disabled={!isValid || loading}
            onClick={handleSubmit}
            className={`flex min-w-[180px] items-center justify-center gap-3 rounded-2xl px-7 py-3 font-semibold text-white transition ${
              !isValid || loading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-black hover:scale-[1.02]"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Flight"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
