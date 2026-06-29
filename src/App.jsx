import React, { useState, useMemo, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { Users, LayoutGrid, FileText, CheckSquare, ShieldAlert, Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";

// Layout & Components
import Header from "./components/layout/Header";
import StatCard from "./components/common/StatCard";
import Toolbar from "./components/dashboard/Toolbar";
import FilterPopup from "./components/dashboard/FilterPopup";
import UserTable from "./components/table/UserTable";
import Pagination from "./components/dashboard/Pagination";
import Modal from "./components/ui/Modal";
import UserForm from "./components/forms/UserForm";
import { TableSkeleton, StatSkeleton } from "./components/common/Spinner";

// Hooks
import useUsers from "./hooks/useUsers";

export default function App() {
  const {
    users,
    filteredUsers,
    sortedUsers,
    paginatedUsers,
    visibleUsers,
    paginationMode,
    setPaginationMode,
    loadMore,
    hasMore,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    sorting,
    setSorting,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    addUser,
    editUser,
    removeUser,
    refreshUsers,
    resetFilters
  } = useUsers();

  // Infinite Scroll Trigger Hook
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: "150px"
  });

  // Watch for intersection visibility to load more users
  useEffect(() => {
    if (inView && paginationMode === "infinite" && hasMore && !isLoading) {
      loadMore();
    }
  }, [inView, paginationMode, hasMore, loadMore, isLoading]);

  // Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters visibility state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter((val) => val !== "").length;
  }, [filters]);

  // Unique departments calculation
  const uniqueDepartmentsCount = useMemo(() => {
    const depts = users.map((u) => u.department);
    return new Set(depts).size;
  }, [users]);

  // Edit / Add Actions
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleAddClick = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    let success = false;
    if (selectedUser) {
      success = await editUser(selectedUser.id, formData);
    } else {
      success = await addUser(formData);
    }
    setIsSubmitting(false);
    if (success) {
      setIsFormOpen(false);
    }
    return success;
  };

  // Delete Action Confirmation using styled SweetAlert2
  const handleDeleteClick = (id) => {
    Swal.fire({
      title: "Delete User Profile?",
      text: "This user profile will be removed from your dashboard database. This action is irreversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete User",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-3xl border border-slate-100 p-6 max-w-sm",
        title: "text-lg font-bold text-slate-900 mt-2",
        htmlContainer: "text-sm text-slate-500 mt-1",
        confirmButton: "bg-red-650 hover:bg-red-750 text-red-600 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all mr-2 cursor-pointer shadow-sm shadow-red-500/10",
        cancelButton: "bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer"
      },
      buttonsStyling: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        await removeUser(id);
      }
    });
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // reset to page 1
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Sticky Top-bar Header */}
      <Header
        onAddUserClick={handleAddClick}
        onRefreshClick={refreshUsers}
        isRefreshing={isLoading && users.length > 0}
      />

      {/* Main Content Dashboard Shell */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Statistics Cards Grid */}
        {isLoading && users.length === 0 ? (
          <StatSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value={users.length}
              icon={Users}
              colorClass="bg-blue-50 text-blue-600 border border-blue-100"
              description="Connected profiles"
            />
            <StatCard
              title="Departments"
              value={uniqueDepartmentsCount}
              icon={LayoutGrid}
              colorClass="bg-purple-50 text-purple-600 border border-purple-100"
              description="Active team cohorts"
            />
            <StatCard
              title="Current Page"
              value={`${currentPage} / ${totalPages}`}
              icon={FileText}
              colorClass="bg-amber-50 text-amber-600 border border-amber-100"
              description={`Limit: ${pageSize} per page`}
            />
            <StatCard
              title="Showing Records"
              value={filteredUsers.length}
              icon={CheckSquare}
              colorClass="bg-emerald-50 text-emerald-600 border border-emerald-100"
              description="Matching active filters"
            />
          </div>
        )}

        {/* Toolbar & Filter Panels */}
        <div className="space-y-4">
          <Toolbar
            searchQuery={searchQuery}
            onSearchChange={(query) => {
              setSearchQuery(query);
              setCurrentPage(1);
            }}
            onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
            isFilterOpen={isFilterOpen}
            activeFiltersCount={activeFiltersCount}
            onResetFilters={resetFilters}
            paginationMode={paginationMode}
            onPaginationModeChange={setPaginationMode}
          />

          <FilterPopup
            isOpen={isFilterOpen}
            filters={filters}
            onApplyFilters={handleApplyFilters}
            onClose={() => setIsFilterOpen(false)}
            onResetFilters={resetFilters}
          />
        </div>

        {/* Data Grid Table Segment */}
        {error ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-red-100 shadow-sm min-h-[360px]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 mb-4 shadow-sm shadow-red-500/10">
              <ShieldAlert className="h-8 w-8 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Database Connection Failed</h3>
            <p className="mt-1 text-sm text-red-500 max-w-sm mx-auto">
              {error}
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={refreshUsers}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-primary-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-700 active:scale-97 transition-all cursor-pointer"
              >
                Retry Request
              </button>
            </div>
          </div>
        ) : isLoading && users.length === 0 ? (
          <div className="overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm">
            <TableSkeleton rowsCount={6} />
          </div>
        ) : (
          <div className="space-y-4">
            <UserTable
              users={visibleUsers}
              sorting={sorting}
              onSortChange={setSorting}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
              onAddUserClick={handleAddClick}
            />

            {/* Pagination footer - only show if there are users and in numeric mode */}
            {filteredUsers.length > 0 && paginationMode === "numeric" && (
              <Pagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalPages={totalPages}
                totalEntries={filteredUsers.length}
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            )}

            {/* Infinite scroll loader indicator */}
            {filteredUsers.length > 0 && paginationMode === "infinite" && (
              <div ref={loadMoreRef} className="py-8 flex justify-center items-center">
                {hasMore ? (
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
                    <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
                    <span>Loading more profiles...</span>
                  </div>
                ) : (
                  <span className="text-slate-400 text-xs font-semibold">
                    All profiles loaded (Showing {filteredUsers.length} of {filteredUsers.length})
                  </span>
                )}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Add / Edit Form Modal Dialog */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => !isSubmitting && setIsFormOpen(false)}
        title={selectedUser ? "Update User Profile" : "Create New User Profile"}
        size="md"
      >
        <UserForm
          user={selectedUser}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* React Hot Toast Center */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "rounded-xl text-sm font-semibold text-slate-800 bg-white border border-slate-100 shadow-xl p-3.5",
          success: {
            duration: 3500,
            iconTheme: {
              primary: "#10b981", // Emerald 500
              secondary: "#fff"
            }
          },
          error: {
            duration: 4500,
            iconTheme: {
              primary: "#ef4444", // Red 500
              secondary: "#fff"
            }
          }
        }}
      />
    </div>
  );
}
