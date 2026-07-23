import React from "react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  disabled?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  disabled = false,
}: PaginationProps) {
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers array with intelligent ellipsis logic
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
      {/* Left side: Item range count & page size dropdown */}
      <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500">
        <span>
          Showing <strong className="text-zinc-950 font-bold">{startItem}</strong> -{" "}
          <strong className="text-zinc-950 font-bold">{endItem}</strong> of{" "}
          <strong className="text-zinc-950 font-bold">{totalItems}</strong> assets
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-zinc-200">
            <label htmlFor="page-size-select" className="text-zinc-400 font-medium">
              Per page:
            </label>
            <select
              id="page-size-select"
              value={pageSize}
              disabled={disabled}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-zinc-50 border border-zinc-200 text-zinc-900 rounded-lg text-xs font-bold px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer disabled:opacity-50"
            >
              <option value={6}>6</option>
              <option value={9}>9</option>
              <option value={12}>12</option>
              <option value={18}>18</option>
              <option value={27}>27</option>
            </select>
          </div>
        )}
      </div>

      {/* Right side: Page navigation buttons */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={disabled || currentPage <= 1}
          className="px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Previous Page"
        >
          Previous
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {pages.map((p, idx) => {
            if (typeof p === "string") {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 py-1 text-xs font-bold text-zinc-400">
                  ...
                </span>
              );
            }

            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                disabled={disabled || isActive}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-zinc-950 text-white shadow-sm scale-105"
                    : "bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
                } disabled:cursor-default`}
                aria-label={`Page ${p}`}
                aria-current={isActive ? "page" : undefined}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={disabled || currentPage >= totalPages}
          className="px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-100 disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
          aria-label="Next Page"
        >
          Next
        </button>
      </div>
    </div>
  );
}
