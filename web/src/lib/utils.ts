import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Format price in cents to currency string
 */
export function formatPrice(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100)
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(originalPrice: number, finalPrice: number): number {
  return Math.round(((originalPrice - finalPrice) / originalPrice) * 100)
}

/**
 * Debounce function for search input
 */
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Check if a string is a palindrome (client-side validation)
 */
export function isPalindrome(str: string): boolean {
  const normalized = str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]/g, '') // Remove non-alphanumeric

  return normalized.length >= 2 && normalized === normalized.split('').reverse().join('')
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Generate a unique key for React lists
 */
export function generateKey(prefix: string, ...parts: (string | number)[]): string {
  return `${prefix}-${parts.join('-')}`
}