"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  Search,
  Image as ImageIcon,
  Globe,
  Clipboard,
  Check,
  RotateCcw,
} from "lucide-react";
import { ImageUpload } from "@/components/common/image-upload";
import { SeoPreview } from "./SeoPreview";
import type { SeoFormData, TwitterCard, RobotsDirective } from "../types";

interface SeoTabPanelProps {
  page: string;
  pageLabel?: string;
}

const EMPTY: SeoFormData = {
  title: "",
  description: "",
  keywords: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  twitterCard: "summary_large_image",
  canonicalUrl: "",
  robots: "index,follow",
};

function CopyBtn({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      title={copied ? "Copied!" : "Copy"}
      onClick={async () => {
        if (!value.trim()) return;
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      disabled={!value.trim()}
      className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-primary" />
      ) : (
        <Clipboard className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

function FieldLabel({
  htmlFor,
  label,
  hint,
  value,
}: {
  htmlFor: string;
  label: string;
  hint?: string;
  value?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
        {hint && <span className="ml-1 text-muted-foreground">{hint}</span>}
      </label>
      {value !== undefined && <CopyBtn value={value} />}
    </div>
  );
}

export function SeoTabPanel({ page, pageLabel }: SeoTabPanelProps) {
  const [form, setForm] = useState<SeoFormData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/seo/${encodeURIComponent(page)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.success && data.data) {
        const r = data.data;
        setForm({
          title: r.title ?? "",
          description: r.description ?? "",
          keywords: r.keywords ?? "",
          ogTitle: r.ogTitle ?? "",
          ogDescription: r.ogDescription ?? "",
          ogImage: r.ogImage ?? "",
          twitterCard: (r.twitterCard ?? "summary_large_image") as TwitterCard,
          canonicalUrl: r.canonicalUrl ?? "",
          robots: (r.robots ?? "index,follow") as RobotsDirective,
        });
      }
    } catch {
      toast.error("Failed to load SEO data");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Meta title is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/seo/${encodeURIComponent(page)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error ?? "Failed to save SEO");
        return;
      }
      toast.success("SEO saved", {
        description: "Refresh the public page to see the new metadata.",
      });
    } catch {
      toast.error("Network error — could not reach the server");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const titleLen = form.title.length;
  const descLen = form.description.length;

  return (
    <div className="space-y-6">
      {/* Panel header */}
      <div className="rounded-xl border border-dashed bg-muted/30 p-4">
        <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
          <Search className="h-3.5 w-3.5" />
          SEO Settings
        </div>
        <h3 className="text-base font-bold">{pageLabel ?? page} — Search &amp; Social Metadata</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Controls how this page appears in Google, social sharing cards, and rich search results.
          Empty fields fall back to module defaults, then site defaults.
        </p>
      </div>

      {/* Search section */}
      <section className="space-y-4 rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-bold uppercase tracking-wide">Search</h4>
        </div>

        <div className="space-y-1.5">
          <FieldLabel
            htmlFor="seo-title"
            label="Meta Title"
            hint={`(${titleLen}/70)`}
            value={form.title}
          />
          <input
            id="seo-title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            maxLength={70}
            placeholder="e.g. RaYnk Labs | Student-Led Tech Innovation Lab"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground">
            Blue link shown in Google results. Keep under 60 characters.
          </p>
        </div>

        <div className="space-y-1.5">
          <FieldLabel
            htmlFor="seo-desc"
            label="Meta Description"
            hint={`(${descLen}/180)`}
            value={form.description}
          />
          <textarea
            id="seo-desc"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            maxLength={180}
            rows={3}
            placeholder="A short description shown in Google search results."
            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground">Keep under 160 characters.</p>
        </div>

        <div className="space-y-1.5">
          <FieldLabel
            htmlFor="seo-keywords"
            label="Keywords (comma-separated)"
            value={form.keywords}
          />
          <input
            id="seo-keywords"
            value={form.keywords}
            onChange={(e) => setForm({ ...form, keywords: e.target.value })}
            placeholder="raynk labs, student tech lab, innovation"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground">
            Not a direct Google ranking signal, but used by some other search engines.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <FieldLabel
              htmlFor="seo-canonical"
              label="Canonical URL"
              value={form.canonicalUrl}
            />
            <input
              id="seo-canonical"
              value={form.canonicalUrl}
              onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })}
              placeholder="https://raynklabs.com/about"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground">Prevents duplicate content issues.</p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="seo-robots" className="block text-sm font-medium text-foreground">
              Robots
            </label>
            <select
              id="seo-robots"
              value={form.robots}
              onChange={(e) => setForm({ ...form, robots: e.target.value as RobotsDirective })}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="index,follow">Index + Follow (default)</option>
              <option value="index,nofollow">Index, no-follow</option>
              <option value="noindex,follow">No-index, follow</option>
              <option value="noindex,nofollow">No-index, no-follow</option>
            </select>
            <p className="text-xs text-muted-foreground">
              Controls whether Google indexes this page.
            </p>
          </div>
        </div>
      </section>

      {/* Social sharing section */}
      <section className="space-y-4 rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-bold uppercase tracking-wide">Social Sharing</h4>
        </div>

        <div className="space-y-1.5">
          <FieldLabel htmlFor="og-title" label="OG Title" value={form.ogTitle} />
          <input
            id="og-title"
            value={form.ogTitle}
            onChange={(e) => setForm({ ...form, ogTitle: e.target.value })}
            placeholder="Falls back to Meta Title"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground">
            Shown on WhatsApp, Facebook, Twitter links. Falls back to Meta Title.
          </p>
        </div>

        <div className="space-y-1.5">
          <FieldLabel htmlFor="og-desc" label="OG Description" value={form.ogDescription} />
          <textarea
            id="og-desc"
            value={form.ogDescription}
            onChange={(e) => setForm({ ...form, ogDescription: e.target.value })}
            placeholder="Falls back to Meta Description"
            rows={2}
            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <p className="text-xs text-muted-foreground">Falls back to Meta Description.</p>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">
            OG Image{" "}
            <span className="text-muted-foreground font-normal">(1200×630 recommended)</span>
          </label>
          <ImageUpload
            value={form.ogImage}
            onChange={(v) => setForm({ ...form, ogImage: v })}
          />
          <p className="text-xs text-muted-foreground">
            Image shown when sharing. Use 1200×630 px for best results.
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="twitter-card" className="block text-sm font-medium text-foreground">
            Twitter Card
          </label>
          <select
            id="twitter-card"
            value={form.twitterCard}
            onChange={(e) => setForm({ ...form, twitterCard: e.target.value as TwitterCard })}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="summary_large_image">Summary Large Image (recommended)</option>
            <option value="summary">Summary</option>
          </select>
          <p className="text-xs text-muted-foreground">
            Large image is recommended for most pages.
          </p>
        </div>
      </section>

      {/* Live preview */}
      <SeoPreview
        title={form.title}
        description={form.description}
        canonicalUrl={form.canonicalUrl}
        ogTitle={form.ogTitle}
        ogDescription={form.ogDescription}
        ogImage={form.ogImage}
      />

      {/* Sticky action bar */}
      <div className="sticky bottom-0 -mx-4 flex items-center justify-end gap-2 border-t bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
        <button
          type="button"
          onClick={() => { setForm(EMPTY); void load(); }}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium transition hover:bg-accent disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save SEO
        </button>
      </div>
    </div>
  );
}
