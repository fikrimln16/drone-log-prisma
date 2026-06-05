"use client";

import { useMemo, useState } from "react";

export default function useFlightFilters(flights: any[]) {
  const [search, setSearch] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [selectedAma, setSelectedAma] = useState("");

  const [selectedEstate, setSelectedEstate] = useState("");

  const [selectedMission, setSelectedMission] = useState("");

  const [selectedBattery, setSelectedBattery] = useState("");

  const [selectedPilot, setSelectedPilot] = useState("");

  const filteredFlights = useMemo(() => {
    return flights.filter((item) => {
      const itemDate = new Date(item.flight_date);

      const validSearch =
        !search ||
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());

      const validStart = !startDate || itemDate >= new Date(startDate);

      const validEnd = !endDate || itemDate <= new Date(endDate);

      const validAma = !selectedAma || item.ama === selectedAma;

      const validEstate = !selectedEstate || item.estate === selectedEstate;

      const validMission =
        !selectedMission || item.mission_name === selectedMission;

      const validBattery =
        !selectedBattery || item.battery_id === selectedBattery;

      const validPilot = !selectedPilot || item.pilot === selectedPilot;

      return (
        validSearch &&
        validStart &&
        validEnd &&
        validAma &&
        validEstate &&
        validMission &&
        validBattery &&
        validPilot
      );
    });
  }, [
    flights,
    search,
    startDate,
    endDate,
    selectedAma,
    selectedEstate,
    selectedMission,
    selectedBattery,
    selectedPilot,
  ]);

  return {
    filteredFlights,

    search,
    setSearch,

    startDate,
    setStartDate,

    endDate,
    setEndDate,

    selectedAma,
    setSelectedAma,

    selectedEstate,
    setSelectedEstate,

    selectedMission,
    setSelectedMission,

    selectedBattery,
    setSelectedBattery,

    selectedPilot,
    setSelectedPilot,
  };
}
