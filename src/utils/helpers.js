import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines tailwind classes safely using clsx and tailwind-merge.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Splits a full name string into first and last names.
 * Extracts the first word as the first name, and the rest as the last name.
 */
export function splitFullName(fullName = "") {
  if (!fullName) return { firstName: "", lastName: "" };
  const trimmed = fullName.trim();
  const index = trimmed.indexOf(" ");
  if (index === -1) {
    return { firstName: trimmed, lastName: "" };
  }
  return {
    firstName: trimmed.substring(0, index),
    lastName: trimmed.substring(index + 1).trim()
  };
}

/**
 * Combines first and last name into a clean full name.
 */
export function joinNames(firstName = "", lastName = "") {
  return `${firstName} ${lastName}`.trim();
}

/**
 * Gets the initials from a user's first and last name.
 */
export function getInitials(firstName = "", lastName = "") {
  const f = firstName.trim().charAt(0).toUpperCase();
  const l = lastName.trim().charAt(0).toUpperCase();
  return `${f}${l}` || "?";
}

/**
 * Deterministically maps an ID or name to an avatar background color preset.
 */
export function getAvatarColor(id = 0) {
  const colors = [
    "from-blue-400 to-indigo-500",
    "from-purple-400 to-violet-500",
    "from-emerald-400 to-teal-500",
    "from-pink-400 to-rose-500",
    "from-amber-400 to-orange-500",
    "from-cyan-400 to-blue-500"
  ];
  return colors[id % colors.length];
}
