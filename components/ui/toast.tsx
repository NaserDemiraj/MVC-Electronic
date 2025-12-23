"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive"
  onClose?: () => void
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", onClose, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
          variant === "destructive" ? "border-red-500 bg-red-500 text-white" : "border-gray-200 bg-white text-gray-900",
          className,
        )}
        {...props}
      >
        <div className="flex-1">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className={cn(
              "absolute right-2 top-2 rounded-md p-1 text-gray-400 opacity-0 transition-opacity hover:text-gray-900 focus:opacity-100 focus:outline-none group-hover:opacity-100",
              variant === "destructive" ? "text-white hover:text-white" : "",
            )}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  },
)
Toast.displayName = "Toast"

export const ToastTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <h2 ref={ref} className={cn("text-sm font-semibold", className)} {...props} />,
)
ToastTitle.displayName = "ToastTitle"

export const ToastDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn("text-sm opacity-90", className)} {...props} />,
)
ToastDescription.displayName = "ToastDescription"
