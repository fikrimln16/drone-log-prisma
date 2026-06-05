export async function getDashboardStats() {
  const res = await fetch("/api/dashboard-stats");

  if (!res.ok) {
    throw new Error("Failed fetch dashboard");
  }

  return res.json();
}

export async function getMissions() {
  const res = await fetch("/api/missions");

  if (!res.ok) {
    throw new Error("Failed fetch missions");
  }

  return res.json();
}
