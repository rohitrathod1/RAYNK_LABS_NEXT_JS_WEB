import { resolveImageSrc } from "@/lib/image-url";

export function resolveAboutImageSrc(value: string | undefined | null): string {
  return resolveImageSrc(value);
}
