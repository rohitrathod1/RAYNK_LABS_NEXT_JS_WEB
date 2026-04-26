"use client";

import { useState } from "react";
import { ChevronDown, BookOpen } from "lucide-react";

const SECTIONS = [
  {
    title: "Meta Title",
    color: "text-emerald-400",
    items: [
      "Shown as the blue link in Google search results.",
      "Keep under 60 characters — Google cuts off longer titles.",
      "Include your main keyword near the start.",
      "Example: RaYnk Labs | Student Tech Innovation Lab",
    ],
  },
  {
    title: "Meta Description",
    color: "text-sky-400",
    items: [
      "The snippet shown below the link in Google results.",
      "Keep under 160 characters.",
      "Write it like a short ad — explain what the page is about and why to click.",
      "Google may ignore it and generate its own, but it's still worth setting.",
    ],
  },
  {
    title: "Keywords",
    color: "text-amber-400",
    items: [
      "Comma-separated words that describe the page.",
      "Not a direct Google ranking signal, but used by some other search engines.",
      "Example: raynk labs, student tech lab, software development",
    ],
  },
  {
    title: "OG Title & Description",
    color: "text-violet-400",
    items: [
      "Title and description shown when sharing on WhatsApp, LinkedIn, Facebook, Twitter.",
      "Falls back to Meta Title / Meta Description if left empty.",
      "Can be different from the search title — make it more social/engaging.",
    ],
  },
  {
    title: "OG Image",
    color: "text-rose-400",
    items: [
      "Image shown in social sharing cards (WhatsApp, Slack, Facebook).",
      "Recommended size: 1200×630 px (16:9 ratio).",
      "Use a clear, visually striking image — it directly affects click-through rate.",
      "Stored as a bare filename uploaded via the upload system.",
    ],
  },
  {
    title: "Twitter Card",
    color: "text-cyan-400",
    items: [
      "Summary Large Image: shows a big image thumbnail on Twitter/X — recommended.",
      "Summary: shows only a small icon thumbnail.",
      "Use Large Image for all public-facing pages.",
    ],
  },
  {
    title: "Canonical URL",
    color: "text-orange-400",
    items: [
      "The official URL for this page.",
      "Prevents duplicate content penalties when a page is accessible from multiple URLs.",
      "Usually the full production URL: https://raynklabs.com/about",
      "Leave empty for most pages — Next.js sets it automatically.",
    ],
  },
  {
    title: "Robots",
    color: "text-fuchsia-400",
    items: [
      "Index + Follow: Google indexes this page and follows its links. (Default, use for all public pages.)",
      "No-index, Follow: Page won't appear in Google but its links will be crawled.",
      "No-index, No-follow: Completely hidden from Google. Use for admin pages and staging.",
      "Never set no-index on your homepage or key content pages.",
    ],
  },
];

export function SeoGuide() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/30"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold">SEO Guide for All Pages</p>
            <p className="text-xs text-muted-foreground">Simple explanations for every field</p>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t px-5 py-6 sm:px-8">
          <h2 className="mb-6 text-lg font-bold text-primary">
            SEO Fields — What Each One Does
          </h2>
          <div className="space-y-6">
            {SECTIONS.map((section) => (
              <div key={section.title} className="space-y-2">
                <h3
                  className={`border-l-2 border-primary/60 pl-3 text-sm font-bold ${section.color}`}
                >
                  {section.title}
                </h3>
                <ul className="space-y-1.5 pl-4">
                  {section.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="text-sm font-bold text-amber-400">Fallback Chain</p>
            <p className="mt-1 text-sm text-muted-foreground">
              If no DB row exists for a page, the module&apos;s{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-primary">
                defaultSeo
              </code>{" "}
              is used. If that is also empty, the site-wide fallback in{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-primary">
                src/lib/seo.ts
              </code>{" "}
              is the last resort.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
