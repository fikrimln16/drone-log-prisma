type Props = {
  totalFlights: number;

  totalDuration: number;

  avgDuration: number;
};

export default function MissionKPI({
  totalFlights,
  totalDuration,
  avgDuration,
}: Props) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* TOTAL FLIGHTS */}
      <div className="rounded-[28px] border bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          TOTAL FLIGHTS
        </p>

        <h1 className="mt-4 text-5xl font-bold">{totalFlights}</h1>

        <p className="mt-4 text-sm text-gray-500">Total recorded flights</p>
      </div>

      {/* TOTAL DURATION */}
      <div className="rounded-[28px] border bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          TOTAL DURATION
        </p>

        <h1 className="mt-4 text-5xl font-bold">{totalDuration} min</h1>

        <p className="mt-4 text-sm text-gray-500">Total mission duration</p>
      </div>

      {/* AVG */}
      <div className="rounded-[28px] border bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
          AVG DURATION
        </p>

        <h1 className="mt-4 text-5xl font-bold">{avgDuration} min</h1>

        <p className="mt-4 text-sm text-gray-500">Average flight duration</p>
      </div>
    </div>
  );
}
