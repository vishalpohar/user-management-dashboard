import React from "react";

/**
 * Standard spinner component.
 */
export function Spinner({ className = "h-6 w-6 text-primary-600" }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

/**
 * Table Loading Skeleton Component.
 * Simulates table rows loading using nice animated gradient bars.
 */
export function TableSkeleton({ rowsCount = 5 }) {
  return (
    <div className="w-full divide-y divide-slate-100 animate-pulse">
      {Array.from({ length: rowsCount }).map((_, idx) => (
        <div key={idx} className="flex items-center justify-between p-4 bg-white">
          <div className="flex items-center space-x-3 w-1/4">
            <div className="h-10 w-10 rounded-full bg-slate-200" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 rounded w-5/6" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          </div>
          <div className="h-4 bg-slate-200 rounded w-1/4" />
          <div className="h-5 bg-slate-200 rounded-full w-20" />
          <div className="h-4 bg-slate-200 rounded w-12" />
          <div className="flex space-x-2 w-16 justify-end">
            <div className="h-8 w-8 bg-slate-200 rounded-lg" />
            <div className="h-8 w-8 bg-slate-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Stat Cards loading skeleton.
 */
export function StatSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="space-y-2.5 flex-1">
            <div className="h-3 bg-slate-100 rounded w-1/3" />
            <div className="h-8 bg-slate-200 rounded w-1/2" />
          </div>
          <div className="h-12 w-12 rounded-xl bg-slate-200" />
        </div>
      ))}
    </div>
  );
}
