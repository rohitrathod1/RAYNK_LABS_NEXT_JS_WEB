export const DEFAULT_IMAGE_PLACEHOLDER = "/api/uploads/placeholder.png";

export function resolveImageSrc(value: string | null | undefined): string {
  if (
    !value ||
    value === "placeholder.png" ||
    value === "/placeholder.png" ||
    value === "/default-logo.png"
  ) {
    return DEFAULT_IMAGE_PLACEHOLDER;
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:") ||
    value.startsWith("/")
  ) {
    return value;
  }

  return `/api/uploads/${encodeURIComponent(value)}`;
}

