export async function createFlight(payload: any) {
  const res = await fetch("/api/flights/add", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(payload),
  });

  return {
    ok: res.ok,

    data: await res.json(),
  };
}
