import React, { useRef, useEffect } from "react";
import { Search, SlidersHorizontal, RotateCcw, X, ListOrdered, Infinity } from "lucide-react";
import { cn } from "../../utils/helpers";

export default function Toolbar({
  searchQuery,
  onSearchChange,
  onFilterToggle,
  isFilterOpen,
  activeFiltersCount,
  onResetFilters,
  paginationMode,
  onPaginationModeChange
}) {
  const searchInputRef = useRef(null);

  // Keyboard shortcut listener to focus search (e.g., '/')
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
      
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email, or department... (Press '/')"
          className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm placeholder-slate-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Toolbar Controls */}
      <div className="flex flex-wrap items-center gap-2.5 justify-start sm:justify-end">
        {/* Pagination Mode Selector */}
        <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200/50">
          <button
            type="button"
            onClick={() => onPaginationModeChange("numeric")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer",
              paginationMode === "numeric"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
            title="Page Pagination Mode"
          >
            <ListOrdered className="h-3.5 w-3.5" />
            <span>Pages</span>
          </button>
          <button
            type="button"
            onClick={() => onPaginationModeChange("infinite")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer",
              paginationMode === "infinite"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
            title="Infinite Scrolling Mode"
          >
            <Infinity className="h-3.5 w-3.5" />
            <span>Infinite Scroll</span>
          </button>
        </div>

        {/* Reset Filters (Visible if search or filters are active) */}
        {(activeFiltersCount > 0 || searchQuery) && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900 active:scale-97 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
        )}

        {/* Filter Popup Toggle */}
        <button
          type="button"
          onClick={onFilterToggle}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all active:scale-97 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer",
            isFilterOpen || activeFiltersCount > 0
              ? "border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-[10px] font-bold text-white leading-none">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

    </div>
  );
}
