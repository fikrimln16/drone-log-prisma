"use client";

import { useMemo, useState } from "react";

export type SortKey =
  | "flight_date"
  | "ama"
  | "estate"
  | "flight_id"
  | "mission_name"
  | "pilot"
  | "battery_id"
  | "duration_min";

export default function useFlightSort(flights: any[]) {
  const [sortBy, setSortBy] = useState<SortKey>("flight_date");

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortedFlights = useMemo(() => {
    return [...flights].sort((a, b) => {
      const valueA = a[sortBy];

      const valueB = b[sortBy];

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      }

      return valueA < valueB ? 1 : -1;
    });
  }, [flights, sortBy, sortDirection]);

  function handleSort(key: SortKey) {
    if (sortBy === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);

      setSortDirection("asc");
    }
  }

  return {
    sortBy,
    sortDirection,
    handleSort,
    sortedFlights,
  };
}
