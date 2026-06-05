"use client";

import Link from "next/link";

type Props = {
  missions: any[];
};

export default function DashboardTable({ missions }: Props) {
  return (
    <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          {/* HEAD */}
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-6 text-left text-sm font-bold">MISSION</th>

              <th className="p-6 text-left text-sm font-bold">LAST FLIGHT</th>

              <th className="p-6 text-left text-sm font-bold">FLIGHTS</th>

              <th className="p-6 text-left text-sm font-bold">
                TOTAL DURATION
              </th>

              <th className="p-6 text-left text-sm font-bold">AVG DURATION</th>

              <th className="p-6 text-right text-sm font-bold">ACTION</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {missions.map((item) => (
              <tr
                key={item.mission_name}
                className="border-b transition hover:bg-gray-50"
              >
                <td className="p-6">
                  <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">
                    {item.mission_name}
                  </span>
                </td>

                <td className="p-6 text-lg">
                  {new Date(item.last_flight).toLocaleDateString("id-ID")}
                </td>

                <td className="p-6">
                  <span className="rounded-full bg-purple-100 px-4 py-1 text-sm text-purple-700">
                    {item.total_flights} flights
                  </span>
                </td>

                <td className="p-6">
                  <span className="rounded-full bg-yellow-100 px-4 py-1 text-sm text-yellow-700">
                    {item.total_duration} min
                  </span>
                </td>

                <td className="p-6 text-lg">{item.avg_duration} min</td>

                <td className="p-6 text-right">
                  <Link
                    href={`/missions/${item.mission_name}`}
                    className="inline-flex rounded-2xl border bg-white px-5 py-2 text-sm transition hover:bg-gray-100"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}

            {missions.length === 0 && (
              <tr>
                <td colSpan={6} className="py-20 text-center text-gray-400">
                  No missions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
