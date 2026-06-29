import { z } from "zod";
import { DEPARTMENTS } from "./constants";

export const userFormSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be under 50 characters"),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be under 50 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  department: z
    .string()
    .min(1, "Department is required")
    .refine((val) => DEPARTMENTS.includes(val), {
      message: "Please select a valid department"
    })
});
