"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";

import Papa from "papaparse";

import { FileSpreadsheet } from "lucide-react";

type CSVRow = {
  flight_date: string;

  ama: string;

  estate: string;

  flight_id: string;

  mission_name: string;

  battery_id: string;

  battery_id_2: string;

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

export default function UploadCSV() {
  const router = useRouter();

  const [fileName, setFileName] = useState("");

  function handleFileSelect(file: File) {
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results: Papa.ParseResult<CSVRow>) => {
        localStorage.setItem("csv-preview", JSON.stringify(results.data));

        router.push("/preview-upload");
      },
    });
  }

  return (
    <label className="flex h-[56px] cursor-pointer items-center gap-4 rounded-2xl border bg-white px-5 shadow-sm transition hover:border-blue-500 hover:bg-blue-50">
      {/* ICON */}
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
        <FileSpreadsheet className="h-5 w-5 text-green-600" />
      </div>

      {/* TEXT */}
      <div className="max-w-[220px]">
        <p className="truncate text-sm font-semibold">
          {fileName || "Choose CSV File"}
        </p>

        <p className="text-xs text-gray-500">
          Upload drone flight logs
        </p>
      </div>

      {/* INPUT */}
      <input
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
      />
    </label>
  );
}