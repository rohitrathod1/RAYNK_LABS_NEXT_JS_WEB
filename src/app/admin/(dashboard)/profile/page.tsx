"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { ImageUpload } from "@/components/common/image-upload";
import { updateProfileAction } from "@/modules/profile/actions";
import type { ProfileData } from "@/modules/profile/types";

export const dynamic = "force-dynamic";

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: "bg-red-500",
  ADMIN: "bg-blue-500",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    bio: "",
    imageUrl: "",
    github: "",
    linkedin: "",
    instagram: "",
    youtube: "",
  });

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((r) => r.json())
      .then(({ success, data, error }) => {
        if (success) {
          setProfile(data);
          setForm({
            name: data.name || "",
            bio: data.bio || "",
            imageUrl: data.imageUrl || "",
            github: data.github || "",
            linkedin: data.linkedin || "",
            instagram: data.instagram || "",
            youtube: data.youtube || "",
          });
        } else {
          toast.error(error ?? "Failed to load profile");
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load profile");
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const result = await updateProfileAction(form);
    if (result.success) {
      toast.success("Profile updated!");
    } else {
      toast.error(result.error ?? "Failed to update profile");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <div className="p-6">Profile not found.</div>;
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Admin Profile</h1>

      {/* Profile Header Card */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Profile Image */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted ring-4 ring-primary/20 shrink-0">
            {profile.imageUrl ? (
              <Image
                src={profile.imageUrl}
                alt={profile.name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-primary/10 text-primary">
                {profile.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold truncate">{profile.name}</h2>
            <p className="text-muted-foreground mt-1">{profile.email}</p>
            <div className="flex items-center gap-3 mt-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${
                  profile.role === "SUPER_ADMIN" ? "bg-red-500 shadow-lg shadow-red-500/25" : "bg-blue-500 shadow-lg shadow-blue-500/25"
                }`}
              >
                {profile.role === "SUPER_ADMIN" ? "🛡️ Super Admin" : "👤 Admin"}
              </span>
              <span className="text-xs text-muted-foreground">
                Joined {new Date(profile.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Info Card */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Full Name</p>
            <p className="font-medium">{profile.name}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Email Address</p>
            <p className="font-medium">{profile.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Role</p>
            <p className={`font-medium ${
              profile.role === "SUPER_ADMIN" ? "text-red-500" : "text-blue-500"
            }`}>
              {profile.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Account Created</p>
            <p className="font-medium">
              {new Date(profile.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold">Edit Profile</h2>
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Bio</label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
            className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Profile Image</label>
          <ImageUpload
            value={form.imageUrl}
            onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
          />
        </div>
      </div>

      {/* Social Links */}
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-xl font-semibold">Social Links</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 2.214-.322 1.206 0 2.206.322 2.206.322.656 1.652.246 2.873.12 3.176.769.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </div>
            <input
              type="url"
              value={form.github}
              onChange={(e) => setForm((prev) => ({ ...prev, github: e.target.value }))}
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              placeholder="https://github.com/username"
            />
            {form.github && (
              <a href={form.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </div>
            <input
              type="url"
              value={form.linkedin}
              onChange={(e) => setForm((prev) => ({ ...prev, linkedin: e.target.value }))}
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              placeholder="https://linkedin.com/in/username"
            />
            {form.linkedin && (
              <a href={form.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </div>
            <input
              type="url"
              value={form.instagram}
              onChange={(e) => setForm((prev) => ({ ...prev, instagram: e.target.value }))}
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              placeholder="https://instagram.com/username"
            />
            {form.instagram && (
              <a href={form.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </div>
            <input
              type="url"
              value={form.youtube}
              onChange={(e) => setForm((prev) => ({ ...prev, youtube: e.target.value }))}
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
              placeholder="https://youtube.com/@username"
            />
            {form.youtube && (
              <a href={form.youtube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition shadow-lg shadow-primary/25"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>
    </div>
  );
}
