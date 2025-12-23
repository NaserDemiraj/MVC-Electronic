"use client"

import { useEffect } from "react"
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast"
import { useToast, initializeToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts, addToast, removeToast } = useToast()

  // Initialize the global toast function
  useEffect(() => {
    initializeToast(addToast)
  }, [addToast])

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <Toast key={toast.id} variant={toast.variant} onClose={() => removeToast(toast.id)} className="mb-2">
          <div className="grid gap-1">
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
          </div>
          {toast.action}
        </Toast>
      ))}
    </div>
  )
}
