"use client";

import { useState } from "react";

import { FileSpreadsheet } from "lucide-react";

import UploadCSVModal from "./upload-csv-modal";

export default function UploadCSV() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-[56px] items-center gap-4 rounded-2xl border bg-white px-5 shadow-sm transition hover:border-blue-500 hover:bg-blue-50"
      >
        {/* ICON */}
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
          <FileSpreadsheet className="h-5 w-5 text-green-600" />
        </div>

        {/* TEXT */}
        <div className="text-left">
          <p className="text-sm font-semibold">Upload CSV</p>

          <p className="text-xs text-gray-500">Import drone flight logs</p>
        </div>
      </button>

      {/* MODAL */}
      <UploadCSVModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
