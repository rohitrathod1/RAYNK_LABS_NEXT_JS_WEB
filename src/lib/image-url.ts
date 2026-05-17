export const DEFAULT_IMAGE_PLACEHOLDER = "/api/uploads/placeholder.png";

export function resolveImageSrc(value: string | null | undefined): string {
  if (
    !value ||
    value === "placeholder.png" ||
    value === "/placeholder.png" ||
    value === "/default-logo.png" ||
    value === DEFAULT_IMAGE_PLACEHOLDER
  ) {
    return DEFAULT_IMAGE_PLACEHOLDER;
  }

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  if (!value.startsWith("/")) {
    return `/api/uploads/${encodeURIComponent(value)}`;
  }

  const [pathPart, queryPart] = value.split("?");
  const encoded = pathPart
    .split("/")
    .map((segment, index) => (index === 0 && segment === "" ? "" : encodeURIComponent(segment)))
    .join("/");

  return queryPart ? `${encoded}?${queryPart}` : encoded;
}
