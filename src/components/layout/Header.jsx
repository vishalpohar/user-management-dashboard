import React from "react";
import { Plus, Users, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function Header({ onAddUserClick, onRefreshClick, isRefreshing }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          
          {/* Brand/Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white shadow-md shadow-primary-500/20">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl m-0 leading-none">
                User Management
              </h1>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm m-0">
                Admin dashboard for managing company profiles & departments.
              </p>
            </div>
          </div>

          {/* Action Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRefreshClick}
              disabled={isRefreshing}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 active:scale-95 disabled:opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500"
              title="Refresh User Data"
            >
              <RefreshCw className={`h-4.5 w-4.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onAddUserClick}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary-500/10 hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add User</span>
            </motion.button>
          </div>

        </div>
      </div>
    </header>
  );
}
