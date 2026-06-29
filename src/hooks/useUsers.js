import { useState, useEffect, useMemo, useCallback } from "react";
import * as userService from "../api/userService";
import { splitFullName, joinNames } from "../utils/helpers";
import { DEPARTMENTS } from "../utils/constants";
import { toast } from "react-hot-toast";

export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: ""
  });

  // Sorting State
  const [sorting, setSorting] = useState({
    field: "id",
    order: "asc" // 'asc' | 'desc'
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginationMode, setPaginationMode] = useState("numeric"); // 'numeric' | 'infinite'
  const [infiniteLimit, setInfiniteLimit] = useState(10);

  // Sync infinite limit reset when search, filter, sort, or page size changes
  useEffect(() => {
    setInfiniteLimit(pageSize);
  }, [pageSize, searchQuery, filters, sorting]);

  // Fetch users on mount
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await userService.getUsers();
      const mapped = response.data.map((user, index) => {
        const { firstName, lastName } = splitFullName(user.name);
        return {
          id: user.id,
          firstName,
          lastName,
          email: user.email,
          department: DEPARTMENTS[index % DEPARTMENTS.length]
        };
      });
      setUsers(mapped);
    } catch (err) {
      console.error(err);
      setError("Failed to load users. Please check your network connection.");
      toast.error("Failed to load users from the API.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Create (Add User)
  const addUser = useCallback(async (formData) => {
    try {
      // Find the next available local ID
      const maxId = users.length > 0 ? Math.max(...users.map((u) => u.id)) : 0;
      const nextId = maxId + 1;

      const newUserPayload = {
        name: joinNames(formData.firstName, formData.lastName),
        email: formData.email,
        // JSONPlaceholder won't know about department, but we pass it
        department: formData.department
      };

      // Call API
      const response = await userService.createUser(newUserPayload);
      
      // JSONPlaceholder always returns id 11 for new users, so we enforce our unique local ID
      const createdUser = {
        id: nextId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        department: formData.department
      };

      setUsers((prev) => [createdUser, ...prev]);
      toast.success("User added successfully!");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Failed to add user. Please try again.");
      return false;
    }
  }, [users]);

  // Update (Edit User)
  const editUser = useCallback(async (id, formData) => {
    try {
      const updatedUserPayload = {
        name: joinNames(formData.firstName, formData.lastName),
        email: formData.email,
        department: formData.department
      };

      // Since JSONPlaceholder only has IDs 1-10, any PUT request to ID > 10 will fail with a 404.
      // We simulate the API call for IDs > 10.
      if (id <= 10) {
        await userService.updateUser(id, updatedUserPayload);
      } else {
        // Simulate minor API latency
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? { ...u, firstName: formData.firstName, lastName: formData.lastName, email: formData.email, department: formData.department }
            : u
        )
      );
      toast.success("User updated successfully!");
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user. Please try again.");
      return false;
    }
  }, []);

  // Delete (Remove User)
  const removeUser = useCallback(async (id) => {
    try {
      // Similarly, simulate delete for local user IDs > 10
      if (id <= 10) {
        await userService.deleteUser(id);
      } else {
        // Simulate minor API latency
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted successfully.");
      
      // Adjust current page if the deletion left the current page empty
      // (Wait, we can let the UI or pagination handle this or adjust currentPage if needed)
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user. Please try again.");
      return false;
    }
  }, []);

  // Filter, Search, and Sort Memoizations
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // 1. Search Query (matches First Name, Last Name, Email, Department)
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.department.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // 2. Specific Field Filters
      const matchesFirstName =
        !filters.firstName ||
        user.firstName.toLowerCase().includes(filters.firstName.toLowerCase().trim());
      const matchesLastName =
        !filters.lastName ||
        user.lastName.toLowerCase().includes(filters.lastName.toLowerCase().trim());
      const matchesEmail =
        !filters.email ||
        user.email.toLowerCase().includes(filters.email.toLowerCase().trim());
      const matchesDepartment =
        !filters.department ||
        user.department === filters.department;

      return matchesFirstName && matchesLastName && matchesEmail && matchesDepartment;
    });
  }, [users, searchQuery, filters]);

  const sortedUsers = useMemo(() => {
    const { field, order } = sorting;
    if (!field) return filteredUsers;

    return [...filteredUsers].sort((a, b) => {
      let valA = a[field];
      let valB = b[field];

      // Convert to string for safety, or compare numbers directly for ID
      if (field === "id") {
        return order === "asc" ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase().trim();
      const strB = String(valB).toLowerCase().trim();

      if (order === "asc") {
        return strA.localeCompare(strB);
      } else {
        return strB.localeCompare(strA);
      }
    });
  }, [filteredUsers, sorting]);

  // Paginated subset
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedUsers.slice(startIndex, startIndex + pageSize);
  }, [sortedUsers, currentPage, pageSize]);

  // Unified visible subset based on paginationMode
  const visibleUsers = useMemo(() => {
    if (paginationMode === "numeric") {
      return paginatedUsers;
    } else {
      return sortedUsers.slice(0, infiniteLimit);
    }
  }, [paginationMode, paginatedUsers, sortedUsers, infiniteLimit]);

  // Load more for infinite scroll
  const loadMore = useCallback(() => {
    setInfiniteLimit((prev) => Math.min(prev + pageSize, sortedUsers.length));
  }, [pageSize, sortedUsers.length]);

  // Has more pages to load
  const hasMore = useMemo(() => {
    return infiniteLimit < sortedUsers.length;
  }, [infiniteLimit, sortedUsers.length]);

  // Total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(sortedUsers.length / pageSize));
  }, [sortedUsers, pageSize]);

  // If the sorted list changes and we are out of bounds of current page, reset to page 1
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const resetFilters = useCallback(() => {
    setFilters({
      firstName: "",
      lastName: "",
      email: "",
      department: ""
    });
    setSearchQuery("");
  }, []);

  return {
    users,
    filteredUsers,
    sortedUsers,
    paginatedUsers,
    visibleUsers,
    paginationMode,
    setPaginationMode,
    infiniteLimit,
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
    refreshUsers: fetchUsers,
    resetFilters
  };
}
