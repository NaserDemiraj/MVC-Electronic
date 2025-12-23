"use client"

import * as React from "react"

// Define toast types
export type Toast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

// Create a simple context for the toast system
type ToastContextType = {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

// Provider component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, ...toast }])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return <ToastContext.Provider value={{ toasts, addToast, removeToast }}>{children}</ToastContext.Provider>
}

// Hook to use the toast context
export function useToast() {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

// Create a global toast function
let addToastFunction: (toast: Omit<Toast, "id">) => void = () => {
  console.warn("Toast was called before ToastProvider was initialized")
}

// Export the toast function
export const toast = (props: Omit<Toast, "id">) => {
  addToastFunction(props)
}

// Initialize the toast function when the provider mounts
export function initializeToast(addToast: (toast: Omit<Toast, "id">) => void) {
  addToastFunction = addToast
}
