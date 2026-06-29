import React, { Fragment } from "react";
import { Dialog, Transition, DialogTitle, DialogPanel, TransitionChild } from "@headlessui/react";
import { X } from "lucide-react";
import { cn } from "../../utils/helpers";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md"
}) {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        {/* Scrollable Container */}
        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <DialogPanel
                className={cn(
                  "relative transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-2xl transition-all border border-slate-100 w-full",
                  sizeClasses[size]
                )}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <DialogTitle className="text-lg font-semibold text-slate-900">
                    {title}
                  </DialogTitle>
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 cursor-pointer"
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="relative">{children}</div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>

      </Dialog>
    </Transition>
  );
}
