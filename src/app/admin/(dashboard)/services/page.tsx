"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { hasPermission } from "@/lib/permissions";
import { toast } from "sonner";
import { ImageUpload } from "@/components/common/image-upload";
import {
  updateServicesHero,
  updateServicesCategories,
  updateServicesList,
  updateServicesWhyChoose,
  updateServicesProcess,
  updateServicesCta,
  updateServicesSeo,
} from "@/modules/services/actions";
import type { ServicesPageData, Category, ServiceCard, WhyChoosePoint, ProcessStep } from "@/modules/services/types";
import { defaultServicesContent } from "@/modules/services/data/defaults";

const TABS = ["hero", "categories", "services_list", "why_choose_service", "process", "contact_cta", "seo"] as const;
type Tab = (typeof TABS)[number];

type FormData = ServicesPageData & {
  seo: { title: string; description: string; keywords: string; ogImage: string; noIndex: boolean };
};

export default function ServicesPageManager() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session && !hasPermission(session, "MANAGE_SERVICES")) {
      router.push("/admin");
    }
  }, [session, router]);

  const [activeTab, setActiveTab] = useState<Tab>("hero");
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetch("/api/admin/services")
      .then((r) => r.json())
      .then(({ data }: { data: Partial<FormData> }) => {
        setFormData({
          hero: { ...defaultServicesContent.hero, ...(data?.hero ?? {}) },
          categories: data?.categories ?? defaultServicesContent.categories,
          services_list: { ...defaultServicesContent.services_list, ...(data?.services_list ?? {}) },
          why_choose_service: { ...defaultServicesContent.why_choose_service, ...(data?.why_choose_service ?? {}) },
          process: { ...defaultServicesContent.process, ...(data?.process ?? {}) },
          contact_cta: { ...defaultServicesContent.contact_cta, ...(data?.contact_cta ?? {}) },
          seo: {
            title: "",
            description: "",
            keywords: "",
            ogImage: "",
            noIndex: false,
            ...((data as Partial<FormData>)?.seo ?? {}),
          },
        });
        setLoadingData(false);
      })
      .catch(() => {
        setLoadingData(false);
        toast.error("Failed to load page data");
      });
  }, []);

  function update<K extends keyof FormData>(section: K, patch: Partial<FormData[K]>) {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as object), ...patch },
    }));
  }

  async function handleSave() {
    setLoading(true);
    type ActionFn = (d: unknown) => Promise<{ success: boolean; error?: string }>;
    const actionMap: Record<Tab, ActionFn> = {
      hero: (d) => updateServicesHero(d),
      categories: (d) => updateServicesCategories(d),
      services_list: (d) => updateServicesList(d),
      why_choose_service: (d) => updateServicesWhyChoose(d),
      process: (d) => updateServicesProcess(d),
      contact_cta: (d) => updateServicesCta(d),
      seo: (d) => updateServicesSeo(d),
    };
    const result = await actionMap[activeTab]?.(formData[activeTab]);
    if (result?.success) toast.success("Saved successfully!");
    else toast.error(result?.error ?? "Failed to save");
    setLoading(false);
  }

  const hero = formData.hero ?? defaultServicesContent.hero;
  const categories = formData.categories ?? defaultServicesContent.categories;
  const servicesList = formData.services_list ?? defaultServicesContent.services_list;
  const whyChoose = formData.why_choose_service ?? defaultServicesContent.why_choose_service;
  const process = formData.process ?? defaultServicesContent.process;
  const cta = formData.contact_cta ?? defaultServicesContent.contact_cta;
  const seo = (formData as Partial<FormData>).seo ?? {
    title: "",
    description: "",
    keywords: "",
    ogImage: "",
    noIndex: false,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Services Page Manager</h1>
          <p className="text-muted-foreground mt-1">Manage all services page sections and SEO</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading || loadingData}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground rounded-lg font-medium transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>

      <div className="border rounded-lg bg-card">
        <div className="flex overflow-x-auto border-b">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium transition-colors whitespace-nowrap text-sm ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        <div className="p-6">
          {loadingData ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* HERO TAB */}
              {activeTab === "hero" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Title *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={hero.title}
                      onChange={(e) => update("hero", { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                    <textarea
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                      rows={3}
                      value={hero.subtitle}
                      onChange={(e) => update("hero", { subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Background Image</label>
                    <ImageUpload
                      value={hero.backgroundImage}
                      onChange={(v) => update("hero", { backgroundImage: v })}
                    />
                  </div>
                </div>
              )}

              {/* CATEGORIES TAB */}
              {activeTab === "categories" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium">Categories</label>
                    <button
                      type="button"
                      onClick={() =>
                        update("categories", [
                          ...categories,
                          { id: `cat-${Date.now()}`, name: "", icon: "" },
                        ])
                      }
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Category
                    </button>
                  </div>
                  <div className="space-y-3">
                    {categories.map((cat: Category, i: number) => (
                      <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Category {i + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              update("categories", categories.filter((_, j) => j !== i))
                            }
                            className="text-destructive hover:text-destructive/70"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium mb-1">ID *</label>
                            <input
                              className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                              value={cat.id}
                              onChange={(e) => {
                                const updated = [...categories];
                                updated[i] = { ...updated[i], id: e.target.value };
                                update("categories", updated);
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Name *</label>
                            <input
                              className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                              value={cat.name}
                              onChange={(e) => {
                                const updated = [...categories];
                                updated[i] = { ...updated[i], name: e.target.value };
                                update("categories", updated);
                              }}
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-medium mb-1">Icon (Lucide name)</label>
                            <input
                              className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                              placeholder="Globe, BarChart3, Palette..."
                              value={cat.icon}
                              onChange={(e) => {
                                const updated = [...categories];
                                updated[i] = { ...updated[i], icon: e.target.value };
                                update("categories", updated);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SERVICES LIST TAB */}
              {activeTab === "services_list" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Section Title *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={servicesList.title}
                      onChange={(e) => update("services_list", { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={servicesList.subtitle}
                      onChange={(e) => update("services_list", { subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Services</label>
                      <button
                        type="button"
                        onClick={() =>
                          update("services_list", {
                            ...servicesList,
                            services: [
                              ...servicesList.services,
                              { icon: "", title: "", description: "", category: "", ctaText: "Learn More", ctaHref: "/contact" },
                            ],
                          })
                        }
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Service
                      </button>
                    </div>
                    <div className="space-y-6">
                      {servicesList.services.map((s: ServiceCard, i: number) => (
                        <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Service {i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = servicesList.services.filter((_, j) => j !== i);
                                update("services_list", { ...servicesList, services: updated });
                              }}
                              className="text-destructive hover:text-destructive/70"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium mb-1">Icon *</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                placeholder="Code, Globe, Palette..."
                                value={s.icon}
                                onChange={(e) => {
                                  const updated = [...servicesList.services];
                                  updated[i] = { ...updated[i], icon: e.target.value };
                                  update("services_list", { ...servicesList, services: updated });
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Category ID *</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                placeholder="web-design, seo, graphic-design..."
                                value={s.category}
                                onChange={(e) => {
                                  const updated = [...servicesList.services];
                                  updated[i] = { ...updated[i], category: e.target.value };
                                  update("services_list", { ...servicesList, services: updated });
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Title *</label>
                            <input
                              className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                              value={s.title}
                              onChange={(e) => {
                                const updated = [...servicesList.services];
                                updated[i] = { ...updated[i], title: e.target.value };
                                update("services_list", { ...servicesList, services: updated });
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Description *</label>
                            <textarea
                              className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm resize-none"
                              rows={2}
                              value={s.description}
                              onChange={(e) => {
                                const updated = [...servicesList.services];
                                updated[i] = { ...updated[i], description: e.target.value };
                                update("services_list", { ...servicesList, services: updated });
                              }}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium mb-1">CTA Text</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                value={s.ctaText}
                                onChange={(e) => {
                                  const updated = [...servicesList.services];
                                  updated[i] = { ...updated[i], ctaText: e.target.value };
                                  update("services_list", { ...servicesList, services: updated });
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">CTA Link</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                value={s.ctaHref}
                                onChange={(e) => {
                                  const updated = [...servicesList.services];
                                  updated[i] = { ...updated[i], ctaHref: e.target.value };
                                  update("services_list", { ...servicesList, services: updated });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* WHY CHOOSE TAB */}
              {activeTab === "why_choose_service" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Section Title *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={whyChoose.title}
                      onChange={(e) => update("why_choose_service", { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={whyChoose.subtitle}
                      onChange={(e) => update("why_choose_service", { subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Points</label>
                      <button
                        type="button"
                        onClick={() =>
                          update("why_choose_service", {
                            ...whyChoose,
                            points: [...whyChoose.points, { icon: "", title: "", description: "" }],
                          })
                        }
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Point
                      </button>
                    </div>
                    <div className="space-y-4">
                      {whyChoose.points.map((p: WhyChoosePoint, i: number) => (
                        <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Point {i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = whyChoose.points.filter((_, j) => j !== i);
                                update("why_choose_service", { ...whyChoose, points: updated });
                              }}
                              className="text-destructive hover:text-destructive/70"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium mb-1">Icon *</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                placeholder="Zap, Award, Users..."
                                value={p.icon}
                                onChange={(e) => {
                                  const updated = [...whyChoose.points];
                                  updated[i] = { ...updated[i], icon: e.target.value };
                                  update("why_choose_service", { ...whyChoose, points: updated });
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Title *</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                value={p.title}
                                onChange={(e) => {
                                  const updated = [...whyChoose.points];
                                  updated[i] = { ...updated[i], title: e.target.value };
                                  update("why_choose_service", { ...whyChoose, points: updated });
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Description *</label>
                            <textarea
                              className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm resize-none"
                              rows={2}
                              value={p.description}
                              onChange={(e) => {
                                const updated = [...whyChoose.points];
                                updated[i] = { ...updated[i], description: e.target.value };
                                update("why_choose_service", { ...whyChoose, points: updated });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PROCESS TAB */}
              {activeTab === "process" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Section Title *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={process.title}
                      onChange={(e) => update("process", { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={process.subtitle}
                      onChange={(e) => update("process", { subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Steps</label>
                      <button
                        type="button"
                        onClick={() =>
                          update("process", {
                            ...process,
                            steps: [
                              ...process.steps,
                              { step: process.steps.length + 1, title: "", description: "", icon: "" },
                            ],
                          })
                        }
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Step
                      </button>
                    </div>
                    <div className="space-y-4">
                      {process.steps.map((s: ProcessStep, i: number) => (
                        <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Step {i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = process.steps.filter((_, j) => j !== i);
                                update("process", { ...process, steps: updated });
                              }}
                              className="text-destructive hover:text-destructive/70"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium mb-1">Title *</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                value={s.title}
                                onChange={(e) => {
                                  const updated = [...process.steps];
                                  updated[i] = { ...updated[i], title: e.target.value };
                                  update("process", { ...process, steps: updated });
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Icon *</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                placeholder="ClipboardList, Palette, Code..."
                                value={s.icon}
                                onChange={(e) => {
                                  const updated = [...process.steps];
                                  updated[i] = { ...updated[i], icon: e.target.value };
                                  update("process", { ...process, steps: updated });
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Description *</label>
                            <textarea
                              className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm resize-none"
                              rows={2}
                              value={s.description}
                              onChange={(e) => {
                                const updated = [...process.steps];
                                updated[i] = { ...updated[i], description: e.target.value };
                                update("process", { ...process, steps: updated });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CTA TAB */}
              {activeTab === "contact_cta" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Heading *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={cta.heading}
                      onChange={(e) => update("contact_cta", { heading: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subheading</label>
                    <textarea
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                      rows={3}
                      value={cta.subheading}
                      onChange={(e) => update("contact_cta", { subheading: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">CTA Text *</label>
                      <input
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                        value={cta.ctaText}
                        onChange={(e) => update("contact_cta", { ctaText: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">CTA Link *</label>
                      <input
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                        value={cta.ctaHref}
                        onChange={(e) => update("contact_cta", { ctaHref: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SEO TAB */}
              {activeTab === "seo" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Meta Title *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={seo.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          seo: { ...seo, title: e.target.value },
                        }))
                      }
                      placeholder="Our Services — RaYnk Labs"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Meta Description</label>
                    <textarea
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                      rows={3}
                      value={seo.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          seo: { ...seo, description: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Keywords (comma-separated)
                    </label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={seo.keywords}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          seo: { ...seo, keywords: e.target.value },
                        }))
                      }
                      placeholder="web design, SEO, graphic design"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">OG Image</label>
                    <ImageUpload
                      value={seo.ogImage}
                      onChange={(v) =>
                        setFormData((prev) => ({ ...prev, seo: { ...seo, ogImage: v } }))
                      }
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="noIndex"
                      checked={seo.noIndex}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          seo: { ...seo, noIndex: e.target.checked },
                        }))
                      }
                      className="w-4 h-4 rounded border-border"
                    />
                    <label htmlFor="noIndex" className="text-sm font-medium">
                      No Index (hide from search engines)
                    </label>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom save button */}
      <div className="flex justify-end pb-6">
        <button
          onClick={handleSave}
          disabled={loading || loadingData}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground rounded-lg font-medium transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
