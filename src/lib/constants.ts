// Site-wide constants — change here, updates everywhere.
// Never hardcode these values in components or API routes.

export const SITE_NAME = "RaYnk Labs";
export const SITE_DESCRIPTION =
  "Student-led tech innovation lab — services, projects, software, courses, and community.";
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// Pagination
export const ITEMS_PER_PAGE = 12;
export const ADMIN_ITEMS_PER_PAGE = 20;

// Rate limiting windows (ms)
export const RATE_LIMITS = {
  auth: { requests: 5, windowMs: 60_000 },       // 5 req/min on login
  adminApi: { requests: 120, windowMs: 60_000 }, // 120 req/min on admin API
  upload: { requests: 10, windowMs: 60_000 },    // 10 uploads/min
} as const;

// Admin roles (keep in sync with auth.prisma AdminRole enum)
export const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

// Admin statuses (keep in sync with auth.prisma AdminStatus enum)
export const ADMIN_STATUSES = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"] as const;
export type AdminStatus = (typeof ADMIN_STATUSES)[number];

// Image uploads
export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
