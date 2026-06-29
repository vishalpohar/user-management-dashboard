import axios from "axios";
import { API_URL } from "../utils/constants";

// Create an axios instance with a timeout of 10 seconds
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

/**
 * Fetches all users from JSONPlaceholder.
 */
export const getUsers = () => {
  return apiClient.get(API_URL);
};

/**
 * Creates a new user record.
 * (Note: Simulated by JSONPlaceholder).
 */
export const createUser = (userData) => {
  return apiClient.post(API_URL, userData);
};

/**
 * Updates an existing user record.
 * (Note: Simulated by JSONPlaceholder).
 */
export const updateUser = (id, userData) => {
  return apiClient.put(`${API_URL}/${id}`, userData);
};

/**
 * Deletes a user record by ID.
 * (Note: Simulated by JSONPlaceholder).
 */
export const deleteUser = (id) => {
  return apiClient.delete(`${API_URL}/${id}`);
};
