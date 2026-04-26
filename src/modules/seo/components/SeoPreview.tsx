"use client";

import { useMemo, useState, useEffect } from "react";
import NextImage from "next/image";
import { Image as ImageIcon, Search, MessageCircle } from "lucide-react";
import { SITE_URL } from "@/lib/constants";

interface SeoPreviewProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

function truncate(str: string, max: number): string {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "…" : str;
}

function resolveImageSrc(value: string): string {
  if (!value) return "";
  if (value.startsWith("http") || value.startsWith("/")) return value;
  return `/api/uploads/${encodeURIComponent(value)}`;
}

function sanitizeCanonical(url: string): string {
  if (!url) return SITE_URL;
  if (url.includes("localhost") || url.includes("127.0.0.1")) return SITE_URL;
  return url;
}

function extractDomain(url: string): string {
  const safe = sanitizeCanonical(url);
  try {
    return new URL(safe).hostname.replace(/^www\./, "");
  } catch {
    return safe.replace(/^https?:\/\/(www\.)?/, "").split("/")[0] ?? "raynklabs.com";
  }
}

function resolveDisplayUrl(canonical: string): string {
  const safe = sanitizeCanonical(canonical);
  try {
    const u = new URL(safe);
    return u.origin + u.pathname;
  } catch {
    return safe;
  }
}

export function SeoPreview({
  title,
  description,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
}: SeoPreviewProps) {
  const resolvedSrc = useMemo(() => resolveImageSrc(ogImage), [ogImage]);
  const [imgError, setImgError] = useState(false);
  useEffect(() => setImgError(false), [resolvedSrc]);

  const isLocalSrc = resolvedSrc.startsWith("/");

  const googleTitle = useMemo(() => truncate(title || "Page Title", 60), [title]);
  const googleUrl = useMemo(() => resolveDisplayUrl(canonicalUrl), [canonicalUrl]);
  const googleDesc = useMemo(
    () => truncate(description || "No description provided.", 160),
    [description],
  );
  const socialTitle = useMemo(
    () => truncate(ogTitle || title || "Page Title", 70),
    [ogTitle, title],
  );
  const socialDesc = useMemo(
    () => truncate(ogDescription || description || "", 120),
    [ogDescription, description],
  );
  const socialDomain = useMemo(() => extractDomain(canonicalUrl), [canonicalUrl]);

  const showImage = Boolean(resolvedSrc) && !imgError;

  return (
    <div className="space-y-4 rounded-xl border bg-muted/20 p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Live Preview
      </p>

      {/* Google SERP preview */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Search className="h-3 w-3" />
          <span>Google Search Result</span>
        </div>
        <div className="rounded-xl border bg-card px-5 py-4 shadow-sm">
          <p className="text-base font-medium leading-snug" style={{ color: "#1a0dab" }}>
            {googleTitle || <span className="italic text-muted-foreground">No title</span>}
          </p>
          <p className="mt-0.5 text-[13px] leading-tight" style={{ color: "#006621" }}>
            {googleUrl}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
            {googleDesc || <span className="italic">No description</span>}
          </p>
        </div>
      </div>

      {/* WhatsApp / Social card preview */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MessageCircle className="h-3 w-3" />
          <span>WhatsApp / Social Card</span>
        </div>
        <div className="flex justify-start rounded-xl bg-muted/30 p-4">
          <div className="w-full max-w-[320px] overflow-hidden rounded-lg border bg-card shadow-md">
            <div className="relative aspect-video w-full">
              {showImage ? (
                isLocalSrc ? (
                  <NextImage
                    key={resolvedSrc}
                    src={resolvedSrc}
                    alt={socialTitle}
                    fill
                    sizes="320px"
                    className="object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={resolvedSrc}
                    src={resolvedSrc}
                    alt={socialTitle}
                    className="h-full w-full object-cover"
                    onError={() => setImgError(true)}
                  />
                )
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted/60">
                  <div className="text-center text-muted-foreground/40">
                    <ImageIcon className="mx-auto mb-1.5 h-8 w-8" />
                    <p className="text-[11px]">
                      {resolvedSrc && imgError ? "Image failed to load" : "No OG image"}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="border-t bg-muted/20 px-3 py-2.5">
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                {socialDomain}
              </p>
              <p className="mt-0.5 line-clamp-2 text-[13px] font-semibold leading-snug text-foreground">
                {socialTitle || <span className="italic text-muted-foreground">No title</span>}
              </p>
              {socialDesc && (
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                  {socialDesc}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
