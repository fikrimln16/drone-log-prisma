"use client";

import { toast } from "sonner";

import { updateFlight } from "@/services/flight.service";

export default function useEditFlight() {
  async function handleUpdate({
    id,

    form,

    validate,

    onSuccess,

    onClose,

    setLoading,
  }: any) {
    const valid = validate();

    if (!valid) return;

    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 800));

      const result = await updateFlight(id, form);

      if (!result.ok) {
        toast.error(result.data.message);

        return;
      }

      toast.success("Flight updated successfully");

      onSuccess(form);

      onClose();
    } catch (err) {
      console.error(err);

      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  }

  return {
    handleUpdate,
  };
}
