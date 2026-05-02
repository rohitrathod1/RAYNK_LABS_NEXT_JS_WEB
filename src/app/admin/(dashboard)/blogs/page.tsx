"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { Save, Loader2, Plus, Trash2, Edit2, Eye, EyeOff, FileText } from "lucide-react";
import { hasPermission } from "@/lib/permissions";
import { toast } from "sonner";
import { ImageUpload } from "@/components/common/image-upload";
import {
  updateBlogHero,
  updateBlogList,
  updateBlogSeo,
  createBlogPostAction,
  updateBlogPostAction,
  deleteBlogPostAction,
  toggleBlogPublishAction,
} from "@/modules/blog/actions";
import type { BlogPageData, BlogPostItem, BlogFormData } from "@/modules/blog/types";
import { defaultBlogContent } from "@/modules/blog/data/defaults";

const BlogEditor = dynamic(
  () => import("@/modules/blog/components/editor").then((m) => m.BlogEditor),
  { ssr: false, loading: () => <div className="min-h-[400px] bg-muted animate-pulse rounded-lg" /> },
);

const TABS = ["posts", "sections", "seo"] as const;
type Tab = (typeof TABS)[number];

const SECTION_TABS = ["hero", "blog_list"] as const;
type SectionTab = (typeof SECTION_TABS)[number];

const SECTION_LABELS: Record<SectionTab, string> = {
  hero: "Hero",
  blog_list: "Blog List",
};

type FormData = BlogPageData & {
  seo: { title: string; description: string; keywords: string; ogImage: string; noIndex: boolean };
};

export default function BlogManager() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session && !hasPermission(session, "MANAGE_BLOG")) {
      router.push("/admin");
    }
  }, [session, router]);

  const [activeTab, setActiveTab] = useState<Tab>("posts");
  const [activeSectionTab, setActiveSectionTab] = useState<SectionTab>("hero");
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showPostDialog, setShowPostDialog] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostItem | null>(null);
  const [postForm, setPostForm] = useState<Partial<BlogFormData>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    author: "",
    tags: "",
    isPublished: false,
    metaTitle: "",
    metaDescription: "",
  });

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then(({ data }: { data: { sections: Partial<FormData>; posts: BlogPostItem[] } }) => {
        const sections = data.sections ?? {};
        setFormData({
          hero: { ...defaultBlogContent.hero, ...(sections.hero ?? {}) },
          blog_list: { ...defaultBlogContent.blog_list, ...(sections.blog_list ?? {}) },
          seo: {
            title: "",
            description: "",
            keywords: "",
            ogImage: "",
            noIndex: false,
          },
        });
        setPosts(data.posts ?? []);
        setLoadingData(false);
      })
      .catch(() => {
        setLoadingData(false);
        toast.error("Failed to load blog data");
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
      hero: (d) => updateBlogHero(d),
      blog_list: (d) => updateBlogList(d),
    };
    const result = await actionMap[activeSectionTab]?.(formData[activeSectionTab]);
    if (result?.success) toast.success("Section saved!");
    else toast.error(result?.error ?? "Failed to save");
    setLoading(false);
  }

  async function handleSaveSeo() {
    setLoading(true);
    const seo = (formData as Partial<FormData>).seo;
    const result = await updateBlogSeo(seo);
    if (result?.success) toast.success("SEO saved!");
    else toast.error(result?.error ?? "Failed to save");
    setLoading(false);
  }

  function openCreateDialog() {
    setEditingPost(null);
    setPostForm({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      author: "",
      tags: "",
      isPublished: false,
      metaTitle: "",
      metaDescription: "",
    });
    setShowPostDialog(true);
  }

  function openEditDialog(post: BlogPostItem) {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? "",
      content: post.content,
      coverImage: post.coverImage ?? "",
      author: post.author,
      tags: post.tags.join(", "),
      isPublished: post.isPublished,
      metaTitle: post.metaTitle ?? "",
      metaDescription: post.metaDescription ?? "",
    });
    setShowPostDialog(true);
  }

  async function handleSavePost() {
    if (!postForm.title || !postForm.slug || !postForm.author) {
      toast.error("Title, slug, and author are required");
      return;
    }
    if (!postForm.content) {
      toast.error("Content is required");
      return;
    }
    setLoading(true);
    const result = editingPost
      ? await updateBlogPostAction(editingPost.id, postForm)
      : await createBlogPostAction(postForm);
    if (result?.success) {
      toast.success(editingPost ? "Post updated!" : "Post created!");
      setShowPostDialog(false);
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      setPosts(data.data.posts ?? []);
    } else {
      toast.error(result?.error ?? "Failed to save");
    }
    setLoading(false);
  }

  async function handleDeletePost(id: string) {
    if (!confirm("Delete this post permanently?")) return;
    const result = await deleteBlogPostAction(id);
    if (result?.success) {
      toast.success("Post deleted!");
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } else {
      toast.error(result?.error ?? "Failed to delete");
    }
  }

  async function handleTogglePublish(post: BlogPostItem) {
    const result = await toggleBlogPublishAction(post.id, !post.isPublished);
    if (result?.success) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? { ...p, isPublished: !p.isPublished }
            : p
        )
      );
      toast.success(post.isPublished ? "Post unpublished" : "Post published!");
    }
  }

  const hero = formData.hero ?? defaultBlogContent.hero;
  const blogList = formData.blog_list ?? defaultBlogContent.blog_list;
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
          <h1 className="text-2xl sm:text-3xl font-bold">Blog Manager</h1>
          <p className="text-muted-foreground mt-1">Manage blog posts, sections, and SEO</p>
        </div>
        {(activeTab === "sections" || activeTab === "seo") && (
          <button
            onClick={activeTab === "seo" ? handleSaveSeo : handleSaveSection}
            disabled={loading || loadingData}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground rounded-lg font-medium transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save
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
              {tab === "posts" ? "Posts" : tab === "sections" ? "Page Sections" : "SEO"}
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
              {activeTab === "posts" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">All Posts ({posts.length})</h2>
                    <button
                      onClick={openCreateDialog}
                      className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium text-sm transition"
                    >
                      <Plus className="w-4 h-4" /> New Post
                    </button>
                  </div>

                  {posts.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No posts yet. Click &quot;New Post&quot; to create one.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {posts.map((post) => (
                        <div
                          key={post.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:shadow-sm transition"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold truncate">{post.title}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>{post.author}</span>
                                <span>&middot;</span>
                                <span>
                                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 ml-4">
                            <span
                              className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                                post.isPublished
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {post.isPublished ? "Published" : "Draft"}
                            </span>
                            <button
                              onClick={() => handleTogglePublish(post)}
                              className={`p-1.5 rounded hover:bg-muted transition ${
                                post.isPublished ? "text-green-500" : "text-muted-foreground"
                              }`}
                              title={post.isPublished ? "Unpublish" : "Publish"}
                            >
                              {post.isPublished ? (
                                <Eye className="w-4 h-4" />
                              ) : (
                                <EyeOff className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => openEditDialog(post)}
                              className="p-1.5 rounded hover:bg-muted transition"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="p-1.5 rounded hover:bg-muted transition text-destructive"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

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

                  {activeSectionTab === "blog_list" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Title</label>
                        <input
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                          value={blogList.title}
                          onChange={(e) => update("blog_list", { title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                        <textarea
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                          rows={2}
                          value={blogList.subtitle}
                          onChange={(e) => update("blog_list", { subtitle: e.target.value })}
                        />
                      </div>
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
                      placeholder="RaYnk Labs - Blog"
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
                      placeholder="blog, technology, web development"
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
                      id="blogNoIndex"
                      checked={seo.noIndex}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          seo: { ...seo, noIndex: e.target.checked },
                        }))
                      }
                      className="w-4 h-4 rounded border-border"
                    />
                    <label htmlFor="blogNoIndex" className="text-sm font-medium">
                      No Index (hide from search engines)
                    </label>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showPostDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card rounded-xl border border-border shadow-xl">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold">
                {editingPost ? "Edit Post" : "Create New Post"}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Title *</label>
                  <input
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                    value={postForm.title}
                    onChange={(e) => setPostForm((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Slug *</label>
                  <input
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                    value={postForm.slug}
                    onChange={(e) =>
                      setPostForm((prev) => ({
                        ...prev,
                        slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
                      }))
                    }
                    placeholder="my-blog-post"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Author *</label>
                <input
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={postForm.author}
                  onChange={(e) => setPostForm((prev) => ({ ...prev, author: e.target.value }))}
                  placeholder="Author name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Excerpt</label>
                <textarea
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                  rows={2}
                  value={postForm.excerpt}
                  onChange={(e) => setPostForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Short summary for card view"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Cover Image</label>
                <ImageUpload
                  value={postForm.coverImage ?? ""}
                  onChange={(v) => setPostForm((prev) => ({ ...prev, coverImage: v }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Tags (comma-separated)</label>
                <input
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={postForm.tags}
                  onChange={(e) => setPostForm((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder="Web Development, React, Next.js"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Content *</label>
                <BlogEditor
                  content={postForm.content ?? ""}
                  onChange={(html) => setPostForm((prev) => ({ ...prev, content: html }))}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Meta Title</label>
                  <input
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                    value={postForm.metaTitle}
                    onChange={(e) => setPostForm((prev) => ({ ...prev, metaTitle: e.target.value }))}
                    placeholder="Custom SEO title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Meta Description</label>
                  <input
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                    value={postForm.metaDescription}
                    onChange={(e) =>
                      setPostForm((prev) => ({ ...prev, metaDescription: e.target.value }))
                    }
                    placeholder="Custom SEO description"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={postForm.isPublished}
                    onChange={(e) => setPostForm((prev) => ({ ...prev, isPublished: e.target.checked }))}
                    className="w-4 h-4 rounded border-border"
                  />
                  <span className="text-sm">Publish immediately</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => setShowPostDialog(false)}
                className="px-4 py-2 text-sm font-medium rounded-md border border-input hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePost}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary hover:bg-primary/90 text-primary-foreground transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> {editingPost ? "Update" : "Create"}
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
