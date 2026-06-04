"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  ArrowDown,
  ArrowUp,
  Search,
  Flag,
  Plane,
  Clock3,
  Activity,
  AlertTriangle,
  UploadCloud,
  X,
} from "lucide-react";

import UploadCSV from "./upload-csv";

import Navbar from "./navbar";

import DashboardCharts from "./dashboard-charts";

import ActiveFlightsModal from "./active-flight-modal";

type Mission = {
  mission_name: string;

  total_flights: number;

  total_duration: number;

  avg_duration: number;

  last_flight: string;
};

type ActiveFlight = {
  id: number;

  flight_id: string;

  mission_name: string;

  start_time: string;

  end_time: string;

  duration_min: number;
};

type LowBatteryFlight = {
  flight_id: string;

  battery_id: string;

  end_percent: number;
};

type DashboardStats = {
  total_missions: number;

  total_flights: number;

  total_duration: number;

  avg_duration: number;

  active_flights: number;

  battery_alerts: number;

  latest_upload: string;

  mission_growth: number;

  flight_growth: number;

  duration_growth: number;

  avg_growth: number;

  active_flight_list: ActiveFlight[];

  low_battery_flights: LowBatteryFlight[];
};

type SortKey =
  | "mission_name"
  | "last_flight"
  | "total_flights"
  | "total_duration"
  | "avg_duration";

export default function MissionTable() {
  const [missions, setMissions] = useState<Mission[]>([]);

  const [stats, setStats] = useState<DashboardStats>({
    total_missions: 0,

    total_flights: 0,

    total_duration: 0,

    avg_duration: 0,

    active_flights: 0,

    battery_alerts: 0,

    latest_upload: "",

    mission_growth: 0,

    flight_growth: 0,

    duration_growth: 0,

    avg_growth: 0,

    active_flight_list: [],

    low_battery_flights: [],
  });

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState<SortKey>("last_flight");

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [currentPage, setCurrentPage] = useState(1);

  const [openActiveModal, setOpenActiveModal] = useState(false);

  const rowsPerPage = 10;

  // FETCH
  useEffect(() => {
    fetch("/api/missions")
      .then((res) => res.json())
      .then((res) => {
        if (Array.isArray(res)) {
          setMissions(res);
        }
      });

    fetch("/api/dashboard-stats")
      .then((res) => res.json())
      .then((res) => {
        setStats(res);
      });
  }, []);

  // REAL DATA
  const activeFlights = stats.active_flights || 0;

  const batteryAlerts = stats.battery_alerts || 0;

  const latestUpload = stats.latest_upload
    ? new Date(stats.latest_upload).toLocaleString("id-ID")
    : "-";

  // SORT
  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);

      setSortDirection("asc");
    }
  };

  // FILTER
  const filteredMissions = useMemo(() => {
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

      if (
        typeof valueA === "string" &&
        typeof valueB === "string" &&
        isNaN(Number(valueA)) &&
        isNaN(Number(valueB))
      ) {
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      const numA = parseFloat(String(valueA));

      const numB = parseFloat(String(valueB));

      return sortDirection === "asc" ? numA - numB : numB - numA;
    });

    return filtered;
  }, [missions, search, sortBy, sortDirection]);

  // SORT ICON
  const renderSortIcon = (key: SortKey) => {
    if (sortBy !== key) {
      return <ArrowDown className="h-4 w-4 text-gray-300" />;
    }

    return sortDirection === "asc" ? (
      <ArrowDown className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowUp className="h-4 w-4 text-blue-600" />
    );
  };

  // PAGINATION
  const totalPages = Math.ceil(filteredMissions.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;

  const endIndex = startIndex + rowsPerPage;

  const paginatedMissions = filteredMissions.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <Navbar title="Mission Dashboard" subtitle="Drone Flight Management" />

      <div className="space-y-6 px-4 pt-[140px] pb-8 md:px-6 xl:px-8">
        {/* KPI */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="TOTAL MISSIONS"
            value={stats.total_missions}
            trend={`${stats.mission_growth}%`}
            subtitle="vs previous 7 days"
            icon={<Flag className="h-7 w-7 text-blue-600" />}
            iconBg="bg-blue-100"
          />

          <StatsCard
            title="TOTAL FLIGHTS"
            value={stats.total_flights}
            trend={`${stats.flight_growth}%`}
            subtitle="vs previous 7 days"
            icon={<Plane className="h-7 w-7 text-indigo-600" />}
            iconBg="bg-indigo-100"
          />

          <StatsCard
            title="TOTAL DURATION"
            value={`${stats.total_duration} min`}
            trend={`${stats.duration_growth}%`}
            subtitle="vs previous 7 days"
            icon={<Clock3 className="h-7 w-7 text-green-600" />}
            iconBg="bg-green-100"
          />

          <StatsCard
            title="AVG DURATION"
            value={`${Math.round(stats.avg_duration || 0)} min`}
            trend={`${stats.avg_growth}%`}
            subtitle="vs previous 7 days"
            icon={<Activity className="h-7 w-7 text-orange-600" />}
            iconBg="bg-orange-100"
          />
        </div>

        {/* OPERATION */}
        {/* OPERATION */}
        <div className="grid auto-rows-fr grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {/* ACTIVE FLIGHT */}
          <div className="flex min-h-[220px] flex-col justify-between rounded-[28px] border bg-white p-6 shadow-sm">
            {/* TOP */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Active Flights
                </p>

                <h1 className="mt-3 text-4xl font-bold">{activeFlights}</h1>

                <p className="mt-2 text-sm text-gray-500">Flights today</p>
              </div>

              <div className="rounded-2xl bg-green-100 p-4">
                <Plane className="h-6 w-6 text-green-600" />
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={() => setOpenActiveModal(true)}
              className="mt-6 flex h-[48px] w-full items-center justify-center rounded-2xl border bg-white text-sm font-semibold transition hover:bg-gray-100"
            >
              View Active Flights
            </button>
          </div>

          {/* LOW BATTERY */}
          <div className="flex min-h-[220px] flex-col rounded-[28px] border bg-white p-6 shadow-sm">
            {/* HEADER */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Low Battery Alert
                </p>

                <h1 className="mt-3 text-4xl font-bold">{batteryAlerts}</h1>

                <p className="mt-2 text-sm text-gray-500">
                  Flights ended below 20%
                </p>
              </div>

              <div className="rounded-2xl bg-orange-100 p-4">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>

            {/* LIST */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {stats.low_battery_flights?.map((flight) => (
                <div
                  key={flight.flight_id}
                  className="rounded-2xl border bg-gray-50 p-3"
                >
                  {/* TOP */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="truncate text-xs font-semibold">
                        {flight.flight_id}
                      </p>

                      <p className="mt-1 truncate text-[11px] text-gray-500">
                        {flight.battery_id}
                      </p>
                    </div>

                    <div className="rounded-full bg-red-100 px-2 py-1 text-[10px] font-semibold text-red-700">
                      {flight.end_percent}%
                    </div>
                  </div>

                  {/* BAR */}
                  <div className="mt-3 h-1.5 rounded-full bg-gray-200">
                    <div
                      className={`h-1.5 rounded-full ${
                        flight.end_percent <= 20
                          ? "bg-red-500"
                          : flight.end_percent <= 50
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      } `}
                      style={{
                        width: `${flight.end_percent}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LATEST UPLOAD */}
          <div className="flex min-h-[220px] flex-col justify-between rounded-[28px] border bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Latest Upload
                </p>

                <h1 className="mt-3 text-2xl leading-snug font-bold">
                  {latestUpload}
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                  Last imported record
                </p>
              </div>

              <div className="rounded-2xl bg-blue-100 p-4">
                <UploadCloud className="h-6 w-6 text-blue-600" />
              </div>
            </div>

            {/* STATUS */}
            <div className="mt-6 rounded-2xl border bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Upload Status</p>

              <div className="mt-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>

                <span className="text-sm font-semibold text-green-600">
                  Synced Successfully
                </span>
              </div>
            </div>
          </div>

          {/* HEALTH */}
          <div className="flex min-h-[220px] flex-col justify-between rounded-[28px] border bg-white p-6 shadow-sm">
            {/* TOP */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500">
                  Flight Health
                </p>

                <h1 className="mt-3 text-4xl font-bold text-green-600">Good</h1>

                <p className="mt-2 text-sm text-gray-500">System operational</p>
              </div>

              <div className="rounded-2xl bg-green-100 p-4">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
            </div>

            {/* BAR */}
            <div className="mt-6">
              <div className="h-2 rounded-full bg-gray-100">
                <div className="h-2 w-[92%] rounded-full bg-green-500"></div>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>Operational Status</span>

                <span>92%</span>
              </div>
            </div>
          </div>
        </div>

        {/* CHART */}
        <DashboardCharts />

        {/* ACTION */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-[420px]">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);

                setCurrentPage(1);
              }}
              placeholder="Search mission..."
              className="h-[54px] w-full rounded-2xl border bg-white pl-12 text-sm transition outline-none focus:border-blue-500 md:text-base"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/flights">
              <button className="flex h-[56px] items-center justify-center rounded-2xl border bg-white px-6 font-semibold shadow-sm transition hover:border-blue-500 hover:bg-blue-50">
                View All Flights
              </button>
            </Link>

            <UploadCSV />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <h2 className="text-2xl font-bold">Recent Missions</h2>

            <p className="mt-1 text-sm text-gray-500">
              Overview of latest drone missions
            </p>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              {/* HEAD */}
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-4 text-left md:p-6">
                    <button
                      onClick={() => handleSort("mission_name")}
                      className="flex items-center gap-2 text-xs font-bold tracking-wide md:text-sm"
                    >
                      MISSION
                      {renderSortIcon("mission_name")}
                    </button>
                  </th>

                  <th className="p-4 text-left md:p-6">
                    <button
                      onClick={() => handleSort("last_flight")}
                      className="flex items-center gap-2 text-xs font-bold tracking-wide md:text-sm"
                    >
                      LAST FLIGHT
                      {renderSortIcon("last_flight")}
                    </button>
                  </th>

                  <th className="p-4 text-left md:p-6">
                    <button
                      onClick={() => handleSort("total_flights")}
                      className="flex items-center gap-2 text-xs font-bold tracking-wide md:text-sm"
                    >
                      FLIGHTS
                      {renderSortIcon("total_flights")}
                    </button>
                  </th>

                  <th className="p-4 text-left md:p-6">
                    <button
                      onClick={() => handleSort("total_duration")}
                      className="flex items-center gap-2 text-xs font-bold tracking-wide md:text-sm"
                    >
                      TOTAL DURATION
                      {renderSortIcon("total_duration")}
                    </button>
                  </th>

                  <th className="p-4 text-left md:p-6">
                    <button
                      onClick={() => handleSort("avg_duration")}
                      className="flex items-center gap-2 text-xs font-bold tracking-wide md:text-sm"
                    >
                      AVG DURATION
                      {renderSortIcon("avg_duration")}
                    </button>
                  </th>

                  <th className="p-4 text-right text-xs font-bold tracking-wide md:p-6 md:text-sm">
                    ACTION
                  </th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {paginatedMissions.map((item) => (
                  <tr
                    key={item.mission_name}
                    className="border-b transition hover:bg-gray-50"
                  >
                    <td className="p-4 md:p-6">
                      <span className="rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold text-blue-700 md:text-sm">
                        {item.mission_name}
                      </span>
                    </td>

                    <td className="p-4 text-sm md:p-6 md:text-lg">
                      {new Date(item.last_flight).toLocaleDateString("id-ID")}
                    </td>

                    <td className="p-4 md:p-6">
                      <span className="rounded-full bg-purple-100 px-4 py-1 text-xs text-purple-700 md:text-sm">
                        {item.total_flights} flights
                      </span>
                    </td>

                    <td className="p-4 md:p-6">
                      <span className="rounded-full bg-yellow-100 px-4 py-1 text-xs text-yellow-700 md:text-sm">
                        {item.total_duration} min
                      </span>
                    </td>

                    <td className="p-4 text-sm md:p-6 md:text-lg">
                      {item.avg_duration} min
                    </td>

                    <td className="p-4 text-right md:p-6">
                      <Link
                        href={`/missions/${item.mission_name}`}
                        className="inline-flex rounded-2xl border bg-white px-4 py-2 text-sm transition hover:bg-gray-100 md:px-5"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ActiveFlightsModal
        open={openActiveModal}
        onClose={() => setOpenActiveModal(false)}
        flights={stats.active_flight_list || []}
      />
    </div>
  );
}

// KPI CARD
function StatsCard({
  title,
  value,
  trend,
  subtitle,
  icon,
  iconBg,
}: {
  title: string;

  value: string | number;

  trend: string;

  subtitle: string;

  icon: React.ReactNode;

  iconBg: string;
}) {
  const isPositive = Number(trend.replace("%", "")) >= 0;

  return (
    <div className="rounded-[28px] border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
            {title}
          </p>

          <h1 className="mt-4 text-5xl font-bold">{value}</h1>

          <div className="mt-4 flex items-center gap-2">
            <span
              className={`text-sm font-semibold ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend}
            </span>

            <span className="text-sm text-gray-500">{subtitle}</span>
          </div>
        </div>

        <div className={`rounded-2xl p-5 ${iconBg}`}>{icon}</div>
      </div>
    </div>
  );
}
