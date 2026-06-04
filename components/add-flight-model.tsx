"use client";

import { useMemo, useState } from "react";

import { Loader2, X } from "lucide-react";

import { toast } from "sonner";

type Props = {
  mission: string;
  open: boolean;
  onClose: () => void;
};

type Errors = {
  [key: string]: string;
};

export default function AddFlightModal({ mission, open, onClose }: Props) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    flight_date: "",

    ama: "",

    estate: "",

    flight_id: "",

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

  const [errors, setErrors] = useState<Errors>({});

  const isValid = useMemo(() => {
    return (
      form.flight_date &&
      form.ama &&
      form.estate &&
      form.flight_id &&
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

  if (!open) return null;

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

  const handleSubmit = async () => {
    const valid = validate();

    if (!valid) return;

    try {
      setLoading(true);

      // LOADING DELAY
      await new Promise((resolve) => setTimeout(resolve, 800));

      const res = await fetch("/api/flights/add", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...form,
          mission_name: mission,
        }),
      });

      const result = await res.json();

      // FAILED
      if (!res.ok) {
        toast.error(result.message || "Failed add flight");

        return;
      }

      // SUCCESS
      toast.success("Flight added successfully");

      // CLOSE MODAL
      onClose();

      // REFRESH TABLE
      // DELAY AGAR TOAST TERLIHAT
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err) {
      console.error(err);

      toast.error("Internal server error");
    } finally {
      setLoading(false);
    }
  };

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
            className="flex h-14 w-14 items-center justify-center rounded-full border hover:bg-gray-100"
          >
            <X className="h-7 w-7" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-10 py-8">
          <div className="space-y-10">
            {/* FLIGHT INFO */}
            <Section title="Flight Information">
              <div className="grid grid-cols-2 gap-6">
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

                <Input
                  label="Flight ID"
                  value={form.flight_id}
                  error={errors.flight_id}
                  onChange={(v: string) =>
                    setForm({
                      ...form,
                      flight_id: v,
                    })
                  }
                />

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

                <SelectInput
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
              </div>
            </Section>

            {/* BATTERY */}
            <Section title="Battery Information">
              <div className="grid grid-cols-2 gap-6">
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
              </div>
            </Section>

            {/* TIME */}
            <Section title="Flight Time">
              <div className="grid grid-cols-3 gap-6">
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

                <Input
                  label="Duration (min)"
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
            </Section>

            {/* NOTES */}
            <Section title="Notes">
              <textarea
                value={form.notes}
                onChange={(e) =>
                  setForm({
                    ...form,
                    notes: e.target.value,
                  })
                }
                className="min-h-[160px] w-full rounded-2xl border bg-gray-50 p-5 text-lg outline-none"
                placeholder="Optional notes..."
              />
            </Section>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-4 border-t px-10 py-6">
          <button onClick={onClose} className="rounded-2xl border px-6 py-3">
            Cancel
          </button>

          <button
            disabled={!isValid || loading}
            onClick={handleSubmit}
            className={`flex min-w-[180px] items-center justify-center gap-3 rounded-2xl px-7 py-3 font-semibold text-white transition ${
              !isValid || loading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-black hover:scale-[1.02]"
            } `}
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

function Section({ title, children }: any) {
  return (
    <div>
      <h2 className="mb-6 border-b pb-3 text-2xl font-bold tracking-wider text-blue-600 uppercase">
        {title}
      </h2>

      {children}
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
        }`}
      />

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}

function SelectInput({ label, value, onChange, error }: any) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold tracking-wide text-gray-600 uppercase">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-[64px] w-full rounded-2xl border bg-gray-50 px-5 text-lg outline-none ${
          error ? "border-red-500" : "border-gray-200"
        }`}
      >
        <option value="">Select Color</option>

        <option value="Black">Black</option>

        <option value="White">White</option>

        <option value="Red">Red</option>

        <option value="Blue">Blue</option>

        <option value="Green">Green</option>
      </select>

      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
