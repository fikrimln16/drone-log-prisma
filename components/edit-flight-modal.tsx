"use client";

import { useEffect, useMemo, useState } from "react";

import { Loader2, Lock, Pencil, X } from "lucide-react";

import { toast } from "sonner";

type Props = {
  open: boolean;

  data: any;

  onClose: () => void;

  onSuccess: (updated: any) => void;
};

type Errors = {
  [key: string]: string;
};

export default function EditFlightModal({
  open,
  data,
  onClose,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<Errors>({});

  const [form, setForm] = useState({
    flight_date: "",

    ama: "",

    estate: "",

    flight_id: "",

    mission_name: "",

    battery_id: "",

    battery_id_2: "",

    battery_color: "",

    start_percent: "",

    end_percent: "",

    start_volt: "",

    end_volt: "",

    start_time: "",

    end_time: "",

    duration_min: "",

    notes: "",
  });

  // AUTO FILL
  useEffect(() => {
    if (!data) return;

    setForm({
      flight_date: data.flight_date?.split("T")[0] || "",

      ama: data.ama || "",

      estate: data.estate || "",

      flight_id: data.flight_id || "",

      mission_name: data.mission_name || "",

      battery_id: data.battery_id || "",

      battery_id_2: data.battery_id_2 || "",

      battery_color: data.battery_color || "",

      start_percent: data.start_percent || "",

      end_percent: data.end_percent || "",

      start_volt: data.start_volt || "",

      end_volt: data.end_volt || "",

      start_time: data.start_time || "",

      end_time: data.end_time || "",

      duration_min: data.duration_min || "",

      notes: data.notes || "",
    });
  }, [data]);

  const isValid = useMemo(() => {
    return (
      form.flight_date &&
      form.ama &&
      form.estate &&
      form.flight_id &&
      form.mission_name &&
      form.battery_id &&
      form.battery_id_2 &&
      form.battery_color &&
      form.start_percent &&
      form.end_percent &&
      form.start_volt &&
      form.end_volt &&
      form.start_time &&
      form.end_time &&
      form.duration_min
    );
  }, [form]);

  if (!open || !data) return null;

  const validate = () => {
    const newErrors: Errors = {};

    Object.entries(form).forEach(([key, value]) => {
      if (key === "notes") return;

      if (!value) {
        newErrors[key] = "Field wajib diisi";
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  async function handleUpdate() {
    const valid = validate();

    if (!valid) return;

    try {
      setLoading(true);

      // LOADING DELAY
      await new Promise((resolve) => setTimeout(resolve, 800));

      const res = await fetch(`/api/flights/${data.id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message);

        return;
      }

      toast.success("Flight updated successfully");

      onSuccess({
        ...data,
        ...form,
      });

      onClose();
    } catch (err) {
      console.error(err);

      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      {/* MODAL */}
      <div className="flex h-[90vh] w-full max-w-[1100px] flex-col overflow-hidden rounded-[32px] bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between border-b px-6 py-6 md:px-10 md:py-8">
          <div>
            {/* ICON */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
              <Pencil className="h-8 w-8 text-blue-600" />
            </div>

            {/* TITLE */}
            <h1 className="mt-5 text-3xl font-bold md:text-5xl">Edit Flight</h1>

            <p className="mt-3 text-gray-500">Update flight information</p>
          </div>

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-full border transition hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:px-10 md:py-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* DATE */}
            <Input
              label="Flight Date"
              type="date"
              value={form.flight_date}
              error={errors.flight_date}
              onChange={(v: string) =>
                setForm({
                  ...form,
                  flight_date: v,
                })
              }
            />

            {/* FLIGHT ID DISABLED */}
            <div>
              <label className="mb-2 block text-sm font-bold tracking-wide text-gray-600 uppercase">
                Flight ID
              </label>

              <div className="relative">
                <Lock className="absolute top-1/2 right-5 h-5 w-5 -translate-y-1/2 text-gray-400" />

                <input
                  disabled
                  value={form.flight_id}
                  className="h-[64px] w-full cursor-not-allowed rounded-2xl border border-gray-200 bg-gray-50 px-5 text-lg text-gray-500 outline-none"
                />
              </div>

              <p className="mt-2 text-sm text-gray-400">
                Flight ID cannot be changed
              </p>
            </div>

            {/* AMA */}
            <Input
              label="AMA"
              value={form.ama}
              error={errors.ama}
              onChange={(v: string) =>
                setForm({
                  ...form,
                  ama: v,
                })
              }
            />

            {/* ESTATE */}
            <Input
              label="Estate"
              value={form.estate}
              error={errors.estate}
              onChange={(v: string) =>
                setForm({
                  ...form,
                  estate: v,
                })
              }
            />

            {/* MISSION */}
            <Input
              label="Mission Name"
              value={form.mission_name}
              error={errors.mission_name}
              onChange={(v: string) =>
                setForm({
                  ...form,
                  mission_name: v,
                })
              }
            />

            {/* BATTERY 1 */}
            <Input
              label="Battery ID"
              value={form.battery_id}
              error={errors.battery_id}
              onChange={(v: string) =>
                setForm({
                  ...form,
                  battery_id: v,
                })
              }
            />

            {/* BATTERY 2 */}
            <Input
              label="Battery ID 2"
              value={form.battery_id_2}
              error={errors.battery_id_2}
              onChange={(v: string) =>
                setForm({
                  ...form,
                  battery_id_2: v,
                })
              }
            />

            {/* COLOR */}
            <Input
              label="Battery Color"
              value={form.battery_color}
              error={errors.battery_color}
              onChange={(v: string) =>
                setForm({
                  ...form,
                  battery_color: v,
                })
              }
            />

            {/* START PERCENT */}
            <Input
              label="Start Percent"
              type="number"
              value={form.start_percent}
              error={errors.start_percent}
              onChange={(v: string) =>
                setForm({
                  ...form,
                  start_percent: v,
                })
              }
            />

            {/* END PERCENT */}
            <Input
              label="End Percent"
              type="number"
              value={form.end_percent}
              error={errors.end_percent}
              onChange={(v: string) =>
                setForm({
                  ...form,
                  end_percent: v,
                })
              }
            />

            {/* START VOLT */}
            <Input
              label="Start Volt"
              type="number"
              value={form.start_volt}
              error={errors.start_volt}
              onChange={(v: string) =>
                setForm({
                  ...form,
                  start_volt: v,
                })
              }
            />

            {/* END VOLT */}
            <Input
              label="End Volt"
              type="number"
              value={form.end_volt}
              error={errors.end_volt}
              onChange={(v: string) =>
                setForm({
                  ...form,
                  end_volt: v,
                })
              }
            />

            {/* START TIME */}
            <Input
              label="Start Time"
              type="time"
              value={form.start_time}
              error={errors.start_time}
              onChange={(v: string) =>
                setForm({
                  ...form,
                  start_time: v,
                })
              }
            />

            {/* END TIME */}
            <Input
              label="End Time"
              type="time"
              value={form.end_time}
              error={errors.end_time}
              onChange={(v: string) =>
                setForm({
                  ...form,
                  end_time: v,
                })
              }
            />

            {/* DURATION */}
            <Input
              label="Duration"
              type="number"
              value={form.duration_min}
              error={errors.duration_min}
              onChange={(v: string) =>
                setForm({
                  ...form,
                  duration_min: v,
                })
              }
            />
          </div>

          {/* NOTES */}
          <div className="mt-6">
            <label className="mb-2 block text-sm font-bold tracking-wide text-gray-600 uppercase">
              Notes
            </label>

            <textarea
              value={form.notes}
              onChange={(e) =>
                setForm({
                  ...form,
                  notes: e.target.value,
                })
              }
              className="min-h-[160px] w-full rounded-2xl border border-gray-200 bg-gray-50 p-5 text-lg outline-none"
              placeholder="Optional notes..."
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-4 border-t px-6 py-5 md:px-10">
          <button
            onClick={onClose}
            className="rounded-2xl border px-6 py-3 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            disabled={!isValid || loading}
            onClick={handleUpdate}
            className="flex min-w-[180px] items-center justify-center gap-3 rounded-2xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Pencil className="h-5 w-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, error, type = "text" }: any) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold tracking-wide text-gray-600 uppercase">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-[64px] w-full rounded-2xl border bg-gray-50 px-5 text-lg outline-none ${
          error ? "border-red-500" : "border-gray-200"
        } `}
      />

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
