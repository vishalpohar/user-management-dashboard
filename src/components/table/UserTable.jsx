import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Briefcase,
  Mail,
  UserPlus
} from "lucide-react";
import { getInitials, getAvatarColor, cn } from "../../utils/helpers";
import { DEPT_COLORS } from "../../utils/constants";
import { motion, AnimatePresence } from "framer-motion";

export default function UserTable({
  users,
  sorting,
  onSortChange,
  onEditClick,
  onDeleteClick,
  onAddUserClick
}) {
  
  // Sort toggle handler
  const handleSort = (field) => {
    if (sorting.field === field) {
      onSortChange({
        field,
        order: sorting.order === "asc" ? "desc" : "asc"
      });
    } else {
      onSortChange({ field, order: "asc" });
    }
  };

  // Sort Icon Renderer
  const renderSortIcon = (field) => {
    if (sorting.field !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50 hover:opacity-100 transition-opacity" />;
    }
    return sorting.order === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4 text-primary-600 font-bold" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-primary-600 font-bold" />
    );
  };

  // Columns definition for TanStack Table
  const columns = React.useMemo(
    () => [
      {
        id: "id",
        header: () => (
          <button
            type="button"
            onClick={() => handleSort("id")}
            className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none"
          >
            ID {renderSortIcon("id")}
          </button>
        ),
        accessorKey: "id",
        cell: (info) => (
          <span className="text-sm font-semibold text-slate-400">
            #{info.getValue()}
          </span>
        )
      },
      {
        id: "name",
        header: () => (
          <button
            type="button"
            onClick={() => handleSort("firstName")}
            className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none"
          >
            User {renderSortIcon("firstName")}
          </button>
        ),
        accessorKey: "firstName",
        cell: (info) => {
          const row = info.row.original;
          const initials = getInitials(row.firstName, row.lastName);
          const colorPreset = getAvatarColor(row.id);
          return (
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-white shadow-sm",
                  colorPreset
                )}
              >
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {row.firstName} {row.lastName}
                </p>
                <p className="text-xs text-slate-450 truncate">@{row.firstName.toLowerCase()}</p>
              </div>
            </div>
          );
        }
      },
      {
        id: "email",
        header: () => (
          <button
            type="button"
            onClick={() => handleSort("email")}
            className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none"
          >
            Email Address {renderSortIcon("email")}
          </button>
        ),
        accessorKey: "email",
        cell: (info) => (
          <span className="text-sm text-slate-600 block truncate max-w-[200px]" title={info.getValue()}>
            {info.getValue()}
          </span>
        )
      },
      {
        id: "department",
        header: () => (
          <button
            type="button"
            onClick={() => handleSort("department")}
            className="flex items-center text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none"
          >
            Department {renderSortIcon("department")}
          </button>
        ),
        accessorKey: "department",
        cell: (info) => {
          const dept = info.getValue();
          const styling = DEPT_COLORS[dept] || {
            bg: "bg-slate-50 text-slate-700 border-slate-200",
            dot: "bg-slate-500"
          };
          return (
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                styling.bg
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", styling.dot)} />
              {dept}
            </span>
          );
        }
      },
      {
        id: "actions",
        header: () => (
          <span className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider block pr-4">
            Actions
          </span>
        ),
        cell: (info) => {
          const user = info.row.original;
          return (
            <div className="flex items-center justify-end space-x-2.5 pr-2">
              <button
                type="button"
                onClick={() => onEditClick(user)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors focus:outline-none cursor-pointer"
                title="Edit User"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteClick(user.id)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors focus:outline-none cursor-pointer"
                title="Delete User"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        }
      }
    ],
    [sorting]
  );

  // TanStack Table Instance
  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  // Empty State Layout
  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-100 shadow-sm min-h-[360px]">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 mb-4 animate-bounce">
          <Briefcase className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No users found</h3>
        <p className="mt-1 text-sm text-slate-400 max-w-sm mx-auto">
          We couldn't find any user profiles matching your selected criteria. Try adjusting your search query or filters.
        </p>
        <div className="mt-5 flex gap-2 justify-center">
          <button
            type="button"
            onClick={onAddUserClick}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-700 active:scale-97 transition-all cursor-pointer"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Add User
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 1. Desktop Tabular Grid View (Hidden on mobile) */}
      <div className="hidden md:block overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-slate-100 bg-slate-50/50 hover:bg-slate-50/50"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 font-semibold text-slate-700"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence initial={false}>
                {table.getRowModel().rows.map((row) => (
                  <motion.tr
                    key={row.id}
                    layoutId={`row-${row.original.id}`}
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.2 }}
                    className="hover:bg-slate-50/65 group transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4.5 align-middle">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Mobile Stacked Layout (Visible only on mobile screens) */}
      <div className="block md:hidden space-y-3.5">
        <AnimatePresence initial={false}>
          {users.map((user) => {
            const initials = getInitials(user.firstName, user.lastName);
            const colorPreset = getAvatarColor(user.id);
            const deptStyling = DEPT_COLORS[user.department] || {
              bg: "bg-slate-50 text-slate-700 border-slate-200",
              dot: "bg-slate-500"
            };

            return (
              <motion.div
                key={user.id}
                layoutId={`card-${user.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-sm flex flex-col gap-4"
              >
                {/* Header Information */}
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-white shadow-sm",
                      colorPreset
                    )}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <span className="text-xs font-semibold text-slate-400">
                        #{user.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 text-slate-500">
                      <Mail className="h-3.5 w-3.5" />
                      <p className="text-xs truncate max-w-[190px]">{user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Controls & Department Badging */}
                <div className="flex items-center justify-between pt-3.5 border-t border-slate-50">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                      deptStyling.bg
                    )}
                  >
                    <span className={cn("h-1.5 w-1.5 rounded-full", deptStyling.dot)} />
                    {user.department}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEditClick(user)}
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 active:scale-97 cursor-pointer transition-all"
                    >
                      <Edit2 className="h-3.5 w-3.5 text-slate-500" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteClick(user.id)}
                      className="inline-flex h-8 items-center gap-1 rounded-lg bg-red-50 text-red-650 px-3 text-xs font-semibold hover:bg-red-100 active:scale-97 cursor-pointer transition-all border border-red-100"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      Delete
                    </button>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
