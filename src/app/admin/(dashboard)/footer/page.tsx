"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Save, Loader2, Plus, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/common/image-upload";
import { hasPermission } from "@/lib/permissions";
import {
  updateFooterSettings,
  addFooterSection,
  editFooterSection,
  removeFooterSection,
  addFooterLink,
  editFooterLink,
  removeFooterLink,
} from "@/modules/footer/actions";
import type { FooterData, FooterSection, FooterLink } from "@/modules/footer/types";

export default function FooterManager() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session && !hasPermission(session, "MANAGE_FOOTER")) {
      router.push("/admin");
    }
  }, [session, router]);

  const [footerData, setFooterData] = useState<FooterData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Settings form
  const [settings, setSettings] = useState({
    logo: "",
    description: "",
    address: "",
    email: "",
    phone: "",
    copyright: "",
  });

  // Section dialog
  const [showSectionDialog, setShowSectionDialog] = useState(false);
  const [editingSection, setEditingSection] = useState<FooterSection | null>(null);
  const [sectionForm, setSectionForm] = useState({ title: "", sortOrder: 0, isActive: true });

  // Link dialog
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [editingLink, setEditingLink] = useState<FooterLink | null>(null);
  const [linkForm, setLinkForm] = useState({ label: "", href: "", sectionId: "", sortOrder: 0 });

  useEffect(() => {
    fetch("/api/admin/footer")
      .then((r) => r.json())
      .then(({ data }: { data: FooterData }) => {
        setFooterData(data);
        if (data.settings) {
          setSettings({
            logo: data.settings.logo || "",
            description: data.settings.description || "",
            address: data.settings.address || "",
            email: data.settings.email || "",
            phone: data.settings.phone || "",
            copyright: data.settings.copyright || "",
          });
        }
        setLoadingData(false);
      })
      .catch(() => {
        toast.error("Failed to load footer data");
        setLoadingData(false);
      });
  }, []);

  const handleSaveSettings = async () => {
    setLoading(true);
    const result = await updateFooterSettings(settings);
    if (result?.success) {
      toast.success("Settings saved!");
    } else {
      toast.error(result?.error ?? "Failed to save");
    }
    setLoading(false);
  };

  const openAddSectionDialog = () => {
    setEditingSection(null);
    setSectionForm({ title: "", sortOrder: footerData?.sections.length || 0, isActive: true });
    setShowSectionDialog(true);
  };

  const openEditSectionDialog = (section: FooterSection) => {
    setEditingSection(section);
    setSectionForm({
      title: section.title,
      sortOrder: section.sortOrder,
      isActive: section.isActive,
    });
    setShowSectionDialog(true);
  };

  const handleSaveSection = async () => {
    if (!sectionForm.title) {
      toast.error("Title is required");
      return;
    }
    setLoading(true);
    const result = editingSection
      ? await editFooterSection(editingSection.id, sectionForm)
      : await addFooterSection(sectionForm);
    if (result?.success) {
      toast.success(editingSection ? "Section updated!" : "Section added!");
      setShowSectionDialog(false);
      // Reload data
      const res = await fetch("/api/admin/footer");
      const data = await res.json();
      setFooterData(data.data);
    } else {
      toast.error(result?.error ?? "Failed to save");
    }
    setLoading(false);
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm("Delete this section and all its links?")) return;
    const result = await removeFooterSection(id);
    if (result?.success) {
      toast.success("Section deleted!");
      const res = await fetch("/api/admin/footer");
      const data = await res.json();
      setFooterData(data.data);
    } else {
      toast.error(result?.error ?? "Failed to delete");
    }
  };

  const openAddLinkDialog = (sectionId: string) => {
    setEditingLink(null);
    setLinkForm({ label: "", href: "", sectionId, sortOrder: 0 });
    setShowLinkDialog(true);
  };

  const openEditLinkDialog = (link: FooterLink) => {
    setEditingLink(link);
    setLinkForm({
      label: link.label,
      href: link.href,
      sectionId: link.sectionId,
      sortOrder: link.sortOrder,
    });
    setShowLinkDialog(true);
  };

  const handleSaveLink = async () => {
    if (!linkForm.label || !linkForm.href) {
      toast.error("Label and URL are required");
      return;
    }
    setLoading(true);
    const result = editingLink
      ? await editFooterLink(editingLink.id, linkForm)
      : await addFooterLink(linkForm);
    if (result?.success) {
      toast.success(editingLink ? "Link updated!" : "Link added!");
      setShowLinkDialog(false);
      const res = await fetch("/api/admin/footer");
      const data = await res.json();
      setFooterData(data.data);
    } else {
      toast.error(result?.error ?? "Failed to save");
    }
    setLoading(false);
  };

  const handleDeleteLink = async (id: string) => {
    if (!confirm("Delete this link?")) return;
    const result = await removeFooterLink(id);
    if (result?.success) {
      toast.success("Link deleted!");
      const res = await fetch("/api/admin/footer");
      const data = await res.json();
      setFooterData(data.data);
    } else {
      toast.error(result?.error ?? "Failed to delete");
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Footer Manager</h1>
          <p className="text-muted-foreground mt-1">Manage footer sections, links, and settings</p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground rounded-lg font-medium transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Settings
            </>
          )}
        </button>
      </div>

      {/* Settings */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h2 className="text-xl font-semibold">Settings</h2>
        <div>
          <label className="block text-sm font-medium mb-1.5">Logo</label>
          <ImageUpload
            value={settings.logo}
            onChange={(v) => setSettings((prev) => ({ ...prev, logo: v }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <textarea
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
            rows={3}
            value={settings.description}
            onChange={(e) => setSettings((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              value={settings.email}
              onChange={(e) => setSettings((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Phone</label>
            <input
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              value={settings.phone}
              onChange={(e) => setSettings((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Address</label>
          <input
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
            value={settings.address}
            onChange={(e) => setSettings((prev) => ({ ...prev, address: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Copyright</label>
          <input
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
            value={settings.copyright}
            onChange={(e) => setSettings((prev) => ({ ...prev, copyright: e.target.value }))}
            placeholder="© 2026 RaYnk Labs"
          />
        </div>
      </div>

      {/* Sections */}
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Sections</h2>
          <button
            onClick={openAddSectionDialog}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium text-sm transition"
          >
            <Plus className="w-4 h-4" /> Add Section
          </button>
        </div>

        {!footerData?.sections || footerData.sections.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No sections yet. Click "Add Section" to create one.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {footerData.sections.map((section) => (
              <div key={section.id} className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{section.title}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${section.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {section.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditSectionDialog(section)}
                      className="p-1.5 rounded hover:bg-muted transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="p-1.5 rounded hover:bg-muted transition text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Links in section */}
                <div className="ml-4 space-y-2">
                  {section.links?.map((link) => (
                    <div key={link.id} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                      <div>
                        <span className="text-sm font-medium">{link.label}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{link.href}</span>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditLinkDialog(link)}
                          className="p-1 rounded hover:bg-muted transition"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="p-1 rounded hover:bg-muted transition text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => openAddLinkDialog(section.id)}
                    className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                  >
                    <Plus className="w-3 h-3" /> Add Link
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section Dialog */}
      {showSectionDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-card rounded-xl border border-border shadow-xl">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold">
                {editingSection ? "Edit Section" : "Add Section"}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Title *</label>
                <input
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={sectionForm.title}
                  onChange={(e) => setSectionForm((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Sort Order</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={sectionForm.sortOrder}
                  onChange={(e) => setSectionForm((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sectionForm.isActive}
                  onChange={(e) => setSectionForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => setShowSectionDialog(false)}
                className="px-4 py-2 text-sm font-medium rounded-md border border-input hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSection}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary hover:bg-primary/90 text-primary-foreground transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingSection ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-card rounded-xl border border-border shadow-xl">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold">
                {editingLink ? "Edit Link" : "Add Link"}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Label *</label>
                <input
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={linkForm.label}
                  onChange={(e) => setLinkForm((prev) => ({ ...prev, label: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">URL *</label>
                <input
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={linkForm.href}
                  onChange={(e) => setLinkForm((prev) => ({ ...prev, href: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Sort Order</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  value={linkForm.sortOrder}
                  onChange={(e) => setLinkForm((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => setShowLinkDialog(false)}
                className="px-4 py-2 text-sm font-medium rounded-md border border-input hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLink}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-primary hover:bg-primary/90 text-primary-foreground transition disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingLink ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
