"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Plus, Trash2, Pencil, GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { hasPermission } from "@/lib/permissions";

interface NavLink {
  id: string;
  title: string;
  href: string;
  parentId: string | null;
  isVisible: boolean;
  sortOrder: number;
  children?: NavLink[];
  createdAt: string;
  updatedAt: string;
}

export default function NavbarManager() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session && !hasPermission(session, "MANAGE_NAVBAR")) {
      router.push("/admin");
    }
  }, [session, router]);

  const [links, setLinks] = useState<NavLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingLink, setEditingLink] = useState<NavLink | null>(null);
  const [form, setForm] = useState({
    title: "",
    href: "",
    parentId: "",
    isVisible: true,
    sortOrder: 0,
  });

  useEffect(() => {
    fetch("/api/admin/navbar")
      .then((r) => r.json())
      .then(({ links: data }) => {
        setLinks(data ?? []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load navbar links");
        setLoading(false);
      });
  }, []);

  function openAddDialog(parentId?: string) {
    setEditingLink(null);
    setForm({
      title: "",
      href: "",
      parentId: parentId || "",
      isVisible: true,
      sortOrder: links.length,
    });
    setShowDialog(true);
  }

  function openEditDialog(link: NavLink) {
    setEditingLink(link);
    setForm({
      title: link.title,
      href: link.href,
      parentId: link.parentId || "",
      isVisible: link.isVisible,
      sortOrder: link.sortOrder,
    });
    setShowDialog(true);
  }

  async function handleSave() {
    if (!form.title || !form.href) {
      toast.error("Title and URL are required");
      return;
    }

    setSaving(true);
    const url = editingLink
      ? `/api/admin/navbar/${editingLink.id}`
      : "/api/admin/navbar";
    const method = editingLink ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          parentId: form.parentId || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success(editingLink ? "Link updated!" : "Link added!");
      setShowDialog(false);
      refreshData();
    } catch {
      toast.error("Failed to save link");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this link?")) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/navbar/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Link deleted!");
      refreshData();
    } catch {
      toast.error("Failed to delete link");
    }
    setSaving(false);
  }

  async function handleReorder(id: string, direction: "up" | "down") {
    const allLinks = [...links];
    const linkIndex = allLinks.findIndex((l) => l.id === id);
    if (linkIndex === -1) return;

    const siblingLinks = allLinks.filter(
      (l) => l.parentId === allLinks[linkIndex].parentId
    );
    const currentIndex = siblingLinks.findIndex((l) => l.id === id);
    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= siblingLinks.length) return;

    const updates = [
      { id: siblingLinks[currentIndex].id, sortOrder: siblingLinks[newIndex].sortOrder },
      { id: siblingLinks[newIndex].id, sortOrder: siblingLinks[currentIndex].sortOrder },
    ];

    setSaving(true);
    try {
      const res = await fetch("/api/admin/navbar/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updates }),
      });
      if (!res.ok) throw new Error("Failed to reorder");
      refreshData();
    } catch {
      toast.error("Failed to reorder");
    }
    setSaving(false);
  }

  function refreshData() {
    fetch("/api/admin/navbar")
      .then((r) => r.json())
      .then(({ links: data }) => setLinks(data ?? []));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const parentLinks = links.filter((l) => !l.parentId);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Navbar Manager</h1>
        <button
          onClick={() => openAddDialog()}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </button>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 text-sm font-medium">Order</th>
                <th className="text-left p-4 text-sm font-medium">Title</th>
                <th className="text-left p-4 text-sm font-medium">URL</th>
                <th className="text-left p-4 text-sm font-medium">Parent</th>
                <th className="text-left p-4 text-sm font-medium">Visible</th>
                <th className="text-right p-4 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parentLinks.map((link) => (
                <>
                  <tr key={link.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{link.sortOrder}</span>
                        <div className="flex flex-col ml-1">
                          <button
                            onClick={() => handleReorder(link.id, "up")}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleReorder(link.id, "down")}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-medium">{link.title}</td>
                    <td className="p-4 text-sm text-muted-foreground">{link.href}</td>
                    <td className="p-4 text-sm">-</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          link.isVisible
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {link.isVisible ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openAddDialog(link.id)}
                          className="p-2 hover:bg-muted rounded-md"
                          title="Add sublink"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditDialog(link)}
                          className="p-2 hover:bg-muted rounded-md"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(link.id)}
                          className="p-2 hover:bg-muted rounded-md text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {link.children?.map((child) => (
                    <tr key={child.id} className="border-b hover:bg-muted/50 bg-muted/20">
                      <td className="p-4 pl-12">
                        <div className="flex items-center gap-1">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{child.sortOrder}</span>
                          <div className="flex flex-col ml-1">
                            <button
                              onClick={() => handleReorder(child.id, "up")}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleReorder(child.id, "down")}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 pl-12 font-medium">
                        <span className="text-muted-foreground">└ </span>
                        {child.title}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">{child.href}</td>
                      <td className="p-4 text-sm">{link.title}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            child.isVisible
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {child.isVisible ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditDialog(child)}
                            className="p-2 hover:bg-muted rounded-md"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(child.id)}
                            className="p-2 hover:bg-muted rounded-md text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingLink ? "Edit Link" : "Add Link"}
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">URL *</label>
                <input
                  type="text"
                  value={form.href}
                  onChange={(e) => setForm((prev) => ({ ...prev, href: e.target.value }))}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Parent</label>
                <select
                  value={form.parentId}
                  onChange={(e) => setForm((prev) => ({ ...prev, parentId: e.target.value }))}
                  className="w-full rounded-md border px-3 py-2"
                >
                  <option value="">None (Top Level)</option>
                  {parentLinks.map((link) => (
                    <option key={link.id} value={link.id}>
                      {link.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort Order</label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))
                  }
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={form.isVisible}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, isVisible: e.target.checked }))
                  }
                />
                <label htmlFor="isVisible" className="text-sm font-medium">
                  Visible
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowDialog(false)}
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
