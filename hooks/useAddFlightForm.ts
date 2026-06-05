"use client";

import { useMemo, useState } from "react";

import { toast } from "sonner";

import { createFlight } from "@/services/flight.service";

import { validateFlight } from "@/utils/flight-validation";

import { FlightErrors, FlightForm } from "@/types/flight";

const initialForm: FlightForm = {
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
};

export default function useAddFlightForm(mission: string, onClose: () => void) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FlightForm>(initialForm);

  const [errors, setErrors] = useState<FlightErrors>({});

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

  async function handleSubmit() {
    const validation = validateFlight(form);

    setErrors(validation);

    if (Object.keys(validation).length > 0) return;

    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 800));

      const result = await createFlight({
        ...form,
        mission_name: mission,
      });

      if (!result.ok) {
        toast.error(result.data.message || "Failed add flight");

        return;
      }

      toast.success("Flight added successfully");

      onClose();

      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (error) {
      console.error(error);

      toast.error("Internal server error");
    } finally {
      setLoading(false);
    }
  }

  return {
    form,

    setForm,

    errors,

    loading,

    isValid,

    handleSubmit,
  };
}
