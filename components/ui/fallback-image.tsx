"use client"

import { useState } from "react"

interface FallbackImageProps {
  src: string
  alt: string
  fallbackSrc: string
  className?: string
}

// Default product placeholder using a data URI for a simple electronics icon
const DEFAULT_PRODUCT_PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect fill='%23f3f4f6' width='300' height='300'/%3E%3Cg transform='translate(75,75)'%3E%3Crect fill='%239ca3af' x='25' y='20' width='100' height='70' rx='5'/%3E%3Crect fill='%236b7280' x='35' y='30' width='80' height='50' rx='3'/%3E%3Ccircle fill='%23d1d5db' cx='75' cy='55' r='15'/%3E%3Crect fill='%239ca3af' x='10' y='100' width='20' height='30'/%3E%3Crect fill='%239ca3af' x='40' y='100' width='20' height='30'/%3E%3Crect fill='%239ca3af' x='70' y='100' width='20' height='30'/%3E%3Crect fill='%239ca3af' x='100' y='100' width='20' height='30'/%3E%3C/g%3E%3C/svg%3E"

export function FallbackImage({ src, alt, fallbackSrc, className }: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      // Try fallbackSrc first, then use default placeholder
      setImgSrc(fallbackSrc || DEFAULT_PRODUCT_PLACEHOLDER)
    } else {
      // If fallbackSrc also fails, use default placeholder
      setImgSrc(DEFAULT_PRODUCT_PLACEHOLDER)
    }
  }

  return (
    <img 
      src={imgSrc || DEFAULT_PRODUCT_PLACEHOLDER} 
      alt={alt} 
      className={className} 
      onError={handleError}
    />
  )
}
