import { resolveImageSrc } from "@/lib/image-url";

export function resolveHomeImageSrc(value: string | undefined | null): string {
  return resolveImageSrc(value);
}
