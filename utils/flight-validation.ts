import { FlightErrors, FlightForm } from "@/types/flight";

export function validateFlight(form: FlightForm) {
  const errors: FlightErrors = {};

  Object.entries(form).forEach(([key, value]) => {
    if (key === "notes") return;

    if (!value) {
      errors[key] = "Field wajib diisi";
    }
  });

  return errors;
}
