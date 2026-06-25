import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";

export function cn(...inputs: Array<ClassValue>) {
  return twMerge(clsx(inputs));
}

/**
 * Format number to Indonesian Rupiah format with thousand separators (dots)
 * Example: 1000000 -> "1.000.000"
 */
export function formatRupiah(value: string | number): string {
  const num = typeof value === "string" ? value : value.toString();
  // Remove any existing dots and non-numeric characters
  const clean = num.replace(/[^\d]/g, "");
  if (!clean) return "";
  // Add dots every 3 digits from the right
  return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Remove thousand separators to get plain number
 * Example: "1.000.000" -> "1000000"
 */
export function parseRupiah(value: string): number {
  const clean = value.replace(/\./g, "");
  return parseFloat(clean) || 0;
}
