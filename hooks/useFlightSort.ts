"use client";

import { useMemo, useState } from "react";

export default function useFlightSort(data: any[]) {
  const [sortConfig, setSortConfig] = useState({
    key: "flight_date",
    direction: "desc",
  });

  const sortedData = useMemo(() => {
    return [...data].sort((a: any, b: any) => {
      const key = sortConfig.key;

      if (sortConfig.direction === "asc") {
        return a[key] > b[key] ? 1 : -1;
      }

      return a[key] < b[key] ? 1 : -1;
    });
  }, [data, sortConfig]);

  function handleSort(key: string) {
    setSortConfig((prev: any) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }

  return {
    sortedData,
    sortConfig,
    handleSort,
  };
}
