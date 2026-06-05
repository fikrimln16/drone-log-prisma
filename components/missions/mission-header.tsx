import Link from "next/link";

import { ArrowLeft, Download, Plus } from "lucide-react";

type Props = {
  mission: string;

  totalFlights: number;

  onOpenExport: () => void;

  onAdd: () => void;
};

export default function MissionHeader({
  mission,
  totalFlights,
  onOpenExport,
  onAdd,
}: Props) {
  return (
    <div className="mb-8">
      {/* BACK */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 rounded-2xl border bg-white px-5 py-3 text-sm font-semibold shadow-sm transition hover:border-blue-500 hover:bg-blue-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* HEADER */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        {/* TITLE */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{mission}</h1>

          <p className="mt-2 text-lg text-gray-500">
            {totalFlights} flights logged
          </p>
        </div>

        {/* BUTTON */}
        <div className="flex items-center gap-3">
          {/* EXPORT */}
          <button
            onClick={onOpenExport}
            className="flex h-[48px] items-center gap-3 rounded-2xl border bg-white px-5 font-semibold shadow-sm transition hover:bg-gray-100"
          >
            <Download className="h-5 w-5" />
            Export CSV
          </button>

          {/* ADD */}
          <button
            onClick={onAdd}
            className="flex h-[48px] items-center gap-3 rounded-2xl bg-black px-5 font-semibold text-white shadow-lg transition hover:scale-[1.02]"
          >
            <Plus className="h-5 w-5" />
            Add Flight
          </button>
        </div>
      </div>
    </div>
  );
}
