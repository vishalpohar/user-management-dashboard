import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils/helpers";

export default function Pagination({
  currentPage,
  pageSize,
  totalPages,
  totalEntries,
  onPageChange,
  onPageSizeChange
}) {
  const startEntry = totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endEntry = Math.min(currentPage * pageSize, totalEntries);

  // Generate page numbers
  const pageNumbers = [];
  const maxPageVisible = 5;

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + maxPageVisible - 1);

  if (endPage - startPage < maxPageVisible - 1) {
    startPage = Math.max(1, endPage - maxPageVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm mt-5">
      
      {/* Page Size Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">Rows per page</span>
        <select
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1); // reset to page 1
          }}
          className="rounded-xl border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-sm font-medium focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all cursor-pointer"
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        
        {/* Info Text */}
        <span className="text-sm text-slate-400 ml-2 hidden sm:inline">
          Showing <span className="font-semibold text-slate-700">{startEntry}</span> to{" "}
          <span className="font-semibold text-slate-700">{endEntry}</span> of{" "}
          <span className="font-semibold text-slate-700">{totalEntries}</span> users
        </span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between sm:justify-end gap-2">
        {/* Mobile Info Text */}
        <span className="text-xs text-slate-400 sm:hidden">
          {startEntry}-{endEntry} of {totalEntries}
        </span>

        <div className="flex items-center gap-1.5">
          {/* Previous Button */}
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer"
          >
            <span className="sr-only">Previous Page</span>
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page numbers */}
          {startPage > 1 && (
            <>
              <button
                type="button"
                onClick={() => onPageChange(1)}
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-all cursor-pointer",
                  currentPage === 1
                    ? "bg-primary-600 text-white shadow-sm shadow-primary-500/15"
                    : "border border-slate-200 bg-white text-slate-650 hover:bg-slate-50"
                )}
              >
                1
              </button>
              {startPage > 2 && <span className="text-slate-400 px-1 font-medium">...</span>}
            </>
          )}

          {pageNumbers.map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onPageChange(num)}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-all cursor-pointer",
                currentPage === num
                  ? "bg-primary-600 text-white shadow-sm shadow-primary-500/15"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              )}
            >
              {num}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-slate-400 px-1 font-medium">...</span>}
              <button
                type="button"
                onClick={() => onPageChange(totalPages)}
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition-all cursor-pointer",
                  currentPage === totalPages
                    ? "bg-primary-600 text-white shadow-sm shadow-primary-500/15"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                )}
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next Button */}
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer"
          >
            <span className="sr-only">Next Page</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
