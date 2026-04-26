// cn() — merge Tailwind classes correctly (handles conflicts like "p-2 p-4" → "p-4")
// Use this for ALL conditional class merging throughout the project.

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
