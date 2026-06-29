import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema } from "../../utils/validators";
import { DEPARTMENTS } from "../../utils/constants";
import { cn } from "../../utils/helpers";
import { Loader2, Save } from "lucide-react";

export default function UserForm({
  user, // If defined, we are editing
  onSubmit, // Callback(formData) -> Promise<boolean>
  onCancel,
  isSubmitting
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      department: ""
    }
  });

  // Pre-fill form when in edit mode
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        department: user.department || ""
      });
    } else {
      reset({
        firstName: "",
        lastName: "",
        email: "",
        department: ""
      });
    }
  }, [user, reset]);

  const handleFormSubmit = async (data) => {
    const success = await onSubmit(data);
    if (success) {
      reset(); // Reset form fields on success
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      
      {/* Name Inputs Container (Grid) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* First Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            First Name
          </label>
          <input
            type="text"
            placeholder="e.g. Sarah"
            {...register("firstName")}
            className={cn(
              "block w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all",
              errors.firstName
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-200 focus:border-primary-500 focus:ring-primary-500/20"
            )}
          />
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {errors.firstName.message}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Last Name
          </label>
          <input
            type="text"
            placeholder="e.g. Connor"
            {...register("lastName")}
            className={cn(
              "block w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all",
              errors.lastName
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-200 focus:border-primary-500 focus:ring-primary-500/20"
            )}
          />
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      {/* Email Address */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
          Email Address
        </label>
        <input
          type="email"
          placeholder="e.g. sarah.connor@sky.net"
          {...register("email")}
          className={cn(
            "block w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-sm placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 transition-all",
            errors.email
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
              : "border-slate-200 focus:border-primary-500 focus:ring-primary-500/20"
          )}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500 font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Department Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
          Department
        </label>
        <select
          {...register("department")}
          className={cn(
            "block w-full rounded-xl border bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 transition-all cursor-pointer",
            errors.department
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
              : "border-slate-200 focus:border-primary-500 focus:ring-primary-500/20"
          )}
        >
          <option value="" disabled>Select a department</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
        {errors.department && (
          <p className="mt-1 text-xs text-red-500 font-medium">
            {errors.department.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-150 mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl active:scale-97 disabled:opacity-50 transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md shadow-primary-500/10 active:scale-97 disabled:opacity-50 transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

    </form>
  );
}
