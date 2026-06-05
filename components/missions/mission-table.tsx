"use client";

import MissionRow from "./mission-row";

import MissionSortHeader from "./mission-sort-header";

type Props = {
  flights: any[];

  sortBy: string;

  sortDirection: "asc" | "desc";

  onSort: (key: any) => void;

  onDetail: (item: any) => void;

  onEdit: (item: any) => void;

  onDelete: (item: any) => void;
};

export default function MissionTable({
  flights,
  sortBy,
  sortDirection,
  onSort,
  onDetail,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-[32px] border bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          {/* HEAD */}
          <thead className="border-b bg-gray-50">
            <tr>
              <MissionSortHeader
                label="DATE"
                field="flight_date"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <MissionSortHeader
                label="AMA"
                field="ama"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <MissionSortHeader
                label="ESTATE"
                field="estate"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <MissionSortHeader
                label="FLIGHT ID"
                field="flight_id"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <MissionSortHeader
                label="BATTERY"
                field="battery_id"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <MissionSortHeader
                label="DURATION"
                field="duration_min"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <MissionSortHeader
                label="NOTES"
                field="notes"
                sortBy={sortBy}
                sortDirection={sortDirection}
                onSort={onSort}
              />

              <th className="p-6 text-right text-sm font-bold">ACTION</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {flights.map((item) => (
              <MissionRow
                key={item.id}
                item={item}
                onDetail={onDetail}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
