"use client";

import { useEffect, useState } from "react";

export default function useFlights() {
  const [flights, setFlights] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/flights")
      .then((res) => res.json())
      .then((data) => setFlights(data))
      .finally(() => setLoading(false));
  }, []);

  return {
    flights,
    setFlights,
    loading,
  };
}
