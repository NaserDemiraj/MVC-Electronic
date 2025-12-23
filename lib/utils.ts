import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined) return "$0.00"

  // Convert to number if it's a string
  const numericPrice = typeof price === "string" ? Number.parseFloat(price) : price

  // Check if it's a valid number
  if (isNaN(numericPrice)) return "$0.00"

  // Format the price with 2 decimal places
  return `$${numericPrice.toFixed(2)}`
}
