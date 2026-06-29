import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, RotateCcw } from "lucide-react";
import { DEPARTMENTS } from "../../utils/constants";

export default function FilterPopup({
  isOpen,
  filters,
  onApplyFilters,
  onClose,
  onResetFilters
}) {
  const [localFilters, setLocalFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: ""
  });

  // Sync state with parent filters when opened or changed
  useEffect(() => {
    if (isOpen) {
      setLocalFilters({ ...filters });
    }
  }, [isOpen, filters]);

  const handleInputChange = (field, value) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApply = (e) => {
    e.preventDefault();
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const cleared = { firstName: "", lastName: "", email: "", department: "" };
    setLocalFilters(cleared);
    onResetFilters();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: "auto", marginTop: 16 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm"
        >
          <form onSubmit={handleApply} className="p-5 space-y-4">
            
            {/* Title / Description */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-50">
              <h4 className="text-sm font-semibold text-slate-800">Advanced Filters</h4>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              
              {/* First Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  value={localFilters.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="e.g. Leanne"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm placeholder-slate-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  value={localFilters.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="e.g. Graham"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm placeholder-slate-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="text"
                  value={localFilters.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="e.g. seth@company.com"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm placeholder-slate-400 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Department
                </label>
                <select
                  value={localFilters.department}
                  onChange={(e) => handleInputChange("department", e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-750 focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all cursor-pointer"
                >
                  <option value="">All Departments</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Actions Panel */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-50">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg active:scale-97 transition-all cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Filters
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg active:scale-97 transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-1 px-4 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm shadow-primary-500/10 active:scale-97 transition-all cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                Apply Filters
              </button>
            </div>

          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
