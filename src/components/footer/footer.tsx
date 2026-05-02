"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Mail, MapPin, Phone } from "lucide-react";
import { SafeImage } from "@/components/common/safe-image";
import { SITE_NAME } from "@/lib/constants";
import { fallbackFooterData, withFooterFallback } from "@/modules/footer/data/defaults";
import type { FooterData, FooterSettings } from "@/modules/footer/types";

async function fetchFooter(): Promise<FooterData> {
  const res = await fetch("/api/footer");
  if (!res.ok) throw new Error("Failed to fetch footer data");
  const payload = (await res.json()) as { data?: FooterData };
  return withFooterFallback(payload.data);
}

function isExternal(href: string) {
  return href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:") || href.startsWith("tel:");
}

export function Footer() {
  const { data, error } = useQuery({
    queryKey: ["footer"],
    queryFn: fetchFooter,
    initialData: fallbackFooterData,
  });

  if (error) {
    console.error("Failed to fetch footer data", error);
  }

  const footerData = withFooterFallback(data);
  const settings = (footerData.settings ?? fallbackFooterData.settings) as FooterSettings;
  const sections = footerData.sections.filter((section) => section.isActive);

  return (
    <footer className="mt-auto border-t border-white/10 bg-zinc-950 text-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-12 lg:py-16 2xl:max-w-screen-2xl 2xl:px-20">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.35fr)_minmax(0,2fr)] lg:gap-16">
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-3" aria-label={SITE_NAME}>
              <span className="relative flex h-11 w-36 items-center">
                <SafeImage
                  src={settings.logo || fallbackFooterData.settings?.logo || "/placeholder.png"}
                  alt={`${SITE_NAME} logo`}
                  fill
                  sizes="144px"
                  className="object-contain object-left"
                />
              </span>
            </Link>
            <p className="max-w-md text-sm leading-7 text-white/70 sm:text-base">
              {settings.description}
            </p>
            <div className="space-y-3 text-sm text-white/70">
              {settings.address ? (
                <p className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                  <span>{settings.address}</span>
                </p>
              ) : null}
              {settings.email ? (
                <a className="flex items-center gap-3 transition hover:text-white" href={`mailto:${settings.email}`}>
                  <Mail className="h-4 w-4 shrink-0 text-white" />
                  <span>{settings.email}</span>
                </a>
              ) : null}
              {settings.phone ? (
                <a className="flex items-center gap-3 transition hover:text-white" href={`tel:${settings.phone}`}>
                  <Phone className="h-4 w-4 shrink-0 text-white" />
                  <span>{settings.phone}</span>
                </a>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <div key={section.id} className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-white">
                  {section.title}
                </h2>
                <nav className="flex flex-col gap-3">
                  {section.links?.map((link) =>
                    isExternal(link.href) ? (
                      <a
                        key={link.id}
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-sm text-white/65 transition hover:text-white"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.id}
                        href={link.href || "/"}
                        className="text-sm text-white/65 transition hover:text-white"
                      >
                        {link.label}
                      </Link>
                    ),
                  )}
                </nav>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>{settings.copyright}</p>
          <p>Built by {SITE_NAME}</p>
        </div>
      </div>
    </footer>
  );
}
