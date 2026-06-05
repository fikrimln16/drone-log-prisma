"use client";

import { useMemo, useState } from "react";

export default function useFlightPagination(data: any[]) {
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;

    return data.slice(startIndex, startIndex + rowsPerPage);
  }, [data, currentPage]);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    rowsPerPage,
    paginatedData,
  };
}
