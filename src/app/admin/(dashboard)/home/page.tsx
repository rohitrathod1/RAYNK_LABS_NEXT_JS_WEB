"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/common/image-upload";
import { hasPermission } from "@/lib/permissions";
import {
  updateHomeHero,
  updateHomeInitiatives,
  updateHomeServices,
  updateHomeWhyDigital,
  updateHomePortfolio,
  updateHomeTestimonials,
  updateHomeWhyChoose,
  updateHomeCta,
  updateHomeSeo,
} from "@/modules/home/actions";
import type { HomePageData } from "@/modules/home/types";
import { defaultHomeContent } from "@/modules/home/data/defaults";

const TABS = [
  "hero",
  "initiatives",
  "services",
  "why_digital",
  "portfolio_preview",
  "testimonials",
  "why_choose_us",
  "contact_cta",
  "seo",
] as const;
type Tab = (typeof TABS)[number];

type FormData = HomePageData & {
  seo: { title: string; description: string; keywords: string; ogImage: string; noIndex: boolean };
};

const TAB_LABELS: Record<Tab, string> = {
  hero: "Hero",
  initiatives: "Initiatives",
  services: "Services",
  why_digital: "Why Digital",
  portfolio_preview: "Portfolio",
  testimonials: "Testimonials",
  why_choose_us: "Why Choose Us",
  contact_cta: "Contact CTA",
  seo: "SEO",
};

export default function HomePageManager() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session && !hasPermission(session, "EDIT_HOME")) {
      router.push("/admin");
    }
  }, [session, router]);

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
          initiatives: { ...defaultHomeContent.initiatives, ...(data?.initiatives ?? {}) },
          services: { ...defaultHomeContent.services, ...(data?.services ?? {}) },
          why_digital: { ...defaultHomeContent.why_digital, ...(data?.why_digital ?? {}) },
          portfolio_preview: {
            ...defaultHomeContent.portfolio_preview,
            ...(data?.portfolio_preview ?? {}),
          },
          testimonials: { ...defaultHomeContent.testimonials, ...(data?.testimonials ?? {}) },
          why_choose_us: { ...defaultHomeContent.why_choose_us, ...(data?.why_choose_us ?? {}) },
          contact_cta: { ...defaultHomeContent.contact_cta, ...(data?.contact_cta ?? {}) },
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
      initiatives: (d) => updateHomeInitiatives(d),
      services: (d) => updateHomeServices(d),
      why_digital: (d) => updateHomeWhyDigital(d),
      portfolio_preview: (d) => updateHomePortfolio(d),
      testimonials: (d) => updateHomeTestimonials(d),
      why_choose_us: (d) => updateHomeWhyChoose(d),
      contact_cta: (d) => updateHomeCta(d),
      seo: (d) => updateHomeSeo(d),
    };
    const result = await actionMap[activeTab]?.(formData[activeTab]);
    if (result?.success) toast.success("Saved successfully!");
    else toast.error(result?.error ?? "Failed to save");
    setLoading(false);
  }

  const hero = formData.hero ?? defaultHomeContent.hero;
  const initiatives = formData.initiatives ?? defaultHomeContent.initiatives;
  const services = formData.services ?? defaultHomeContent.services;
  const whyDigital = formData.why_digital ?? defaultHomeContent.why_digital;
  const portfolio = formData.portfolio_preview ?? defaultHomeContent.portfolio_preview;
  const testimonials = formData.testimonials ?? defaultHomeContent.testimonials;
  const whyChoose = formData.why_choose_us ?? defaultHomeContent.why_choose_us;
  const cta = formData.contact_cta ?? defaultHomeContent.contact_cta;
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
              className={`px-4 py-3 font-medium transition-colors whitespace-nowrap text-sm ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {TAB_LABELS[tab]}
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
              {activeTab === "hero" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Heading *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={hero.heading}
                      onChange={(e) => update("hero", { heading: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subtitle *</label>
                    <textarea
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                      rows={3}
                      value={hero.subtitle}
                      onChange={(e) => update("hero", { subtitle: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Primary CTA Text *</label>
                      <input
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                        value={hero.ctaPrimaryText}
                        onChange={(e) => update("hero", { ctaPrimaryText: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Primary CTA Link *</label>
                      <input
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                        value={hero.ctaPrimaryHref}
                        onChange={(e) => update("hero", { ctaPrimaryHref: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Secondary CTA Text</label>
                      <input
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                        value={hero.ctaSecondaryText}
                        onChange={(e) => update("hero", { ctaSecondaryText: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Secondary CTA Link</label>
                      <input
                        className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                        value={hero.ctaSecondaryHref}
                        onChange={(e) => update("hero", { ctaSecondaryHref: e.target.value })}
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

              {activeTab === "initiatives" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Section Title *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={initiatives.title}
                      onChange={(e) => update("initiatives", { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={initiatives.subtitle}
                      onChange={(e) => update("initiatives", { subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Cards (4 recommended)</label>
                      <button
                        type="button"
                        onClick={() =>
                          update("initiatives", {
                            cards: [
                              ...initiatives.cards,
                              { icon: "Star", title: "", description: "" },
                            ],
                          })
                        }
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Card
                      </button>
                    </div>
                    <div className="space-y-6">
                      {initiatives.cards.map((card, i) => (
                        <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Card {i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                update("initiatives", {
                                  cards: initiatives.cards.filter((_, j) => j !== i),
                                })
                              }
                              className="text-destructive hover:text-destructive/70"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium mb-1">
                                Icon (Lucide name)
                              </label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                placeholder="Rocket, Star, Code..."
                                value={card.icon}
                                onChange={(e) => {
                                  const updated = [...initiatives.cards];
                                  updated[i] = { ...updated[i], icon: e.target.value };
                                  update("initiatives", { cards: updated });
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Title *</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                value={card.title}
                                onChange={(e) => {
                                  const updated = [...initiatives.cards];
                                  updated[i] = { ...updated[i], title: e.target.value };
                                  update("initiatives", { cards: updated });
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Description *</label>
                            <textarea
                              className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm resize-none"
                              rows={2}
                              value={card.description}
                              onChange={(e) => {
                                const updated = [...initiatives.cards];
                                updated[i] = { ...updated[i], description: e.target.value };
                                update("initiatives", { cards: updated });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "services" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Section Title *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={services.title}
                      onChange={(e) => update("services", { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={services.subtitle}
                      onChange={(e) => update("services", { subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Services (9 for 3x3 grid)</label>
                      <button
                        type="button"
                        onClick={() =>
                          update("services", {
                            services: [
                              ...services.services,
                              { icon: "Star", title: "", description: "" },
                            ],
                          })
                        }
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Service
                      </button>
                    </div>
                    <div className="space-y-6">
                      {services.services.map((service, i) => (
                        <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Service {i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                update("services", {
                                  services: services.services.filter((_, j) => j !== i),
                                })
                              }
                              className="text-destructive hover:text-destructive/70"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium mb-1">
                                Icon (Lucide name)
                              </label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                placeholder="Code, Cloud, Bot..."
                                value={service.icon}
                                onChange={(e) => {
                                  const updated = [...services.services];
                                  updated[i] = { ...updated[i], icon: e.target.value };
                                  update("services", { services: updated });
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Title *</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                value={service.title}
                                onChange={(e) => {
                                  const updated = [...services.services];
                                  updated[i] = { ...updated[i], title: e.target.value };
                                  update("services", { services: updated });
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Description *</label>
                            <textarea
                              className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm resize-none"
                              rows={2}
                              value={service.description}
                              onChange={(e) => {
                                const updated = [...services.services];
                                updated[i] = { ...updated[i], description: e.target.value };
                                update("services", { services: updated });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "why_digital" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Section Title *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={whyDigital.title}
                      onChange={(e) => update("why_digital", { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={whyDigital.subtitle}
                      onChange={(e) => update("why_digital", { subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Image</label>
                    <ImageUpload
                      value={whyDigital.image}
                      onChange={(v) => update("why_digital", { image: v })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Bullet Points</label>
                      <button
                        type="button"
                        onClick={() =>
                          update("why_digital", {
                            bulletPoints: [...whyDigital.bulletPoints, ""],
                          })
                        }
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Point
                      </button>
                    </div>
                    <div className="space-y-2">
                      {whyDigital.bulletPoints.map((point, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <input
                            className="flex-1 px-3 py-1.5 rounded-md border border-input bg-background text-sm"
                            placeholder="Enter bullet point"
                            value={point}
                            onChange={(e) => {
                              const updated = [...whyDigital.bulletPoints];
                              updated[i] = e.target.value;
                              update("why_digital", { bulletPoints: updated });
                            }}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              update("why_digital", {
                                bulletPoints: whyDigital.bulletPoints.filter((_, j) => j !== i),
                              })
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

              {activeTab === "portfolio_preview" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Section Title *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={portfolio.title}
                      onChange={(e) => update("portfolio_preview", { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={portfolio.subtitle}
                      onChange={(e) => update("portfolio_preview", { subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Portfolio Items</label>
                      <button
                        type="button"
                        onClick={() =>
                          update("portfolio_preview", {
                            items: [
                              ...portfolio.items,
                              { title: "", description: "", image: "", href: "", tags: [] },
                            ],
                          })
                        }
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Item
                      </button>
                    </div>
                    <div className="space-y-6">
                      {portfolio.items.map((item, i) => (
                        <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Item {i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                update("portfolio_preview", {
                                  items: portfolio.items.filter((_, j) => j !== i),
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
                                value={item.title}
                                onChange={(e) => {
                                  const updated = [...portfolio.items];
                                  updated[i] = { ...updated[i], title: e.target.value };
                                  update("portfolio_preview", { items: updated });
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Link (href)</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                value={item.href}
                                onChange={(e) => {
                                  const updated = [...portfolio.items];
                                  updated[i] = { ...updated[i], href: e.target.value };
                                  update("portfolio_preview", { items: updated });
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Description *</label>
                            <textarea
                              className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm resize-none"
                              rows={2}
                              value={item.description}
                              onChange={(e) => {
                                const updated = [...portfolio.items];
                                updated[i] = { ...updated[i], description: e.target.value };
                                update("portfolio_preview", { items: updated });
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">
                              Tags (comma-separated)
                            </label>
                            <input
                              className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                              placeholder="Next.js, Prisma, PostgreSQL"
                              value={item.tags.join(", ")}
                              onChange={(e) => {
                                const updated = [...portfolio.items];
                                updated[i] = {
                                  ...updated[i],
                                  tags: e.target.value
                                    .split(",")
                                    .map((t) => t.trim())
                                    .filter(Boolean),
                                };
                                update("portfolio_preview", { items: updated });
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Image</label>
                            <ImageUpload
                              value={item.image}
                              onChange={(v) => {
                                const updated = [...portfolio.items];
                                updated[i] = { ...updated[i], image: v };
                                update("portfolio_preview", { items: updated });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

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
                                Rating (1-5)
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

              {activeTab === "why_choose_us" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Section Title *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={whyChoose.title}
                      onChange={(e) => update("why_choose_us", { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={whyChoose.subtitle}
                      onChange={(e) => update("why_choose_us", { subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Points (6 recommended)</label>
                      <button
                        type="button"
                        onClick={() =>
                          update("why_choose_us", {
                            points: [
                              ...whyChoose.points,
                              { icon: "Star", title: "", description: "" },
                            ],
                          })
                        }
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Point
                      </button>
                    </div>
                    <div className="space-y-6">
                      {whyChoose.points.map((point, i) => (
                        <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Point {i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                update("why_choose_us", {
                                  points: whyChoose.points.filter((_, j) => j !== i),
                                })
                              }
                              className="text-destructive hover:text-destructive/70"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium mb-1">
                                Icon (Lucide name)
                              </label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                placeholder="Zap, Award, Users..."
                                value={point.icon}
                                onChange={(e) => {
                                  const updated = [...whyChoose.points];
                                  updated[i] = { ...updated[i], icon: e.target.value };
                                  update("why_choose_us", { points: updated });
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Title *</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                value={point.title}
                                onChange={(e) => {
                                  const updated = [...whyChoose.points];
                                  updated[i] = { ...updated[i], title: e.target.value };
                                  update("why_choose_us", { points: updated });
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Description *</label>
                            <textarea
                              className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm resize-none"
                              rows={2}
                              value={point.description}
                              onChange={(e) => {
                                const updated = [...whyChoose.points];
                                updated[i] = { ...updated[i], description: e.target.value };
                                update("why_choose_us", { points: updated });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

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
                      placeholder="RaYnk Labs - Digital Solutions & Innovation"
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
                      placeholder="raynk labs, digital solutions, web development"
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
