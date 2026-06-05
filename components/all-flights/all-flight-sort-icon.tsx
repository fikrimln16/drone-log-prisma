import { ArrowDown, ArrowUp } from "lucide-react";

type Props = {
  column: string;
  sortConfig: any;
};

export default function AllFlightsSortIcon({ column, sortConfig }: Props) {
  if (sortConfig.key !== column) {
    return <ArrowDown className="h-4 w-4 text-gray-300" />;
  }

  return sortConfig.direction === "asc" ? (
    <ArrowDown className="h-4 w-4 text-blue-600" />
  ) : (
    <ArrowUp className="h-4 w-4 text-blue-600" />
  );
}
