"use client";

import { useMemo, useState } from "react";

export default function useFlightFilters(flights: any[]) {
  const [search, setSearch] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [selectedMission, setSelectedMission] = useState("");

  const [selectedAma, setSelectedAma] = useState("");

  const [selectedEstate, setSelectedEstate] = useState("");

  const [selectedBattery, setSelectedBattery] = useState("");

  const [selectedPilot, setSelectedPilot] = useState("");

  const filteredFlights = useMemo(() => {
    return flights.filter((item) => {
      const validSearch =
        !search ||
        Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase());

      const validMission =
        !selectedMission || item.mission_name === selectedMission;

      const validAma = !selectedAma || item.ama === selectedAma;

      const validEstate = !selectedEstate || item.estate === selectedEstate;

      const validBattery =
        !selectedBattery || item.battery_id === selectedBattery;

      const validPilot = !selectedPilot || item.pilot === selectedPilot;

      const itemDate = new Date(item.flight_date);

      const validStart = !startDate || itemDate >= new Date(startDate);

      const validEnd = !endDate || itemDate <= new Date(endDate);

      return (
        validSearch &&
        validMission &&
        validAma &&
        validEstate &&
        validBattery &&
        validPilot &&
        validStart &&
        validEnd
      );
    });
  }, [
    flights,
    search,
    startDate,
    endDate,
    selectedMission,
    selectedAma,
    selectedEstate,
    selectedBattery,
    selectedPilot,
  ]);

  function resetFilters() {
    setSearch("");

    setStartDate("");

    setEndDate("");

    setSelectedMission("");

    setSelectedAma("");

    setSelectedEstate("");

    setSelectedBattery("");

    setSelectedPilot("");
  }

  return {
    search,
    setSearch,

    startDate,
    setStartDate,

    endDate,
    setEndDate,

    selectedMission,
    setSelectedMission,

    selectedAma,
    setSelectedAma,

    selectedEstate,
    setSelectedEstate,

    selectedBattery,
    setSelectedBattery,

    selectedPilot,
    setSelectedPilot,

    filteredFlights,

    resetFilters,
  };
}
