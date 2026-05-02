"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Save, Loader2, Plus, Trash2, Pencil } from "lucide-react";
import { hasPermission } from "@/lib/permissions";
import { toast } from "sonner";
import { ImageUpload } from "@/components/common/image-upload";
import { SafeImage } from "@/components/common/safe-image";
import {
  updateTeamHero,
  updateTeamIntro,
  updateTeamFounders,
  updateTeamMembersSection,
  updateTeamValues,
  updateTeamCta,
  addTeamMember,
  editTeamMember,
  removeTeamMember,
  updateTeamSeo,
} from "@/modules/team/actions";
import type { TeamPageData, TeamMemberInput } from "@/modules/team/types";
import { defaultTeamContent } from "@/modules/team/data/defaults";

const TABS = [
  "hero",
  "intro",
  "founders",
  "team_members",
  "values",
  "contact_cta",
  "team_members_list",
  "seo",
] as const;
type Tab = (typeof TABS)[number];

type FormData = TeamPageData & {
  seo: { title: string; description: string; keywords: string; ogImage: string; noIndex: boolean };
  team_members_list?: never; // This tab doesn't have form data, it's for the member list
};

const TAB_LABELS: Record<Tab, string> = {
  hero: "Hero",
  intro: "Intro",
  founders: "Founders",
  team_members: "Team Section",
  values: "Values",
  contact_cta: "CTA",
  team_members_list: "Team Members",
  seo: "SEO",
};

interface TeamMember extends TeamMemberInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export default function TeamPageManager() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session && !hasPermission(session, "MANAGE_TEAM")) {
      router.push("/admin");
    }
  }, [session, router]);

  const [activeTab, setActiveTab] = useState<Tab>("hero");
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showMemberDialog, setShowMemberDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberForm, setMemberForm] = useState<Partial<TeamMemberInput>>({});

  useEffect(() => {
    fetch("/api/admin/team")
      .then((r) => r.json())
      .then(({ data }: { data: { sections: Partial<FormData>; teamMembers: TeamMember[] } }) => {
        setFormData({
          hero: { ...defaultTeamContent.hero, ...(data?.sections?.hero ?? {}) },
          intro: { ...defaultTeamContent.intro, ...(data?.sections?.intro ?? {}) },
          founders: { ...defaultTeamContent.founders, ...(data?.sections?.founders ?? {}) },
          team_members: { ...defaultTeamContent.team_members, ...(data?.sections?.team_members ?? {}) },
          values: { ...defaultTeamContent.values, ...(data?.sections?.values ?? {}) },
          contact_cta: { ...defaultTeamContent.contact_cta, ...(data?.sections?.contact_cta ?? {}) },
          seo: {
            title: "",
            description: "",
            keywords: "",
            ogImage: "",
            noIndex: false,
            ...((data as unknown as Partial<FormData>)?.seo ?? {}),
          },
        });
        setTeamMembers(data?.teamMembers ?? []);
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
    const actionMap: Record<Exclude<Tab, "team_members_list">, ActionFn> = {
      hero: (d) => updateTeamHero(d),
      intro: (d) => updateTeamIntro(d),
      founders: (d) => updateTeamFounders(d),
      team_members: (d) => updateTeamMembersSection(d),
      values: (d) => updateTeamValues(d),
      contact_cta: (d) => updateTeamCta(d),
      seo: (d) => updateTeamSeo(d),
    };
    const result = await actionMap[activeTab as Exclude<Tab, "team_members_list">]?.(formData[activeTab]);
    if (result?.success) toast.success("Saved successfully!");
    else toast.error(result?.error ?? "Failed to save");
    setLoading(false);
  }

  function openAddMemberDialog() {
    setEditingMember(null);
    setMemberForm({});
    setShowMemberDialog(true);
  }

  function openEditMemberDialog(member: TeamMember) {
    setEditingMember(member);
    setMemberForm({
      name: member.name,
      role: member.role,
      bio: member.bio,
      image: member.image,
      linkedin: member.linkedin,
      twitter: member.twitter,
      github: member.github,
      portfolio: member.portfolio,
      isActive: member.isActive,
      sortOrder: member.sortOrder,
    });
    setShowMemberDialog(true);
  }

  async function handleSaveMember() {
    if (!memberForm.name || !memberForm.role || !memberForm.image) {
      toast.error("Name, role, and image are required");
      return;
    }

    setLoading(true);
    const result = editingMember
      ? await editTeamMember(editingMember.id, memberForm)
      : await addTeamMember(memberForm);

    if (result.success) {
      toast.success(editingMember ? "Member updated!" : "Member added!");
      setShowMemberDialog(false);
      // Refresh members list
      const res = await fetch("/api/admin/team/member");
      const { data } = await res.json();
      setTeamMembers(data ?? []);
    } else {
      toast.error(result.error ?? "Failed to save member");
    }
    setLoading(false);
  }

  async function handleDeleteMember(id: string) {
    if (!confirm("Are you sure you want to delete this member?")) return;
    setLoading(true);
    const result = await removeTeamMember(id);
    if (result.success) {
      toast.success("Member deleted!");
      setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    } else {
      toast.error(result.error ?? "Failed to delete member");
    }
    setLoading(false);
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Team Page Manager</h1>
      </div>

      <div className="flex gap-2 flex-wrap border-b">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      <div className="rounded-lg border bg-card p-6">
        {activeTab === "hero" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Hero Section</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                value={formData.hero?.title ?? ""}
                onChange={(e) => update("hero", { title: e.target.value })}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle</label>
              <textarea
                value={formData.hero?.subtitle ?? ""}
                onChange={(e) => update("hero", { subtitle: e.target.value })}
                className="w-full rounded-md border px-3 py-2"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Background Image</label>
              <ImageUpload
                value={formData.hero?.backgroundImage ?? ""}
                onChange={(url) => update("hero", { backgroundImage: url })}
              />
            </div>
          </div>
        )}

        {activeTab === "intro" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Intro Section</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                value={formData.intro?.description ?? ""}
                onChange={(e) => update("intro", { description: e.target.value })}
                className="w-full rounded-md border px-3 py-2"
                rows={6}
              />
            </div>
          </div>
        )}

        {activeTab === "founders" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Founders Section</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                value={formData.founders?.title ?? ""}
                onChange={(e) => update("founders", { title: e.target.value })}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle</label>
              <input
                type="text"
                value={formData.founders?.subtitle ?? ""}
                onChange={(e) => update("founders", { subtitle: e.target.value })}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium">Founders</label>
              {(formData.founders?.founders ?? []).map((founder: { name: string; role: string; image: string; bio: string; portfolioUrl?: string }, index: number) => (
                <div key={index} className="space-y-2 p-4 border rounded-md">
                  <input
                    type="text"
                    placeholder="Name"
                    value={founder.name}
                    onChange={(e) => {
                      const updated = [...(formData.founders?.founders ?? [])];
                      updated[index] = { ...updated[index], name: e.target.value };
                      update("founders", { founders: updated });
                    }}
                    className="w-full rounded-md border px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    value={founder.role}
                    onChange={(e) => {
                      const updated = [...(formData.founders?.founders ?? [])];
                      updated[index] = { ...updated[index], role: e.target.value };
                      update("founders", { founders: updated });
                    }}
                    className="w-full rounded-md border px-3 py-2"
                  />
                  <textarea
                    placeholder="Bio"
                    value={founder.bio}
                    onChange={(e) => {
                      const updated = [...(formData.founders?.founders ?? [])];
                      updated[index] = { ...updated[index], bio: e.target.value };
                      update("founders", { founders: updated });
                    }}
                    className="w-full rounded-md border px-3 py-2"
                    rows={3}
                  />
                  <ImageUpload
                    value={founder.image}
                    onChange={(url) => {
                      const updated = [...(formData.founders?.founders ?? [])];
                      updated[index] = { ...updated[index], image: url };
                      update("founders", { founders: updated });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "team_members" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Team Members Section</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                value={formData.team_members?.title ?? ""}
                onChange={(e) => update("team_members", { title: e.target.value })}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle</label>
              <textarea
                value={formData.team_members?.subtitle ?? ""}
                onChange={(e) => update("team_members", { subtitle: e.target.value })}
                className="w-full rounded-md border px-3 py-2"
                rows={3}
              />
            </div>
          </div>
        )}

        {activeTab === "values" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Values Section</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                value={formData.values?.title ?? ""}
                onChange={(e) => update("values", { title: e.target.value })}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle</label>
              <input
                type="text"
                value={formData.values?.subtitle ?? ""}
                onChange={(e) => update("values", { subtitle: e.target.value })}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium">Value Points</label>
              {(formData.values?.points ?? []).map((point: { icon: string; title: string; description: string }, index: number) => (
                <div key={index} className="space-y-2 p-4 border rounded-md">
                  <input
                    type="text"
                    placeholder="Icon"
                    value={point.icon}
                    onChange={(e) => {
                      const updated = [...(formData.values?.points ?? [])];
                      updated[index] = { ...updated[index], icon: e.target.value };
                      update("values", { points: updated });
                    }}
                    className="w-full rounded-md border px-3 py-2"
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={point.title}
                    onChange={(e) => {
                      const updated = [...(formData.values?.points ?? [])];
                      updated[index] = { ...updated[index], title: e.target.value };
                      update("values", { points: updated });
                    }}
                    className="w-full rounded-md border px-3 py-2"
                  />
                  <textarea
                    placeholder="Description"
                    value={point.description}
                    onChange={(e) => {
                      const updated = [...(formData.values?.points ?? [])];
                      updated[index] = { ...updated[index], description: e.target.value };
                      update("values", { points: updated });
                    }}
                    className="w-full rounded-md border px-3 py-2"
                    rows={2}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "contact_cta" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Contact CTA Section</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                value={formData.contact_cta?.title ?? ""}
                onChange={(e) => update("contact_cta", { title: e.target.value })}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle</label>
              <textarea
                value={formData.contact_cta?.subtitle ?? ""}
                onChange={(e) => update("contact_cta", { subtitle: e.target.value })}
                className="w-full rounded-md border px-3 py-2"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Button Text</label>
              <input
                type="text"
                value={formData.contact_cta?.buttonText ?? ""}
                onChange={(e) => update("contact_cta", { buttonText: e.target.value })}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Button Link</label>
              <input
                type="text"
                value={formData.contact_cta?.buttonLink ?? ""}
                onChange={(e) => update("contact_cta", { buttonLink: e.target.value })}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
          </div>
        )}

        {activeTab === "team_members_list" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Team Members</h2>
              <button
                onClick={openAddMemberDialog}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </button>
            </div>

            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-md">
                  <div className="flex items-center gap-4">
                    <SafeImage
                      src={member.image}
                      alt={member.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditMemberDialog(member)}
                      className="p-2 hover:bg-muted rounded-md"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="p-2 hover:bg-muted rounded-md text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">SEO Settings</h2>
            <div className="space-y-2">
              <label className="text-sm font-medium">Meta Title</label>
              <input
                type="text"
                value={formData.seo?.title ?? ""}
                onChange={(e) => update("seo", { title: e.target.value })}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Meta Description</label>
              <textarea
                value={formData.seo?.description ?? ""}
                onChange={(e) => update("seo", { description: e.target.value })}
                className="w-full rounded-md border px-3 py-2"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Keywords</label>
              <input
                type="text"
                value={formData.seo?.keywords ?? ""}
                onChange={(e) => update("seo", { keywords: e.target.value })}
                className="w-full rounded-md border px-3 py-2"
                placeholder="Comma-separated keywords"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">OG Image</label>
              <ImageUpload
                value={formData.seo?.ogImage ?? ""}
                onChange={(url) => update("seo", { ogImage: url })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="noIndex"
                checked={formData.seo?.noIndex ?? false}
                onChange={(e) => update("seo", { noIndex: e.target.checked })}
              />
              <label htmlFor="noIndex" className="text-sm font-medium">
                No Index
              </label>
            </div>
          </div>
        )}

        {activeTab !== "team_members_list" && (
          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
          </div>
        )}
      </div>

      {showMemberDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingMember ? "Edit Member" : "Add Member"}
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <input
                  type="text"
                  value={memberForm.name ?? ""}
                  onChange={(e) => setMemberForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Role *</label>
                <input
                  type="text"
                  value={memberForm.role ?? ""}
                  onChange={(e) => setMemberForm((prev) => ({ ...prev, role: e.target.value }))}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <textarea
                  value={memberForm.bio ?? ""}
                  onChange={(e) => setMemberForm((prev) => ({ ...prev, bio: e.target.value }))}
                  className="w-full rounded-md border px-3 py-2"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Image *</label>
                <ImageUpload
                  value={memberForm.image ?? ""}
                  onChange={(url) => setMemberForm((prev) => ({ ...prev, image: url }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">LinkedIn</label>
                <input
                  type="text"
                  value={memberForm.linkedin ?? ""}
                  onChange={(e) => setMemberForm((prev) => ({ ...prev, linkedin: e.target.value }))}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Twitter</label>
                <input
                  type="text"
                  value={memberForm.twitter ?? ""}
                  onChange={(e) => setMemberForm((prev) => ({ ...prev, twitter: e.target.value }))}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">GitHub</label>
                <input
                  type="text"
                  value={memberForm.github ?? ""}
                  onChange={(e) => setMemberForm((prev) => ({ ...prev, github: e.target.value }))}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Portfolio</label>
                <input
                  type="text"
                  value={memberForm.portfolio ?? ""}
                  onChange={(e) => setMemberForm((prev) => ({ ...prev, portfolio: e.target.value }))}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort Order</label>
                <input
                  type="number"
                  value={memberForm.sortOrder ?? 0}
                  onChange={(e) => setMemberForm((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                  className="w-full rounded-md border px-3 py-2"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={memberForm.isActive ?? true}
                  onChange={(e) => setMemberForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Active
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowMemberDialog(false)}
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMember}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
