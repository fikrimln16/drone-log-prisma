"use client";

import { useEffect, useState } from "react";

import { DashboardStats, Mission } from "@/types/dashboard";

import { getDashboardStats, getMissions } from "@/services/dashboard.service";

export default function useDashboardData() {
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

  useEffect(() => {
    async function loadData() {
      try {
        const [missionData, statsData] = await Promise.all([
          getMissions(),
          getDashboardStats(),
        ]);

        setMissions(missionData);

        setStats(statsData);
      } catch (error) {
        console.error(error);
      }
    }

    loadData();
  }, []);

  return {
    missions,
    stats,
  };
}
