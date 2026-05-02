"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/common/image-upload";
import { hasPermission } from "@/lib/permissions";
import {
  updateAboutHero,
  updateAboutStory,
  updateAboutMission,
  updateAboutWhyChoose,
  updateAboutCoreTeam,
  updateAboutSocialLinks,
  updateAboutSeo,
} from "@/modules/about/actions";
import type { AboutPageData } from "@/modules/about/types";
import { defaultAboutContent } from "@/modules/about/data/defaults";

const TABS = [
  "hero",
  "story",
  "mission",
  "why_choose_us",
  "core_team",
  "social_links",
  "seo",
] as const;
type Tab = (typeof TABS)[number];

type FormData = AboutPageData & {
  seo: { title: string; description: string; keywords: string; ogImage: string; noIndex: boolean };
};

const TAB_LABELS: Record<Tab, string> = {
  hero: "Hero",
  story: "Story",
  mission: "Mission",
  why_choose_us: "Why Choose Us",
  core_team: "Core Team",
  social_links: "Social Links",
  seo: "SEO",
};

export default function AboutPageManager() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session && !hasPermission(session, "MANAGE_ABOUT")) {
      router.push("/admin");
    }
  }, [session, router]);

  const [activeTab, setActiveTab] = useState<Tab>("hero");
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetch("/api/admin/about")
      .then((r) => r.json())
      .then(({ data }: { data: Partial<FormData> }) => {
        setFormData({
          hero: { ...defaultAboutContent.hero, ...(data?.hero ?? {}) },
          story: { ...defaultAboutContent.story, ...(data?.story ?? {}) },
          mission: { ...defaultAboutContent.mission, ...(data?.mission ?? {}) },
          why_choose_us: { ...defaultAboutContent.why_choose_us, ...(data?.why_choose_us ?? {}) },
          core_team: { ...defaultAboutContent.core_team, ...(data?.core_team ?? {}) },
          social_links: { ...defaultAboutContent.social_links, ...(data?.social_links ?? {}) },
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
      hero: (d) => updateAboutHero(d),
      story: (d) => updateAboutStory(d),
      mission: (d) => updateAboutMission(d),
      why_choose_us: (d) => updateAboutWhyChoose(d),
      core_team: (d) => updateAboutCoreTeam(d),
      social_links: (d) => updateAboutSocialLinks(d),
      seo: (d) => updateAboutSeo(d),
    };
    const result = await actionMap[activeTab]?.(formData[activeTab]);
    if (result?.success) toast.success("Saved successfully!");
    else toast.error(result?.error ?? "Failed to save");
    setLoading(false);
  }

  const hero = formData.hero ?? defaultAboutContent.hero;
  const story = formData.story ?? defaultAboutContent.story;
  const mission = formData.mission ?? defaultAboutContent.mission;
  const whyChoose = formData.why_choose_us ?? defaultAboutContent.why_choose_us;
  const coreTeam = formData.core_team ?? defaultAboutContent.core_team;
  const socialLinks = formData.social_links ?? defaultAboutContent.social_links;
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
          <h1 className="text-2xl sm:text-3xl font-bold">About Page Manager</h1>
          <p className="text-muted-foreground mt-1">Manage all about page sections and SEO</p>
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
                    <label className="block text-sm font-medium mb-1.5">Title *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={hero.title}
                      onChange={(e) => update("hero", { title: e.target.value })}
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
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Background Image</label>
                    <ImageUpload
                      value={hero.backgroundImage}
                      onChange={(v) => update("hero", { backgroundImage: v })}
                    />
                  </div>
                </div>
              )}

              {activeTab === "story" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Image</label>
                    <ImageUpload
                      value={story.image}
                      onChange={(v) => update("story", { image: v })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Content *</label>
                    <textarea
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                      rows={8}
                      value={story.content}
                      onChange={(e) => update("story", { content: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {activeTab === "mission" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Section Title *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={mission.title}
                      onChange={(e) => update("mission", { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={mission.subtitle}
                      onChange={(e) => update("mission", { subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Mission Items (3 recommended)</label>
                      <button
                        type="button"
                        onClick={() =>
                          update("mission", {
                            items: [
                              ...mission.items,
                              { icon: "Star", title: "", description: "" },
                            ],
                          })
                        }
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Item
                      </button>
                    </div>
                    <div className="space-y-6">
                      {mission.items.map((item, i) => (
                        <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Item {i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                update("mission", {
                                  items: mission.items.filter((_, j) => j !== i),
                                })
                              }
                              className="text-destructive hover:text-destructive/70"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-medium mb-1">Icon (Lucide name)</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                placeholder="Eye, Target, Heart..."
                                value={item.icon}
                                onChange={(e) => {
                                  const updated = [...mission.items];
                                  updated[i] = { ...updated[i], icon: e.target.value };
                                  update("mission", { items: updated });
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Title *</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                value={item.title}
                                onChange={(e) => {
                                  const updated = [...mission.items];
                                  updated[i] = { ...updated[i], title: e.target.value };
                                  update("mission", { items: updated });
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
                                const updated = [...mission.items];
                                updated[i] = { ...updated[i], description: e.target.value };
                                update("mission", { items: updated });
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
                              <label className="block text-xs font-medium mb-1">Icon (Lucide name)</label>
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

              {activeTab === "core_team" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Section Title *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={coreTeam.title}
                      onChange={(e) => update("core_team", { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={coreTeam.subtitle}
                      onChange={(e) => update("core_team", { subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Team Members (4 recommended)</label>
                      <button
                        type="button"
                        onClick={() =>
                          update("core_team", {
                            members: [
                              ...coreTeam.members,
                              { name: "", role: "", image: "", portfolioUrl: "" },
                            ],
                          })
                        }
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Member
                      </button>
                    </div>
                    <div className="space-y-6">
                      {coreTeam.members.map((member, i) => (
                        <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Member {i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                update("core_team", {
                                  members: coreTeam.members.filter((_, j) => j !== i),
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
                                value={member.name}
                                onChange={(e) => {
                                  const updated = [...coreTeam.members];
                                  updated[i] = { ...updated[i], name: e.target.value };
                                  update("core_team", { members: updated });
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Role *</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                value={member.role}
                                onChange={(e) => {
                                  const updated = [...coreTeam.members];
                                  updated[i] = { ...updated[i], role: e.target.value };
                                  update("core_team", { members: updated });
                                }}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Portfolio URL</label>
                            <input
                              className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                              placeholder="/portfolio"
                              value={member.portfolioUrl}
                              onChange={(e) => {
                                const updated = [...coreTeam.members];
                                updated[i] = { ...updated[i], portfolioUrl: e.target.value };
                                update("core_team", { members: updated });
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1">Image</label>
                            <ImageUpload
                              value={member.image}
                              onChange={(v) => {
                                const updated = [...coreTeam.members];
                                updated[i] = { ...updated[i], image: v };
                                update("core_team", { members: updated });
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "social_links" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Section Title *</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={socialLinks.title}
                      onChange={(e) => update("social_links", { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={socialLinks.subtitle}
                      onChange={(e) => update("social_links", { subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-sm font-medium">Social Links</label>
                      <button
                        type="button"
                        onClick={() =>
                          update("social_links", {
                            links: [
                              ...socialLinks.links,
                              { platform: "", url: "", icon: "Globe" },
                            ],
                          })
                        }
                        className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Link
                      </button>
                    </div>
                    <div className="space-y-6">
                      {socialLinks.links.map((link, i) => (
                        <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              Link {i + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                update("social_links", {
                                  links: socialLinks.links.filter((_, j) => j !== i),
                                })
                              }
                              className="text-destructive hover:text-destructive/70"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-xs font-medium mb-1">Platform *</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                placeholder="YouTube, Instagram..."
                                value={link.platform}
                                onChange={(e) => {
                                  const updated = [...socialLinks.links];
                                  updated[i] = { ...updated[i], platform: e.target.value };
                                  update("social_links", { links: updated });
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">URL *</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                placeholder="https://..."
                                value={link.url}
                                onChange={(e) => {
                                  const updated = [...socialLinks.links];
                                  updated[i] = { ...updated[i], url: e.target.value };
                                  update("social_links", { links: updated });
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium mb-1">Icon (Lucide)</label>
                              <input
                                className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                placeholder="Youtube, Instagram..."
                                value={link.icon}
                                onChange={(e) => {
                                  const updated = [...socialLinks.links];
                                  updated[i] = { ...updated[i], icon: e.target.value };
                                  update("social_links", { links: updated });
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

              {activeTab === "seo" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Meta Title</label>
                    <input
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      value={seo.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          seo: { ...seo, title: e.target.value },
                        }))
                      }
                      placeholder="About RaYnk Labs — Our Story, Mission & Team"
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
                      placeholder="raynk labs, about us, digital agency"
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
