import { useMemo, useState } from "react";

export default function useExportFilter(flights: any[]) {
  const [search, setSearch] = useState("");

  const [mission, setMission] = useState("");

  const [ama, setAma] = useState("");

  const [estate, setEstate] = useState("");

  const [battery, setBattery] = useState("");

  const [pilot, setPilot] = useState("");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const missions = useMemo(
    () => [...new Set(flights.map((item) => item.mission_name))],
    [flights]
  );

  const amas = [...new Set(flights.map((item) => item.ama))];

  const estates = [...new Set(flights.map((item) => item.estate))];

  const batteries = [...new Set(flights.map((item) => item.battery_id))];

  const pilots = [...new Set(flights.map((item) => item.pilot))];

  const filteredFlights = flights.filter((item) => {
    const itemDate = new Date(item.flight_date);

    const validSearch =
      !search ||
      Object.values(item)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

    return (
      validSearch &&
      (!mission || item.mission_name === mission) &&
      (!ama || item.ama === ama) &&
      (!estate || item.estate === estate) &&
      (!battery || item.battery_id === battery) &&
      (!pilot || item.pilot === pilot) &&
      (!startDate || itemDate >= new Date(startDate)) &&
      (!endDate || itemDate <= new Date(endDate))
    );
  });

  function resetFilters() {
    setSearch("");
    setMission("");
    setAma("");
    setEstate("");
    setBattery("");
    setPilot("");
    setStartDate("");
    setEndDate("");
  }

  return {
    search,
    setSearch,

    mission,
    setMission,

    ama,
    setAma,

    estate,
    setEstate,

    battery,
    setBattery,

    pilot,
    setPilot,

    startDate,
    setStartDate,

    endDate,
    setEndDate,

    missions,
    amas,
    estates,
    batteries,
    pilots,

    filteredFlights,

    resetFilters,
  };
}
