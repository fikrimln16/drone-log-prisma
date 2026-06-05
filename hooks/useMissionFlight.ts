"use client";

import { useEffect, useState } from "react";

import { Flight } from "@/types/mission";

import { fetchMissionFlights } from "@/services/mission.service";

export default function useMissionFlights(mission: string) {
  const [flights, setFlights] = useState<Flight[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchMissionFlights(mission);

        setFlights(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [mission]);

  return {
    flights,
    setFlights,
    loading,
  };
}
