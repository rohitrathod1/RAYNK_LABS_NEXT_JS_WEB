"use client";

import { useMemo, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { DEFAULT_IMAGE_PLACEHOLDER, resolveImageSrc } from "@/lib/image-url";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = DEFAULT_IMAGE_PLACEHOLDER,
  className,
  ...props
}: ImageWithFallbackProps) {
  const resolvedSrc = useMemo(() => resolveImageSrc(String(src)), [src]);
  const resolvedFallback = useMemo(() => resolveImageSrc(fallbackSrc), [fallbackSrc]);
  const [imgSrc, setImgSrc] = useState(resolvedSrc);

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      className={cn(className)}
      onError={() => setImgSrc(resolvedFallback)}
    />
  );
}
