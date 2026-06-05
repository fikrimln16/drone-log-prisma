export async function fetchMissionFlights(mission: string) {
  const res = await fetch(`/api/missions/${mission}`);

  return res.json();
}
