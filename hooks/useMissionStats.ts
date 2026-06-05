import { useMemo } from "react";

import { Flight } from "@/types/mission";

export default function useMissionStats(flights: Flight[]) {
  return useMemo(() => {
    const totalFlights = flights.length;

    const totalDuration = flights.reduce(
      (acc, item) => acc + Number(item.duration_min || 0),
      0
    );

    const avgDuration = Math.round(totalDuration / (totalFlights || 1));

    return {
      totalFlights,

      totalDuration,

      avgDuration,
    };
  }, [flights]);
}
