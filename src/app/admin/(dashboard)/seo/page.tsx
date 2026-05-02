"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { ExternalLink, Image as ImageIcon, Loader2, Save, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/common/image-upload";
import { hasPermission } from "@/lib/permissions";
import { SeoPreview } from "@/modules/seo/components/SeoPreview";
import type { SeoFormData } from "@/modules/seo/types";

const SEO_PAGES = [
  { key: "home", label: "Home" },
  { key: "about", label: "About" },
  { key: "services", label: "Services" },
  { key: "portfolio", label: "Portfolio" },
  { key: "blog", label: "Blog" },
  { key: "team", label: "Team" },
  { key: "contact", label: "Contact" },
];

const emptyForm: SeoFormData = {
  page: "home",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  ogImage: "",
  canonicalUrl: "",
};

export default function SeoDashboardPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedPage, setSelectedPage] = useState("home");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<SeoFormData>({
    mode: "onChange",
    defaultValues: emptyForm,
  });

  const form = watch();
  const selectedLabel = useMemo(
    () => SEO_PAGES.find((page) => page.key === selectedPage)?.label ?? selectedPage,
    [selectedPage],
  );

  useEffect(() => {
    if (session && !hasPermission(session, "MANAGE_SEO")) {
      router.push("/admin");
    }
  }, [session, router]);

  useEffect(() => {
    let active = true;

    async function loadSeo() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/seo?page=${encodeURIComponent(selectedPage)}`, {
          cache: "no-store",
        });
        const payload = await res.json();
        if (!active) return;

        if (payload.success && payload.data) {
          reset({
            page: selectedPage,
            metaTitle: payload.data.metaTitle ?? "",
            metaDescription: payload.data.metaDescription ?? "",
            keywords: Array.isArray(payload.data.keywords)
              ? payload.data.keywords.join(", ")
              : payload.data.keywords ?? "",
            ogImage: payload.data.ogImage ?? "",
            canonicalUrl: payload.data.canonicalUrl ?? "",
          });
        } else {
          reset({ ...emptyForm, page: selectedPage });
        }
      } catch {
        toast.error("Failed to load SEO settings");
        reset({ ...emptyForm, page: selectedPage });
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadSeo();
    return () => {
      active = false;
    };
  }, [reset, selectedPage]);

  async function onSubmit(values: SeoFormData) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, page: selectedPage }),
      });
      const payload = await res.json();

      if (!payload.success) {
        toast.error(payload.error ?? "Failed to save SEO settings");
        return;
      }

      toast.success("SEO settings saved");
      reset({
        page: payload.data.page,
        metaTitle: payload.data.metaTitle,
        metaDescription: payload.data.metaDescription,
        keywords: payload.data.keywords.join(", "),
        ogImage: payload.data.ogImage ?? "",
        canonicalUrl: payload.data.canonicalUrl ?? "",
      });
    } catch {
      toast.error("Network error. Could not save SEO settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
            Admin SEO
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            SEO Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Control page titles, descriptions, keywords, OG images, and canonical URLs.
          </p>
        </div>
        <Button
          type="submit"
          form="seo-settings-form"
          variant="outline"
          disabled={saving || loading}
          className="h-10 rounded-lg border-blue-500/40 bg-blue-500 px-5 text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-blue-600"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)_360px]">
        <aside className="bg-black text-white p-4 rounded-lg">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-400">
            <Search className="h-4 w-4" />
            Pages
          </div>
          <div className="space-y-2">
            {SEO_PAGES.map((page) => (
              <button
                key={page.key}
                type="button"
                onClick={() => setSelectedPage(page.key)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition ${
                  selectedPage === page.key
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{page.label}</span>
                {selectedPage === page.key ? <Sparkles className="h-3.5 w-3.5" /> : null}
              </button>
            ))}
          </div>
        </aside>

        <form
          id="seo-settings-form"
          onSubmit={handleSubmit(onSubmit)}
          className="bg-black text-white p-8 rounded-lg"
        >
          {loading ? (
            <div className="flex min-h-[420px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col gap-1 border-b border-white/10 pb-5">
                <h2 className="text-xl font-bold">{selectedLabel} Page</h2>
                <p className="text-sm text-white/55">
                  Fields validate in real time. Keep titles and descriptions concise.
                </p>
              </div>

              <input type="hidden" {...register("page")} value={selectedPage} />

              <FormControl error={errors.metaTitle?.message}>
                <Label htmlFor="metaTitle" className="text-white">
                  Meta Title
                </Label>
                <Input
                  id="metaTitle"
                  {...register("metaTitle", {
                    required: "Meta title is required",
                    maxLength: { value: 70, message: "Keep under 70 characters" },
                  })}
                  className="mt-2 h-11 rounded-lg border-white/15 bg-white/5 text-white placeholder:text-white/35 focus-visible:ring-blue-500"
                  placeholder="RaYnk Labs | Build Better Digital Products"
                />
                <FieldHint value={`${form.metaTitle?.length ?? 0}/70`} />
              </FormControl>

              <FormControl error={errors.metaDescription?.message}>
                <Label htmlFor="metaDescription" className="text-white">
                  Meta Description
                </Label>
                <Textarea
                  id="metaDescription"
                  {...register("metaDescription", {
                    required: "Meta description is required",
                    maxLength: { value: 180, message: "Keep under 180 characters" },
                  })}
                  rows={4}
                  className="mt-2 rounded-lg border-white/15 bg-white/5 text-white placeholder:text-white/35 focus-visible:ring-blue-500"
                  placeholder="Write the search result description for this page."
                />
                <FieldHint value={`${form.metaDescription?.length ?? 0}/180`} />
              </FormControl>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormControl error={errors.keywords?.message}>
                  <Label htmlFor="keywords" className="text-white">
                    Keywords
                  </Label>
                  <Input
                    id="keywords"
                    {...register("keywords")}
                    className="mt-2 h-11 rounded-lg border-white/15 bg-white/5 text-white placeholder:text-white/35 focus-visible:ring-blue-500"
                    placeholder="seo, web design, raynk labs"
                  />
                  <FieldHint value="Separate with commas" />
                </FormControl>

                <FormControl error={errors.canonicalUrl?.message}>
                  <Label htmlFor="canonicalUrl" className="text-white">
                    Canonical URL
                  </Label>
                  <Input
                    id="canonicalUrl"
                    {...register("canonicalUrl")}
                    className="mt-2 h-11 rounded-lg border-white/15 bg-white/5 text-white placeholder:text-white/35 focus-visible:ring-blue-500"
                    placeholder="https://raynklabs.com/services"
                  />
                  <FieldHint value="Optional" />
                </FormControl>
              </div>

              <FormControl>
                <div className="mb-2 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-blue-400" />
                  <Label className="text-white">OG Image</Label>
                </div>
                <ImageUpload
                  value={form.ogImage}
                  onChange={(value) => setValue("ogImage", value, { shouldDirty: true })}
                />
                <FieldHint value="Recommended size: 1200 x 630" />
              </FormControl>

              <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <a
                  href={`/${selectedPage === "home" ? "" : selectedPage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white"
                >
                  <ExternalLink className="h-4 w-4" />
                  Preview public page
                </a>
                <Button
                  type="submit"
                  variant="outline"
                  disabled={saving || loading}
                  className="h-9 rounded-lg bg-blue-500 px-5 text-white hover:bg-blue-600 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {isDirty ? "Save Changes" : "Saved"}
                </Button>
              </div>
            </div>
          )}
        </form>

        <div className="space-y-4">
          <div className="bg-black text-white p-5 rounded-lg">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Live Status
            </p>
            <h3 className="mt-2 text-lg font-bold">{selectedLabel}</h3>
            <p className="mt-1 text-sm text-white/55">
              API: <span className="text-white">/api/seo?page={selectedPage}</span>
            </p>
          </div>
          <SeoPreview
            title={form.metaTitle}
            description={form.metaDescription}
            canonicalUrl={form.canonicalUrl}
            ogTitle={form.metaTitle}
            ogDescription={form.metaDescription}
            ogImage={form.ogImage}
          />
        </div>
      </div>
    </div>
  );
}

function FormControl({
  children,
  error,
}: {
  children: ReactNode;
  error?: string;
}) {
  return (
    <div>
      {children}
      {error ? <p className="mt-1.5 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

function FieldHint({ value }: { value: string }) {
  return <p className="mt-1.5 text-xs text-white/45">{value}</p>;
}
