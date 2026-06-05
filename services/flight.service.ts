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

export async function updateFlight(id: number, payload: any) {
  const res = await fetch(`/api/flights/${id}`, {
    method: "PUT",

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
