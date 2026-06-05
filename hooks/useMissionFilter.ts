"use client";

import { useMemo } from "react";

import { Mission, SortKey } from "@/types/dashboard";

type Props = {
  missions: Mission[];

  search: string;

  sortBy: SortKey;

  sortDirection: "asc" | "desc";
};

export default function useMissionFilter({
  missions,
  search,
  sortBy,
  sortDirection,
}: Props) {
  return useMemo(() => {
    const filtered = missions.filter((item) =>
      item.mission_name.toLowerCase().includes(search.toLowerCase())
    );

    filtered.sort((a, b) => {
      let valueA = a[sortBy];

      let valueB = b[sortBy];

      if (sortBy === "last_flight") {
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

    return filtered;
  }, [missions, search, sortBy, sortDirection]);
}
