"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Globe,
  Inbox,
  Loader2,
  Pencil,
  Plus,
  Save,
  Search,
  ShieldOff,
  Tags,
  Trash2,
} from "lucide-react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Switch,
} from "@/components/ui";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/common/image-upload";
import type { SeoFormData, SeoListItem } from "@/modules/seo/types";

function publicHref(pageKey: string): string {
  if (pageKey === "home") return "/";
  return `/${pageKey.replace(/-/g, "/")}`;
}

function pageLabel(pageKey: string): string {
  return pageKey.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

const EMPTY: SeoFormData = {
  page: "home",
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  ogImage: "",
  canonicalUrl: "",
  isIndexed: true,
};

const FALLBACK_ROWS: SeoListItem[] = [
  {
    id: "fallback-home",
    page: "home",
    metaTitle: "RaYnk Labs",
    metaDescription: "Your trusted partner in digital transformation.",
    keywords: ["raynk labs", "digital transformation"],
    ogImage: null,
    canonicalUrl: null,
    isIndexed: true,
    updatedAt: "",
  },
  {
    id: "fallback-about",
    page: "about",
    metaTitle: "About RaYnk Labs",
    metaDescription: "Learn more about RaYnk Labs and our work.",
    keywords: ["about", "raynk labs"],
    ogImage: null,
    canonicalUrl: null,
    isIndexed: true,
    updatedAt: "",
  },
  {
    id: "fallback-services",
    page: "services",
    metaTitle: "Services",
    metaDescription: "Explore services from RaYnk Labs.",
    keywords: ["services", "web development"],
    ogImage: null,
    canonicalUrl: null,
    isIndexed: true,
    updatedAt: "",
  },
];

const GRADIENTS = [
  "from-emerald-500/20 to-emerald-600/5",
  "from-sky-500/20 to-sky-600/5",
  "from-violet-500/20 to-violet-600/5",
  "from-amber-500/20 to-amber-600/5",
  "from-rose-500/20 to-rose-600/5",
  "from-indigo-500/20 to-indigo-600/5",
];

export default function AdminSeoPage() {
  const searchParams = useSearchParams();
  const [rows, setRows] = useState<SeoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<SeoListItem | null>(null);
  const [addOpen, setAddOpen] = useState(searchParams.get("mode") === "add");
  const [newPageKey, setNewPageKey] = useState("");
  const [deleting, setDeleting] = useState<SeoListItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<SeoFormData>({ defaultValues: EMPTY });

  const form = { ...EMPTY, ...useWatch({ control }) };
  const selectedPage = searchParams.get("page");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/seo", { cache: "no-store" });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error ?? "Failed to load SEO list");
        setRows(FALLBACK_ROWS);
        return;
      }
      setRows(data.data.length > 0 ? data.data : FALLBACK_ROWS);
    } catch {
      toast.error("Network error");
      setRows(FALLBACK_ROWS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(id);
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (row) =>
        row.page.toLowerCase().includes(q) ||
        row.metaTitle.toLowerCase().includes(q) ||
        row.metaDescription.toLowerCase().includes(q),
    );
  }, [query, rows]);

  const indexedCount = rows.filter((row) => row.isIndexed).length;
  const noIndexCount = rows.length - indexedCount;

  useEffect(() => {
    if (!selectedPage || rows.length === 0) return;

    const id = window.setTimeout(() => {
      const row = rows.find((item) => item.page === selectedPage);
      if (row) {
        const next = {
          page: row.page,
          metaTitle: row.metaTitle,
          metaDescription: row.metaDescription,
          keywords: row.keywords.join(", "),
          ogImage: row.ogImage ?? "",
          canonicalUrl: row.canonicalUrl ?? "",
          isIndexed: row.isIndexed,
        };
        reset(next);
        setEditing(row);
      }
    }, 0);

    return () => window.clearTimeout(id);
  }, [reset, rows, selectedPage]);

  function openEditor(row?: SeoListItem) {
    const next = row
      ? {
          page: row.page,
          metaTitle: row.metaTitle,
          metaDescription: row.metaDescription,
          keywords: row.keywords.join(", "),
          ogImage: row.ogImage ?? "",
          canonicalUrl: row.canonicalUrl ?? "",
          isIndexed: row.isIndexed,
        }
      : EMPTY;
    reset(next);
    setEditing(
      row ?? {
        id: "",
        page: next.page,
        metaTitle: next.metaTitle,
        metaDescription: next.metaDescription,
        keywords: [],
        ogImage: next.ogImage,
        canonicalUrl: next.canonicalUrl,
        isIndexed: next.isIndexed,
        updatedAt: "",
      },
    );
    setAddOpen(false);
  }

  async function saveSeo(values: SeoFormData) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error ?? "Failed to save SEO");
        return;
      }
      toast.success("SEO saved");
      setEditing(null);
      await load();
    } catch {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteSeo() {
    if (!deleting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: deleting.page }),
      });
      const data = await res.json();
      if (!data.success) {
        toast.error(data.error ?? "Delete failed");
        return;
      }
      toast.success("SEO removed");
      setDeleting(null);
      await load();
    } catch {
      toast.error("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl py-4 sm:py-8 2xl:max-w-7xl 2xl:py-10">
      <div className="mb-8 text-center sm:mb-10">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary sm:text-sm">
          SEO Manager
        </p>
        <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl 2xl:text-5xl">
          Search &amp; Social Metadata
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
          Manage how every page appears in Google, social previews, and rich-result search features.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard icon={Globe} label="Total Pages" value={rows.length} />
        <StatCard icon={CheckCircle2} label="Indexed" value={indexedCount} tone="text-primary" />
        <StatCard icon={AlertTriangle} label="No-Index" value={noIndexCount} />
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages..."
            className="rounded-xl pl-10"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          ) : null}
        </div>
        <Button onClick={() => setAddOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Page SEO
        </Button>
      </div>

      <div className="mb-5 flex items-center gap-2">
        <Globe className="h-4 w-4 text-primary" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Pages
        </h2>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-muted/20 py-16 text-center">
          <Inbox className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
          <p className="font-semibold text-muted-foreground">No SEO entries found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((row, index) => {
            const gradient = GRADIENTS[index % GRADIENTS.length];
            return (
              <div
                key={row.id}
                className="group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-lg"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                        {row.isIndexed ? (
                          <Globe className="h-5 w-5 text-primary" />
                        ) : (
                          <ShieldOff className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{pageLabel(row.page)}</h3>
                        <p className="text-xs text-muted-foreground">{row.page}</p>
                      </div>
                    </div>
                    <Badge variant={row.isIndexed ? "default" : "secondary"}>
                      {row.isIndexed ? "index,follow" : "noindex,follow"}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="line-clamp-2">
                      <span className="text-muted-foreground">Meta Title: </span>
                      {row.metaTitle}
                    </p>
                    <p className="line-clamp-3">
                      <span className="text-muted-foreground">Meta Description: </span>
                      {row.metaDescription}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditor(row)}>
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <a
                      href={publicHref(row.page)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-8 items-center justify-center gap-2 rounded-md px-3 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                      title="Preview page"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Preview
                    </a>
                    <Button size="sm" variant="ghost" onClick={() => setDeleting(row)} className="text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add SEO for a page</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="new-page">Page key</Label>
            <Input
              id="new-page"
              placeholder="home, services, blog"
              value={newPageKey}
              onChange={(event) => setNewPageKey(event.target.value.trim().toLowerCase())}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button
              onClick={() => {
                reset({ ...EMPTY, page: newPageKey || "home" });
                setEditing({ ...EMPTY, page: newPageKey || "home", id: "", keywords: [], updatedAt: "" });
                setAddOpen(false);
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit SEO" : "Add Page SEO"}</DialogTitle>
          </DialogHeader>
          <form id="seo-form" onSubmit={handleSubmit(saveSeo)} className="space-y-5">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border bg-card p-4">
                <Label htmlFor="page">Page</Label>
                <Input id="page" className="mt-2" {...register("page", { required: true })} />
              </div>
              <div className="rounded-xl border bg-card p-4">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input id="metaTitle" className="mt-2" {...register("metaTitle", { required: "Meta title is required" })} />
                {errors.metaTitle ? <p className="mt-2 text-xs text-destructive">{errors.metaTitle.message}</p> : null}
              </div>
              <div className="rounded-xl border bg-card p-4">
                <Label htmlFor="keywords">Keywords</Label>
                <div className="relative mt-2">
                  <Tags className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="keywords" className="pl-9" {...register("keywords")} placeholder="seo, web design" />
                </div>
              </div>
              <div className="rounded-xl border bg-card p-4 md:col-span-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea id="metaDescription" className="mt-2" rows={4} {...register("metaDescription", { required: "Meta description is required" })} />
                {errors.metaDescription ? <p className="mt-2 text-xs text-destructive">{errors.metaDescription.message}</p> : null}
              </div>
              <div className="rounded-xl border bg-card p-4">
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input id="canonicalUrl" className="mt-2" {...register("canonicalUrl")} />
              </div>
              <div className="flex items-center justify-between rounded-xl border bg-card p-4">
                <div>
                  <Label>Index status</Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {form.isIndexed ? "Indexed" : "No-Index"}
                  </p>
                </div>
                <Switch checked={form.isIndexed} onCheckedChange={(checked) => setValue("isIndexed", checked)} />
              </div>
              <div className="rounded-xl border bg-card p-4 lg:col-span-3">
                <Label>OG Image</Label>
                <div className="mt-2">
                  <ImageUpload value={form.ogImage} onChange={(value) => setValue("ogImage", value, { shouldDirty: true })} />
                </div>
              </div>
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <a
              href={publicHref(form.page)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition hover:border-primary/50 hover:bg-primary/10"
            >
              <ExternalLink className="h-4 w-4" />
              Preview
            </a>
            <Button
              type="submit"
              form="seo-form"
              variant="outline"
              disabled={submitting}
              className="h-9 rounded-lg bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete SEO for {deleting?.page}?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This page will fall back to default metadata.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>Cancel</Button>
            <Button variant="destructive" onClick={deleteSeo} disabled={submitting}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: ElementType;
  label: string;
  value: number;
  tone?: string;
}) {
  return (
    <div className="rounded-xl border bg-card px-4 py-3">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className={`mt-1 text-2xl font-bold ${tone ?? ""}`}>{value}</div>
    </div>
  );
}
