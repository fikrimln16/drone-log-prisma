"use client";

import { useRef } from "react";

import Papa from "papaparse";

import { useRouter } from "next/navigation";

import { Download, FileSpreadsheet, Upload, X } from "lucide-react";

type CSVRow = {
  flight_date: string;

  ama: string;

  estate: string;

  pilot: string;

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

type Props = {
  open: boolean;

  onClose: () => void;
};

export default function UploadCSVModal({ open, onClose }: Props) {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  // DOWNLOAD TEMPLATE
  function handleDownloadTemplate() {
    const headers = [
      "flight_date",
      "ama",
      "estate",
      "pilot",
      "flight_id",
      "mission_name",
      "battery_id",
      "battery_id_2",
      "battery_color",
      "start_percent",
      "end_percent",
      "start_volt",
      "end_volt",
      "start_time",
      "end_time",
      "duration_min",
      "notes",
    ];

    const sample = [
      "2026-06-01",
      "AMA01",
      "Estate Alpha",
      "ICAPY",
      "FLY001",
      "THERMAL_SCAN",
      "BAT001",
      "BAT002",
      "Blue",
      "100",
      "40",
      "25.20",
      "22.10",
      "13:00",
      "14:00",
      "40",
      "Routine drone flight",
    ];

    const csv = [headers.join(","), sample.join(",")].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "DRONE_FLIGHT_TEMPLATE.csv";

    link.click();

    URL.revokeObjectURL(url);
  }

  // CHOOSE FILE
  function handleChooseFile() {
    fileInputRef.current?.click();
  }

  // HANDLE FILE
  function handleFile(file: File) {
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      {/* CARD */}
      <div className="w-full max-w-[760px] rounded-[32px] bg-white p-8 shadow-2xl">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
              <FileSpreadsheet className="h-8 w-8 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold">Upload CSV Guide</h1>

            <p className="mt-3 text-gray-500">
              Please use the correct CSV format before uploading drone flight
              logs.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full border hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* REQUIRED COLUMNS */}
        <div className="mt-8 rounded-2xl border bg-gray-50 p-6">
          <h2 className="mb-4 text-lg font-bold">Required CSV Columns</h2>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              "flight_date",
              "ama",
              "estate",
              "pilot",
              "flight_id",
              "mission_name",
              "battery_id",
              "battery_id_2",
              "battery_color",
              "start_percent",
              "end_percent",
              "start_volt",
              "end_volt",
              "start_time",
              "end_time",
              "duration_min",
              "notes",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border bg-white px-4 py-3 text-sm font-medium"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ACTION */}
        <div className="mt-8 flex flex-col gap-3 md:flex-row md:justify-end">
          {/* TEMPLATE */}
          <button
            onClick={handleDownloadTemplate}
            className="flex h-[56px] items-center justify-center gap-3 rounded-2xl border bg-white px-6 font-semibold transition hover:bg-gray-100"
          >
            <Download className="h-5 w-5" />
            Download Template
          </button>

          {/* CHOOSE */}
          <button
            onClick={handleChooseFile}
            className="flex h-[56px] items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 font-semibold text-white transition hover:bg-blue-700"
          >
            <Upload className="h-5 w-5" />
            Choose CSV
          </button>
        </div>

        {/* INPUT */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />
      </div>
    </div>
  );
}
