"use client";

import { useMemo, useState } from "react";

import { Flight, SortKey } from "@/types/mission";

export default function useMissionSort(flights: Flight[]) {
  const [sortBy, setSortBy] = useState<SortKey>("flight_date");

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  function handleSort(key: SortKey) {
    if (sortBy === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);

      setSortDirection("asc");
    }
  }

  const sortedFlights = useMemo(() => {
    const copied = [...flights];

    copied.sort((a, b) => {
      let valueA = a[sortBy];

      let valueB = b[sortBy];

      if (sortBy === "flight_date") {
        valueA = new Date(valueA).getTime();

        valueB = new Date(valueB).getTime();
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      return sortDirection === "asc"
        ? Number(valueA) - Number(valueB)
        : Number(valueB) - Number(valueA);
    });

    return copied;
  }, [flights, sortBy, sortDirection]);

  return {
    sortBy,

    sortDirection,

    handleSort,

    sortedFlights,
  };
}
