"use client";

import { useEffect, useState } from "react";

export default function useDashboardData() {
  const [missions, setMissions] = useState([]);

  const [stats, setStats] = useState<any>({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [missionRes, statsRes] = await Promise.all([
          fetch("/api/missions"),
          fetch("/api/dashboard-stats"),
        ]);

        const missionData = await missionRes.json();

        const statsData = await statsRes.json();

        // fake loading biar smooth
        await new Promise((resolve) => setTimeout(resolve, 300));

        setMissions(missionData);

        setStats(statsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return {
    missions,
    stats,
    loading,
  };
}
