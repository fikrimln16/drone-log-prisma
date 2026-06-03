"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, FileSpreadsheet, Upload, AlertCircle } from "lucide-react";

type CSVRow = {
  flight_date: string;
  flight_id: string;
  mission_name: string;
  battery_id: string;
  battery_color: string;
  start_percent: string;
  end_percent: string;
  start_volt: string;
  end_volt: string;
  start_time: string;
  end_time: string;
  duration_min: string;
  notes: string;
};

export default function PreviewUploadPage() {
  const router = useRouter();

  const [rows, setRows] = useState<CSVRow[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("csv-preview");

    if (!data) {
      router.push("/");

      return;
    }

    setRows(JSON.parse(data));
  }, [router]);

  // VALIDATION
  const invalidRows = useMemo(() => {
    return rows.filter(
      (row) =>
        !row.flight_date ||
        !row.flight_id ||
        !row.mission_name ||
        !row.battery_id
    );
  }, [rows]);

  // STATS
  const totalDuration = rows.reduce(
    (a, b) => a + Number(b.duration_min || 0),
    0
  );

  const totalMission = new Set(rows.map((x) => x.mission_name)).size;

  async function handleUpload() {
    try {
      setLoading(true);

      const res = await fetch("/api/upload-json", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(rows),
      });

      const result = await res.json();

      alert(result.message);

      localStorage.removeItem("csv-preview");

      router.push("/");
    } catch (err) {
      console.error(err);

      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 z-[999] flex h-[92px] w-full items-center justify-between border-b bg-white/90 px-8 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="flex h-[58px] w-[58px] items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
            <FileSpreadsheet className="h-7 w-7 text-white" />
          </div>

          <div>
            <h1 className="text-4xl font-bold">CSV Preview</h1>

            <p className="text-lg text-gray-500">Review before upload</p>
          </div>
        </div>

        <button
          onClick={() => router.back()}
          className="rounded-2xl border bg-white px-6 py-3 font-semibold transition hover:bg-gray-100"
        >
          Back
        </button>
      </div>

      {/* CONTENT */}
      <div className="space-y-8 px-8 pt-[125px] pb-10">
        {/* STATS */}
        <div className="grid grid-cols-4 gap-6">
          <StatsCard title="TOTAL ROWS" value={rows.length} />

          <StatsCard title="MISSIONS" value={totalMission} />

          <StatsCard title="TOTAL DURATION" value={`${totalDuration} min`} />

          <StatsCard
            title="INVALID ROWS"
            value={invalidRows.length}
            danger={invalidRows.length > 0}
          />
        </div>

        {/* VALIDATION WARNING */}
        {invalidRows.length > 0 && (
          <div className="flex items-center gap-3 rounded-3xl border border-red-200 bg-red-50 px-6 py-5 text-red-700">
            <AlertCircle className="h-5 w-5" />

            <p>Some rows are invalid. Please fix the CSV file before upload.</p>
          </div>
        )}

        {/* TABLE */}
        <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
          <div className="overflow-auto">
            <table className="w-full min-w-[1400px]">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="p-5 text-left">DATE</th>

                  <th className="p-5 text-left">FLIGHT ID</th>

                  <th className="p-5 text-left">MISSION</th>

                  <th className="p-5 text-left">BATTERY</th>

                  <th className="p-5 text-left">COLOR</th>

                  <th className="p-5 text-left">DURATION</th>

                  <th className="p-5 text-left">NOTES</th>

                  <th className="p-5 text-left">STATUS</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((item, index) => {
                  const invalid =
                    !item.flight_date ||
                    !item.flight_id ||
                    !item.mission_name ||
                    !item.battery_id;

                  return (
                    <tr
                      key={index}
                      className={`border-b ${
                        invalid ? "bg-red-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="p-5">{item.flight_date}</td>

                      <td className="p-5">
                        <span className="rounded-full bg-blue-100 px-4 py-1 text-sm text-blue-700">
                          {item.flight_id}
                        </span>
                      </td>

                      <td className="p-5 font-semibold text-blue-600">
                        {item.mission_name}
                      </td>

                      <td className="p-5">{item.battery_id}</td>

                      <td className="p-5">{item.battery_color}</td>

                      <td className="p-5">
                        <span className="rounded-full bg-yellow-100 px-4 py-1 text-sm text-yellow-700">
                          {item.duration_min} min
                        </span>
                      </td>

                      <td className="p-5">{item.notes}</td>

                      <td className="p-5">
                        {invalid ? (
                          <span className="rounded-full bg-red-100 px-4 py-1 text-sm text-red-700">
                            Invalid
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-100 px-4 py-1 text-sm text-green-700">
                            Valid
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ACTION */}
        <div className="flex justify-end gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-2xl border bg-white px-6 py-4 font-semibold transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            disabled={invalidRows.length > 0 || loading}
            onClick={handleUpload}
            className="flex items-center gap-3 rounded-2xl bg-black px-8 py-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Upload className="h-5 w-5" />

            {loading ? "Uploading..." : "Upload CSV"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  danger,
}: {
  title: string;
  value: string | number;
  danger?: boolean;
}) {
  return (
    <div
      className={`rounded-[32px] border bg-white p-8 shadow-sm ${danger ? "border-red-300" : ""} `}
    >
      <p className="text-sm tracking-wide text-gray-500 uppercase">{title}</p>

      <h1 className={`mt-5 text-5xl font-bold ${danger ? "text-red-600" : ""}`}>
        {value}
      </h1>
    </div>
  );
}
