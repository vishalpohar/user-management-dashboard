import React from "react";
import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  icon: Icon,
  colorClass = "bg-primary-50 text-primary-600",
  description
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between hover-lift relative overflow-hidden"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-500 truncate">{title}</p>
        <h3 className="mt-1 text-3xl font-bold text-slate-900 tracking-tight">
          {value}
        </h3>
        {description && (
          <p className="mt-1 text-xs text-slate-400 truncate">{description}</p>
        )}
      </div>

      <div className={`p-3.5 rounded-xl ${colorClass} flex items-center justify-center`}>
        {Icon && <Icon className="h-6 w-6" />}
      </div>
      
      {/* Decorative subtle background gradient */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-slate-50 rounded-full opacity-30 z-0 pointer-events-none" />
    </motion.div>
  );
}
