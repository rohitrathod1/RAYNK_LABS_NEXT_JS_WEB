"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/common/image-upload";
import {
  updateHomeHero,
  updateHomeMission,
  updateHomeFeaturedProducts,
  updateHomeHealthBenefits,
  updateHomeTestimonials,
  updateHomeCta,
  updateHomeSeo,
} from "@/modules/home/actions";
import type { HomePageData } from "@/modules/home/types";
import { defaultHomeContent } from "@/modules/home/data/defaults";

const TABS = ["hero", "mission", "featured-products", "health-benefits", "testimonials", "cta", "seo"] as const;
type Tab = (typeof TABS)[number];

type FormData = HomePageData & {
  seo: { title: string; description: string; keywords: string; ogImage: string; noIndex: boolean };
};

export default function HomePageManager() {
  const [activeTab, setActiveTab] = useState<Tab>("hero");
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetch("/api/admin/home")
      .then((r) => r.json())
      .then(({ data }: { data: Partial<FormData> }) => {
        setFormData({
          hero: { ...defaultHomeContent.hero, ...(data?.hero ?? {}) },
          mission: { ...defaultHomeContent.mission, ...(data?.mission ?? {}) },
          "featured-products": {
            ...defaultHomeContent["featured-products"],
            ...(data?.["featured-products"] ?? {}),
          },
          "health-benefits": {
            ...defaultHomeContent["health-benefits"],
            ...(data?.["health-benefits"] ?? {}),
          },
          testimonials: { ...defaultHomeContent.testimonials, ...(data?.testimonials ?? {}) },
          cta: { ...defaultHomeContent.cta, ...(data?.cta ?? {}) },
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
      hero: (d) => updateHomeHero(d),
      mission: (d) => updateHomeMission(d),
      "featured-products": (d) => updateHomeFeaturedProducts(d),
      "health-benefits": (d) => updateHomeHealthBenefits(d),
      testimonials: (d) => updateHomeTestimonials(d),
      cta: (d) => updateHomeCta(d),
      seo: (d) => updateHomeSeo(d),
    };
    const result = await actionMap[activeTab]?.(formData[activeTab]);
    if (result?.success) toast.success("Saved successfully!");
    else toast.error(result?.error ?? "Failed to save");
    setLoading(false);
  }

  const hero = formData.hero ?? defaultHomeContent.hero;
  const mission = formData.mission ?? defaultHomeContent.mission;
  const featuredProducts = formData["featured-products"] ?? defaultHomeContent["featured-products"];
  const healthBenefits = formData["health-benefits"] ?? defaultHomeContent["health-benefits"];
  const testimonials = formData.testimonials ?? defaultHomeContent.testimonials;
  const cta = formData.cta ?? defaultHomeContent.cta;
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
          <h1 className="text-2xl sm:text-3xl font-bold">Home Page Manager</h1>
          <p className="text-muted-foreground mt-1">Manage all home page sections and SEO</p>
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
              className={`px-4 py-3 font-medium transition-colors whitespace-nowrap capitalize text-sm ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
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
                    <label className="block text-sm font-medium mb-1.5">Badge Text</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={hero.badgeText}
                      onChange={(e) => update("hero", { badgeText: e.target.value })}
                      placeholder="Student-Led Innovation"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Heading *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={hero.heading}
                      onChange={(e) => update("hero", { heading: e.target.value })}
                      placeholder="Building the Future..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subheading *</label>
                    <textarea
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                      rows={3}
                      value={hero.subheading}
                      onChange={(e) => update("hero", { subheading: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Primary CTA Text *</label>
                      <input
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                        value={hero.ctaText}
                        onChange={(e) => update("hero", { ctaText: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Primary CTA Link *</label>
                      <input
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                        value={hero.ctaHref}
                        onChange={(e) => update("hero", { ctaHref: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Secondary CTA Text</label>
                      <input
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                        value={hero.secondaryCtaText}
                        onChange={(e) => update("hero", { secondaryCtaText: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Secondary CTA Link</label>
                      <input
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                        value={hero.secondaryCtaHref}
                        onChange={(e) => update("hero", { secondaryCtaHref: e.target.value })}
                      />
                    </div>
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

              {/* MISSION TAB */}
              {activeTab === "mission" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Title *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={mission.title}
                      onChange={(e) => update("mission", { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Body *</label>
                    <textarea
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                      rows={5}
                      value={mission.body}
                      onChange={(e) => update("mission", { body: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Image</label>
                    <ImageUpload
                      value={mission.image}
                      onChange={(v) => update("mission", { image: v })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Stats</label>
                      <button
                        type="button"
                        onClick={() =>
                          update("mission", {
                            stats: [...mission.stats, { label: "", value: "" }],
                          })
                        }
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Stat
                      </button>
                    </div>
                    <div className="space-y-2">
                      {mission.stats.map((stat, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <input
                            className="flex-1 px-3 py-1.5 rounded-md border border-input bg-background text-sm"
                            placeholder="Label"
                            value={stat.label}
                            onChange={(e) => {
                              const updated = [...mission.stats];
                              updated[i] = { ...updated[i], label: e.target.value };
                              update("mission", { stats: updated });
                            }}
                          />
                          <input
                            className="w-24 px-3 py-1.5 rounded-md border border-input bg-background text-sm"
                            placeholder="Value"
                            value={stat.value}
                            onChange={(e) => {
                              const updated = [...mission.stats];
                              updated[i] = { ...updated[i], value: e.target.value };
                              update("mission", { stats: updated });
                            }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              update("mission", { stats: mission.stats.filter((_, j) => j !== i) })
                            }
                            className="text-destructive hover:text-destructive/70"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* FEATURED PRODUCTS TAB */}
              {activeTab === "featured-products" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Section Title *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={featuredProducts.title}
                      onChange={(e) => update("featured-products", { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={featuredProducts.subtitle}
                      onChange={(e) => update("featured-products", { subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Products</label>
                      <button
                        type="button"
                        onClick={() =>
                          update("featured-products", {
                            products: [
                              ...featuredProducts.products,
                              { name: "", description: "", image: "", href: "", badge: "" },
                            ],
                          })
                        }
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Product
                      </button>
                    </div>
                    <div className="space-y-6">
                      {featuredProducts.products.map((p, i) => (
                        <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Product {i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                update("featured-products", {
                                  products: featuredProducts.products.filter((_, j) => j !== i),
                                })
                              }
                              className="text-destructive hover:text-destructive/70"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium mb-1">Name *</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                value={p.name}
                                onChange={(e) => {
                                  const updated = [...featuredProducts.products];
                                  updated[i] = { ...updated[i], name: e.target.value };
                                  update("featured-products", { products: updated });
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Badge</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                value={p.badge}
                                onChange={(e) => {
                                  const updated = [...featuredProducts.products];
                                  updated[i] = { ...updated[i], badge: e.target.value };
                                  update("featured-products", { products: updated });
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
                                const updated = [...featuredProducts.products];
                                updated[i] = { ...updated[i], description: e.target.value };
                                update("featured-products", { products: updated });
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Link (href)</label>
                            <input
                              className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                              value={p.href}
                              onChange={(e) => {
                                const updated = [...featuredProducts.products];
                                updated[i] = { ...updated[i], href: e.target.value };
                                update("featured-products", { products: updated });
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Image</label>
                            <ImageUpload
                              value={p.image}
                              onChange={(v) => {
                                const updated = [...featuredProducts.products];
                                updated[i] = { ...updated[i], image: v };
                                update("featured-products", { products: updated });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* HEALTH BENEFITS TAB */}
              {activeTab === "health-benefits" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Section Title *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={healthBenefits.title}
                      onChange={(e) => update("health-benefits", { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={healthBenefits.subtitle}
                      onChange={(e) => update("health-benefits", { subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Benefits</label>
                      <button
                        type="button"
                        onClick={() =>
                          update("health-benefits", {
                            benefits: [
                              ...healthBenefits.benefits,
                              { title: "", description: "", icon: "" },
                            ],
                          })
                        }
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Benefit
                      </button>
                    </div>
                    <div className="space-y-4">
                      {healthBenefits.benefits.map((b, i) => (
                        <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Benefit {i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                update("health-benefits", {
                                  benefits: healthBenefits.benefits.filter((_, j) => j !== i),
                                })
                              }
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
                                value={b.title}
                                onChange={(e) => {
                                  const updated = [...healthBenefits.benefits];
                                  updated[i] = { ...updated[i], title: e.target.value };
                                  update("health-benefits", { benefits: updated });
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">
                                Icon (Lucide name)
                              </label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                placeholder="Rocket, Star, Code..."
                                value={b.icon}
                                onChange={(e) => {
                                  const updated = [...healthBenefits.benefits];
                                  updated[i] = { ...updated[i], icon: e.target.value };
                                  update("health-benefits", { benefits: updated });
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Description *</label>
                            <textarea
                              className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm resize-none"
                              rows={2}
                              value={b.description}
                              onChange={(e) => {
                                const updated = [...healthBenefits.benefits];
                                updated[i] = { ...updated[i], description: e.target.value };
                                update("health-benefits", { benefits: updated });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TESTIMONIALS TAB */}
              {activeTab === "testimonials" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Section Title *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={testimonials.title}
                      onChange={(e) => update("testimonials", { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={testimonials.subtitle}
                      onChange={(e) => update("testimonials", { subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Testimonials</label>
                      <button
                        type="button"
                        onClick={() =>
                          update("testimonials", {
                            testimonials: [
                              ...testimonials.testimonials,
                              { name: "", role: "", avatar: "", quote: "", rating: 5 },
                            ],
                          })
                        }
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Testimonial
                      </button>
                    </div>
                    <div className="space-y-6">
                      {testimonials.testimonials.map((t, i) => (
                        <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Testimonial {i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                update("testimonials", {
                                  testimonials: testimonials.testimonials.filter(
                                    (_, j) => j !== i,
                                  ),
                                })
                              }
                              className="text-destructive hover:text-destructive/70"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium mb-1">Name *</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                value={t.name}
                                onChange={(e) => {
                                  const updated = [...testimonials.testimonials];
                                  updated[i] = { ...updated[i], name: e.target.value };
                                  update("testimonials", { testimonials: updated });
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Role *</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                value={t.role}
                                onChange={(e) => {
                                  const updated = [...testimonials.testimonials];
                                  updated[i] = { ...updated[i], role: e.target.value };
                                  update("testimonials", { testimonials: updated });
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">
                                Rating (1–5)
                              </label>
                              <input
                                type="number"
                                min={1}
                                max={5}
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                value={t.rating}
                                onChange={(e) => {
                                  const updated = [...testimonials.testimonials];
                                  updated[i] = { ...updated[i], rating: Number(e.target.value) };
                                  update("testimonials", { testimonials: updated });
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Quote *</label>
                            <textarea
                              className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm resize-none"
                              rows={3}
                              value={t.quote}
                              onChange={(e) => {
                                const updated = [...testimonials.testimonials];
                                updated[i] = { ...updated[i], quote: e.target.value };
                                update("testimonials", { testimonials: updated });
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Avatar</label>
                            <ImageUpload
                              value={t.avatar}
                              onChange={(v) => {
                                const updated = [...testimonials.testimonials];
                                updated[i] = { ...updated[i], avatar: v };
                                update("testimonials", { testimonials: updated });
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
              {activeTab === "cta" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Heading *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={cta.heading}
                      onChange={(e) => update("cta", { heading: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subheading</label>
                    <textarea
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                      rows={3}
                      value={cta.subheading}
                      onChange={(e) => update("cta", { subheading: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">CTA Text *</label>
                      <input
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                        value={cta.ctaText}
                        onChange={(e) => update("cta", { ctaText: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">CTA Link *</label>
                      <input
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                        value={cta.ctaHref}
                        onChange={(e) => update("cta", { ctaHref: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Background Image</label>
                    <ImageUpload
                      value={cta.backgroundImage}
                      onChange={(v) => update("cta", { backgroundImage: v })}
                    />
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
                      placeholder="RaYnk Labs — Student-Led Tech Innovation Lab"
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
                      placeholder="raynk labs, student tech lab, innovation"
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
