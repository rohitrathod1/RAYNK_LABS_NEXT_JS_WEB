"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Save, Loader2, Plus, Trash2, Edit2, Eye, EyeOff, Star, StarOff } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/common/image-upload";
import { hasPermission } from "@/lib/permissions";
import {
  updatePortfolioHero,
  updatePortfolioCategories,
  updatePortfolioProjectsGrid,
  updatePortfolioTestimonialsItems,
  updatePortfolioCta,
  updatePortfolioSeo,
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
  toggleProjectFeaturedAction,
  toggleProjectActiveAction,
} from "@/modules/portfolio/actions";
import type { PortfolioPageData, PortfolioProjectFormData, ProjectItem } from "@/modules/portfolio/types";
import { defaultPortfolioContent } from "@/modules/portfolio/data/defaults";

const TABS = ["sections", "projects", "seo"] as const;
type Tab = (typeof TABS)[number];

const SECTION_TABS = ["hero", "categories_filter", "projects_grid", "testimonials", "contact_cta"] as const;
type SectionTab = (typeof SECTION_TABS)[number];

const SECTION_LABELS: Record<SectionTab, string> = {
  hero: "Hero",
  categories_filter: "Categories",
  projects_grid: "Projects Grid",
  testimonials: "Testimonials",
  contact_cta: "Contact CTA",
};

type FormData = PortfolioPageData & {
  seo: { title: string; description: string; keywords: string; ogImage: string; noIndex: boolean };
};

export default function PortfolioPageManager() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session && !hasPermission(session, "MANAGE_PORTFOLIO")) {
      router.push("/admin");
    }
  }, [session, router]);

  const [activeTab, setActiveTab] = useState<Tab>("sections");
  const [activeSectionTab, setActiveSectionTab] = useState<SectionTab>("hero");
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projectForm, setProjectForm] = useState<Partial<PortfolioProjectFormData>>({
    title: "",
    slug: "",
    description: "",
    category: "",
    image: "",
    liveUrl: "",
    githubUrl: "",
    isFeatured: false,
    isActive: true,
  });

  useEffect(() => {
    fetch("/api/admin/portfolio")
      .then((r) => r.json())
      .then(({ data }: { data: { sections: Partial<FormData>; projects: ProjectItem[] } }) => {
        const sections = data.sections ?? {};
        setFormData({
          hero: { ...defaultPortfolioContent.hero, ...(sections.hero ?? {}) },
          categories_filter: { ...defaultPortfolioContent.categories_filter, ...(sections.categories_filter ?? {}) },
          projects_grid: { ...defaultPortfolioContent.projects_grid, ...(sections.projects_grid ?? {}) },
          testimonials: { ...defaultPortfolioContent.testimonials, ...(sections.testimonials ?? {}) },
          contact_cta: { ...defaultPortfolioContent.contact_cta, ...(sections.contact_cta ?? {}) },
          seo: {
            title: "",
            description: "",
            keywords: "",
            ogImage: "",
            noIndex: false,
          },
        });
        setProjects(data.projects ?? []);
        setLoadingData(false);
      })
      .catch(() => {
        setLoadingData(false);
        toast.error("Failed to load portfolio data");
      });
  }, []);

  function update<K extends keyof FormData>(section: K, patch: Partial<FormData[K]>) {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as object), ...patch },
    }));
  }

  async function handleSaveSection() {
    setLoading(true);
    type ActionFn = (d: unknown) => Promise<{ success: boolean; error?: string }>;
    const actionMap: Record<SectionTab, ActionFn> = {
      hero: (d) => updatePortfolioHero(d),
      categories_filter: (d) => updatePortfolioCategories(d),
      projects_grid: (d) => updatePortfolioProjectsGrid(d),
      testimonials: (d) => updatePortfolioTestimonialsItems(d),
      contact_cta: (d) => updatePortfolioCta(d),
    };
    const result = await actionMap[activeSectionTab]?.(formData[activeSectionTab]);
    if (result?.success) toast.success("Section saved successfully!");
    else toast.error(result?.error ?? "Failed to save");
    setLoading(false);
  }

  async function handleSaveSeo() {
    setLoading(true);
    const seo = (formData as Partial<FormData>).seo;
    const result = await updatePortfolioSeo(seo);
    if (result?.success) toast.success("SEO saved successfully!");
    else toast.error(result?.error ?? "Failed to save");
    setLoading(false);
  }

  function openCreateDialog() {
    setEditingProject(null);
    setProjectForm({
      title: "",
      slug: "",
      description: "",
      category: "",
      image: "",
      liveUrl: "",
      githubUrl: "",
      isFeatured: false,
      isActive: true,
    });
    setShowProjectDialog(true);
  }

  function openEditDialog(project: ProjectItem) {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      slug: project.slug,
      description: project.description ?? "",
      category: project.category,
      image: project.image,
      liveUrl: project.liveUrl ?? "",
      githubUrl: project.githubUrl ?? "",
      isFeatured: project.isFeatured,
      isActive: project.isActive,
    });
    setShowProjectDialog(true);
  }

  async function handleSaveProject() {
    if (!projectForm.title || !projectForm.slug || !projectForm.category) {
      toast.error("Title, slug, and category are required");
      return;
    }
    setLoading(true);
    const result = editingProject
      ? await updateProjectAction(editingProject.id, projectForm)
      : await createProjectAction(projectForm);
    if (result?.success) {
      toast.success(editingProject ? "Project updated!" : "Project created!");
      setShowProjectDialog(false);
      const res = await fetch("/api/admin/portfolio");
      const data = await res.json();
      setProjects(data.data.projects ?? []);
    } else {
      toast.error(result?.error ?? "Failed to save project");
    }
    setLoading(false);
  }

  async function handleDeleteProject(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    const result = await deleteProjectAction(id);
    if (result?.success) {
      toast.success("Project deleted!");
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } else {
      toast.error(result?.error ?? "Failed to delete");
    }
  }

  async function handleToggleFeatured(project: ProjectItem) {
    const result = await toggleProjectFeaturedAction(project.id, !project.isFeatured);
    if (result?.success) {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, isFeatured: !p.isFeatured } : p))
      );
      toast.success("Featured status updated!");
    } else {
      toast.error(result?.error ?? "Failed to update featured status");
    }
  }

  async function handleToggleActive(project: ProjectItem) {
    const result = await toggleProjectActiveAction(project.id, !project.isActive);
    if (result?.success) {
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, isActive: !p.isActive } : p))
      );
      toast.success("Active status updated!");
    } else {
      toast.error(result?.error ?? "Failed to update active status");
    }
  }

  const hero = formData.hero ?? defaultPortfolioContent.hero;
  const categories = formData.categories_filter ?? defaultPortfolioContent.categories_filter;
  const projectsGrid = formData.projects_grid ?? defaultPortfolioContent.projects_grid;
  const testimonials = formData.testimonials ?? defaultPortfolioContent.testimonials;
  const cta = formData.contact_cta ?? defaultPortfolioContent.contact_cta;
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
          <h1 className="text-2xl sm:text-3xl font-bold">Portfolio Manager</h1>
          <p className="text-muted-foreground mt-1">Manage portfolio sections, projects, and SEO</p>
        </div>
        {activeTab === "sections" && (
          <button
            onClick={handleSaveSection}
            disabled={loading || loadingData}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground rounded-lg font-medium transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Section
              </>
            )}
          </button>
        )}
        {activeTab === "seo" && (
          <button
            onClick={handleSaveSeo}
            disabled={loading || loadingData}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground rounded-lg font-medium transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save SEO
              </>
            )}
          </button>
        )}
      </div>

      <div className="border rounded-lg bg-card">
        <div className="flex overflow-x-auto border-b">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium transition-colors whitespace-nowrap text-sm capitalize ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "sections" ? "Page Sections" : tab === "projects" ? "Projects Manager" : "SEO"}
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
              {activeTab === "sections" && (
                <div className="space-y-4">
                  <div className="flex overflow-x-auto border-b mb-4">
                    {SECTION_TABS.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveSectionTab(tab)}
                        className={`px-3 py-2 font-medium transition-colors whitespace-nowrap text-sm ${
                          activeSectionTab === tab
                            ? "border-b-2 border-primary text-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {SECTION_LABELS[tab]}
                      </button>
                    ))}
                  </div>

                  {activeSectionTab === "hero" && (
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

                  {activeSectionTab === "categories_filter" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Title</label>
                        <input
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                          value={categories.title}
                          onChange={(e) => update("categories_filter", { title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">
                          Categories (comma-separated)
                        </label>
                        <input
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                          value={categories.categories.join(", ")}
                          onChange={(e) =>
                            update("categories_filter", {
                              categories: e.target.value
                                .split(",")
                                .map((c) => c.trim())
                                .filter(Boolean),
                            })
                          }
                          placeholder="All, Web Development, Graphic Design..."
                        />
                      </div>
                    </div>
                  )}

                  {activeSectionTab === "projects_grid" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Title</label>
                        <input
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                          value={projectsGrid.title}
                          onChange={(e) => update("projects_grid", { title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                        <textarea
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                          rows={2}
                          value={projectsGrid.subtitle}
                          onChange={(e) => update("projects_grid", { subtitle: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {activeSectionTab === "testimonials" && (
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
                                ...testimonials,
                                testimonials: [
                                  ...(testimonials.testimonials || []),
                                  { name: "", role: "", avatar: "", quote: "", rating: 5 },
                                ],
                              })
                            }
                            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Testimonial
                          </button>
                        </div>
                        <div className="space-y-4">
                          {(testimonials.testimonials || []).map((t: { name: string; role: string; avatar: string; quote: string; rating: number }, i: number) => (
                            <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                  Testimonial {i + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (testimonials.testimonials || []).filter((_: unknown, j: number) => j !== i);
                                    update("testimonials", { ...testimonials, testimonials: updated });
                                  }}
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
                                      const updated = [...(testimonials.testimonials || [])];
                                      updated[i] = { ...updated[i], name: e.target.value };
                                      update("testimonials", { ...testimonials, testimonials: updated });
                                    }}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium mb-1">Role *</label>
                                  <input
                                    className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                    value={t.role}
                                    onChange={(e) => {
                                      const updated = [...(testimonials.testimonials || [])];
                                      updated[i] = { ...updated[i], role: e.target.value };
                                      update("testimonials", { ...testimonials, testimonials: updated });
                                    }}
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1">Avatar URL</label>
                                <input
                                  className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                  value={t.avatar}
                                  onChange={(e) => {
                                    const updated = [...(testimonials.testimonials || [])];
                                    updated[i] = { ...updated[i], avatar: e.target.value };
                                    update("testimonials", { ...testimonials, testimonials: updated });
                                  }}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1">Quote *</label>
                                <textarea
                                  className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm resize-none"
                                  rows={2}
                                  value={t.quote}
                                  onChange={(e) => {
                                    const updated = [...(testimonials.testimonials || [])];
                                    updated[i] = { ...updated[i], quote: e.target.value };
                                    update("testimonials", { ...testimonials, testimonials: updated });
                                  }}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1">Rating (1-5)</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="5"
                                  className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                  value={t.rating}
                                  onChange={(e) => {
                                    const updated = [...(testimonials.testimonials || [])];
                                    updated[i] = { ...updated[i], rating: parseInt(e.target.value) || 5 };
                                    update("testimonials", { ...testimonials, testimonials: updated });
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSectionTab === "contact_cta" && (
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
                </div>
              )}

              {activeTab === "projects" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">All Projects ({projects.length})</h2>
                    <button
                      onClick={openCreateDialog}
                      className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium text-sm transition"
                    >
                      <Plus className="w-4 h-4" /> Add Project
                    </button>
                  </div>

                  {projects.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No projects yet. Click &quot;Add Project&quot; to create one.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {projects.map((project) => (
                        <div
                          key={project.id}
                          className="rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition"
                        >
                          <div className="relative aspect-video">
                            <ImageUpload
                              value={project.image}
                              onChange={async (v) => {
                                const res = await fetch("/api/admin/portfolio/project", {
                                  method: "PUT",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ ...project, image: v }),
                                });
                                const data = await res.json();
                                if (data.success) {
                                  setProjects((prev) =>
                                    prev.map((p) => (p.id === project.id ? { ...p, image: v } : p))
                                  );
                                  toast.success("Image updated!");
                                }
                              }}
                            />
                          </div>
                          <div className="p-4 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold">{project.title}</h3>
                                <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary mt-1">
                                  {project.category}
                                </span>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleToggleFeatured(project)}
                                  className={`p-1.5 rounded hover:bg-muted transition ${
                                    project.isFeatured ? "text-yellow-500" : "text-muted-foreground"
                                  }`}
                                  title={project.isFeatured ? "Remove featured" : "Mark as featured"}
                                >
                                  {project.isFeatured ? (
                                    <Star className="w-4 h-4 fill-yellow-500" />
                                  ) : (
                                    <StarOff className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => handleToggleActive(project)}
                                  className={`p-1.5 rounded hover:bg-muted transition ${
                                    project.isActive ? "text-green-500" : "text-muted-foreground"
                                  }`}
                                  title={project.isActive ? "Deactivate" : "Activate"}
                                >
                                  {project.isActive ? (
                                    <Eye className="w-4 h-4" />
                                  ) : (
                                    <EyeOff className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => openEditDialog(project)}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-input hover:bg-muted transition"
                              >
                                <Edit2 className="w-3 h-3" /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-destructive border border-destructive/30 hover:bg-destructive/10 transition"
                              >
                                <Trash2 className="w-3 h-3" /> Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                      placeholder="RaYnk Labs - Portfolio"
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
                      placeholder="portfolio, web design, case studies"
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
                      id="portfolioNoIndex"
                      checked={seo.noIndex}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          seo: { ...seo, noIndex: e.target.checked },
                        }))
                      }
                      className="w-4 h-4 rounded border-border"
                    />
                    <label htmlFor="portfolioNoIndex" className="text-sm font-medium">
                      No Index (hide from search engines)
                    </label>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showProjectDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card rounded-xl border border-border shadow-xl">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold">
                {editingProject ? "Edit Project" : "Create New Project"}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Title *</label>
                  <input
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Slug *</label>
                  <input
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                    value={projectForm.slug}
                    onChange={(e) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                      }))
                    }
                    placeholder="my-project"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Category *</label>
                <input
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={projectForm.category}
                  onChange={(e) => setProjectForm((prev) => ({ ...prev, category: e.target.value }))}
                  placeholder="Web Development"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                  rows={3}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Image</label>
                <ImageUpload
                  value={projectForm.image ?? ""}
                  onChange={(v) => setProjectForm((prev) => ({ ...prev, image: v }))}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Live URL</label>
                  <input
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                    value={projectForm.liveUrl}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, liveUrl: e.target.value }))}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">GitHub URL</label>
                  <input
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, githubUrl: e.target.value }))}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={projectForm.isFeatured}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm">Featured</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={projectForm.isActive}
                    onChange={(e) => setProjectForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm">Active</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => setShowProjectDialog(false)}
                className="px-4 py-2 text-sm font-medium rounded-md border border-input hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProject}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary hover:bg-primary/90 text-primary-foreground transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> {editingProject ? "Update" : "Create"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
