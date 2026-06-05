"use client";

import { useMemo, useState } from "react";

export default function usePagination<T>(data: T[], rowsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;

    return data.slice(start, start + rowsPerPage);
  }, [currentPage, data, rowsPerPage]);

  return {
    currentPage,

    setCurrentPage,

    totalPages,

    paginatedData,
  };
}
