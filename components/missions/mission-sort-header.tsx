import { ArrowDown, ArrowUp } from "lucide-react";

type Props = {
  label: string;

  field: string;

  sortBy: string;

  sortDirection: "asc" | "desc";

  onSort: (key: string) => void;
};

export default function MissionSortHeader({
  label,
  field,
  sortBy,
  sortDirection,
  onSort,
}: Props) {
  const active = sortBy === field;

  return (
    <th className="p-6 text-left">
      <button
        onClick={() => onSort(field)}
        className="flex items-center gap-2 text-sm font-bold tracking-wide"
      >
        {label}

        {!active ? (
          <ArrowDown className="h-4 w-4 text-gray-300" />
        ) : sortDirection === "asc" ? (
          <ArrowDown className="h-4 w-4 text-blue-600" />
        ) : (
          <ArrowUp className="h-4 w-4 text-blue-600" />
        )}
      </button>
    </th>
  );
}
