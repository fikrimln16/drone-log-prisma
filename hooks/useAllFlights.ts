"use client";

import { useEffect, useState } from "react";

export default function useAllFlights() {
  const [flights, setFlights] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  async function fetchFlights() {
    try {
      setLoading(true);

      const res = await fetch("/api/flights");

      const data = await res.json();

      setFlights(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFlights();
  }, []);

  return {
    flights,
    setFlights,
    loading,
    refetch: fetchFlights,
  };
}
