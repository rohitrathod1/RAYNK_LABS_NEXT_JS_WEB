"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Save,
  Search,
  Shield,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { hasPermission } from "@/lib/permissions";
import { ImageUpload } from "@/components/common/image-upload";
import { SafeImage } from "@/components/common/safe-image";
import {
  updateTeamHero,
  updateTeamIntro,
  updateTeamFounders,
  updateTeamMembersSection,
  updateTeamValues,
  updateTeamCta,
  updateTeamSeo,
} from "@/modules/team/actions";
import type { TeamPageData, TeamMemberInput } from "@/modules/team/types";
import { defaultTeamContent } from "@/modules/team/data/defaults";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Skeleton,
  Textarea,
} from "@/components/ui";

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

interface TeamMemberCard {
  id: string;
  displayName: string;
  role: string;
  bio: string | null;
  avatar: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  email: string | null;
  status: string | null;
  isVisible: boolean;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

type Filter = "all" | "visible" | "hidden" | "featured";

const EMPTY_SEO = { title: "", description: "", keywords: "", ogImage: "", noIndex: false };

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function roleLabel(role: string) {
  return role === "SUPER_ADMIN" ? "Super Admin" : "Admin";
}

export default function TeamPageManager() {
  const router = useRouter();
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  useEffect(() => {
    if (session && !hasPermission(session, "MANAGE_TEAM")) {
      router.replace("/admin");
    }
  }, [session, router]);

  const [activeTab, setActiveTab] = useState<Tab>("hero");
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMemberCard[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editingMember, setEditingMember] = useState<TeamMemberCard | null>(null);
  const [memberForm, setMemberForm] = useState<TeamMemberInput>({
    displayName: "",
    bio: "",
    avatar: "",
    githubUrl: "",
    linkedinUrl: "",
    instagramUrl: "",
    youtubeUrl: "",
    isVisible: true,
    isFeatured: false,
  });

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [adminRes, membersRes] = await Promise.all([
        fetch("/api/admin/team", { cache: "no-store" }),
        fetch("/api/team?all=true", { cache: "no-store" }),
      ]);
      const adminJson = await adminRes.json();
      const membersJson = await membersRes.json();

      if (!adminJson.success) throw new Error(adminJson.error ?? "Failed to load sections");
      if (!membersJson.success) throw new Error(membersJson.error ?? "Failed to load team members");

      const sections = adminJson.data?.sections ?? {};
      setFormData({
        hero: { ...defaultTeamContent.hero, ...(sections.hero ?? {}) },
        intro: { ...defaultTeamContent.intro, ...(sections.intro ?? {}) },
        founders: { ...defaultTeamContent.founders, ...(sections.founders ?? {}) },
        team_members: { ...defaultTeamContent.team_members, ...(sections.team_members ?? {}) },
        values: { ...defaultTeamContent.values, ...(sections.values ?? {}) },
        contact_cta: { ...defaultTeamContent.contact_cta, ...(sections.contact_cta ?? {}) },
        seo: EMPTY_SEO,
      });
      setTeamMembers(membersJson.data?.teamMembers ?? []);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load team data");
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchData();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [fetchData]);

  function update<K extends keyof FormData>(section: K, patch: Partial<FormData[K]>) {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as object), ...patch },
    }));
  }

  async function handleSave() {
    if (activeTab === "team_members_list") return;
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
    const tab = activeTab as Exclude<Tab, "team_members_list">;
    const result = await actionMap[tab]?.(formData[tab]);
    if (result?.success) toast.success("Saved successfully");
    else toast.error(result?.error ?? "Failed to save");
    setLoading(false);
  }

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        member.displayName.toLowerCase().includes(q) ||
        member.email?.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q);
      const matchesFilter =
        filter === "all" ||
        (filter === "visible" && member.isVisible) ||
        (filter === "hidden" && !member.isVisible) ||
        (filter === "featured" && member.isFeatured);
      return matchesSearch && matchesFilter;
    });
  }, [filter, search, teamMembers]);

  function openEditMember(member: TeamMemberCard) {
    setEditingMember(member);
    setMemberForm({
      displayName: member.displayName,
      role: member.role,
      bio: member.bio ?? "",
      avatar: member.avatar ?? "",
      githubUrl: member.githubUrl ?? "",
      linkedinUrl: member.linkedinUrl ?? "",
      instagramUrl: member.instagramUrl ?? "",
      youtubeUrl: member.youtubeUrl ?? "",
      isVisible: member.isVisible,
      isFeatured: member.isFeatured,
    });
  }

  async function saveMember() {
    if (!editingMember) return;
    if (!memberForm.displayName) {
      toast.error("Display name is required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/team/${editingMember.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(memberForm),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Failed to save team member");

      toast.success("Team member updated");
      setEditingMember(null);
      await fetchData();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save team member");
    } finally {
      setLoading(false);
    }
  }

  async function patchMember(member: TeamMemberCard, patch: Partial<TeamMemberInput>) {
    const payload: TeamMemberInput = {
      displayName: member.displayName,
      role: member.role,
      bio: member.bio ?? "",
      avatar: member.avatar ?? "",
      githubUrl: member.githubUrl ?? "",
      linkedinUrl: member.linkedinUrl ?? "",
      instagramUrl: member.instagramUrl ?? "",
      youtubeUrl: member.youtubeUrl ?? "",
      isVisible: member.isVisible,
      isFeatured: member.isFeatured,
      ...patch,
    };

    const res = await fetch(`/api/team/${member.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error ?? "Update failed");
    await fetchData();
    router.refresh();
  }

  async function toggleVisibility(member: TeamMemberCard) {
    try {
      await patchMember(member, { isVisible: !member.isVisible });
      toast.success(member.isVisible ? "Team card hidden" : "Team card visible");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Visibility update failed");
    }
  }

  async function deleteMember(member: TeamMemberCard) {
    if (!confirm(`Delete the team card for ${member.displayName}? The admin account is not deleted.`)) return;
    try {
      const res = await fetch(`/api/team/${member.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Delete failed");
      toast.success("Team card deleted");
      await fetchData();
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (loadingData) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-72" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-80 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
            <Users className="h-4 w-4" /> Team
          </div>
          <h1 className="text-2xl font-bold">Team Page Manager</h1>
          <p className="text-sm text-muted-foreground">Team cards are synced from Admin users and profile data.</p>
        </div>
      </div>

      <div className="scrollbar-hide flex gap-2 overflow-x-auto border-b">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`shrink-0 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-sm">
        {activeTab === "team_members_list" ? (
          <TeamMembersAdmin
            search={search}
            setSearch={setSearch}
            filter={filter}
            setFilter={setFilter}
            members={filteredMembers}
            allCount={teamMembers.length}
            onEdit={openEditMember}
            onToggleVisibility={toggleVisibility}
            onDelete={deleteMember}
            canManageCards={isSuperAdmin}
          />
        ) : (
          <ContentEditor
            activeTab={activeTab as Exclude<Tab, "team_members_list">}
            formData={formData}
            update={update}
            handleSave={handleSave}
            loading={loading}
          />
        )}
      </div>

      <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              This edits the public-safe team card synced from the admin profile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Display name</Label>
              <Input
                value={memberForm.displayName}
                onChange={(e) => setMemberForm((prev) => ({ ...prev, displayName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                rows={4}
                value={memberForm.bio ?? ""}
                onChange={(e) => setMemberForm((prev) => ({ ...prev, bio: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Avatar</Label>
              <ImageUpload
                value={memberForm.avatar ?? ""}
                onChange={(url) => setMemberForm((prev) => ({ ...prev, avatar: url }))}
                onRemove={() => setMemberForm((prev) => ({ ...prev, avatar: "" }))}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <SocialInput label="GitHub" value={memberForm.githubUrl ?? ""} onChange={(value) => setMemberForm((prev) => ({ ...prev, githubUrl: value }))} />
              <SocialInput label="LinkedIn" value={memberForm.linkedinUrl ?? ""} onChange={(value) => setMemberForm((prev) => ({ ...prev, linkedinUrl: value }))} />
              <SocialInput label="Instagram" value={memberForm.instagramUrl ?? ""} onChange={(value) => setMemberForm((prev) => ({ ...prev, instagramUrl: value }))} />
              <SocialInput label="YouTube" value={memberForm.youtubeUrl ?? ""} onChange={(value) => setMemberForm((prev) => ({ ...prev, youtubeUrl: value }))} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <ToggleButton
                active={!!memberForm.isVisible}
                onClick={() => setMemberForm((prev) => ({ ...prev, isVisible: !prev.isVisible }))}
                activeLabel="Visible"
                inactiveLabel="Hidden"
              />
              <ToggleButton
                active={!!memberForm.isFeatured}
                onClick={() => setMemberForm((prev) => ({ ...prev, isFeatured: !prev.isFeatured }))}
                activeLabel="Featured"
                inactiveLabel="Not featured"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingMember(null)}>Cancel</Button>
            <Button onClick={saveMember} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TeamMembersAdmin({
  search,
  setSearch,
  filter,
  setFilter,
  members,
  allCount,
  onEdit,
  onToggleVisibility,
  onDelete,
  canManageCards,
}: {
  search: string;
  setSearch: (value: string) => void;
  filter: Filter;
  setFilter: (value: Filter) => void;
  members: TeamMemberCard[];
  allCount: number;
  onEdit: (member: TeamMemberCard) => void;
  onToggleVisibility: (member: TeamMemberCard) => void;
  onDelete: (member: TeamMemberCard) => void;
  canManageCards: boolean;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-bold">Team Members</h2>
          <p className="text-sm text-muted-foreground">{allCount} admin-synced team cards</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search team..." className="pl-9" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {(["all", "visible", "hidden", "featured"] as Filter[]).map((item) => (
              <Button
                key={item}
                variant={filter === item ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(item)}
                className="shrink-0 capitalize"
              >
                {item}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {members.length === 0 ? (
        <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">
          No team cards match the current filters.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {members.map((member) => (
            <article
              key={member.id}
              className="group overflow-hidden rounded-xl border bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
            >
              <div className="relative h-44 bg-muted">
                {member.avatar ? (
                  <SafeImage src={member.avatar} alt={member.displayName} fill sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-primary/10 text-4xl font-bold text-primary">
                    {initials(member.displayName)}
                  </div>
                )}
                <div className="absolute left-3 top-3 flex gap-2">
                  <Badge className={member.isVisible ? "bg-green-500/20 text-green-600" : "bg-muted text-muted-foreground"}>
                    {member.isVisible ? "Visible" : "Hidden"}
                  </Badge>
                  {member.isFeatured && (
                    <Badge className="bg-amber-500/20 text-amber-600">
                      <Star className="mr-1 h-3 w-3" /> Featured
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-4 p-4">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold">{member.displayName}</h3>
                      <p className="truncate text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      <Shield className="mr-1 h-3 w-3" />
                      {roleLabel(member.role)}
                    </Badge>
                  </div>
                  <p className="mt-3 line-clamp-3 min-h-[3.75rem] text-sm text-muted-foreground">
                    {member.bio || "No bio added yet."}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <SocialLink href={member.githubUrl} title="GitHub" icon={<BrandIcon name="github" />} />
                  <SocialLink href={member.linkedinUrl} title="LinkedIn" icon={<BrandIcon name="linkedin" />} />
                  <SocialLink href={member.instagramUrl} title="Instagram" icon={<BrandIcon name="instagram" />} />
                  <SocialLink href={member.youtubeUrl} title="YouTube" icon={<BrandIcon name="youtube" />} />
                </div>

                <div className="flex items-center justify-between gap-2 border-t pt-3">
                  <div className="text-xs text-muted-foreground">
                    Status: <span className="font-medium">{member.status ?? "Synced"}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" title="View profile" asChild>
                      <a href={`/team#${member.id}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    {canManageCards && (
                      <>
                        <Button variant="ghost" size="icon" title={member.isVisible ? "Hide" : "Unhide"} onClick={() => onToggleVisibility(member)}>
                          {member.isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" title="Edit" onClick={() => onEdit(member)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete" onClick={() => onDelete(member)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function ContentEditor({
  activeTab,
  formData,
  update,
  handleSave,
  loading,
}: {
  activeTab: Exclude<Tab, "team_members_list">;
  formData: Partial<FormData>;
  update: <K extends keyof FormData>(section: K, patch: Partial<FormData[K]>) => void;
  handleSave: () => void;
  loading: boolean;
}) {
  return (
    <div className="space-y-4">
      {activeTab === "hero" && (
        <>
          <Field label="Title" value={formData.hero?.title ?? ""} onChange={(value) => update("hero", { title: value })} />
          <TextField label="Subtitle" value={formData.hero?.subtitle ?? ""} onChange={(value) => update("hero", { subtitle: value })} />
          <ImageUpload value={formData.hero?.backgroundImage ?? ""} onChange={(url) => update("hero", { backgroundImage: url })} />
        </>
      )}
      {activeTab === "intro" && (
        <TextField label="Description" rows={6} value={formData.intro?.description ?? ""} onChange={(value) => update("intro", { description: value })} />
      )}
      {activeTab === "team_members" && (
        <>
          <Field label="Title" value={formData.team_members?.title ?? ""} onChange={(value) => update("team_members", { title: value })} />
          <TextField label="Subtitle" value={formData.team_members?.subtitle ?? ""} onChange={(value) => update("team_members", { subtitle: value })} />
        </>
      )}
      {activeTab === "contact_cta" && (
        <>
          <Field label="Title" value={formData.contact_cta?.title ?? ""} onChange={(value) => update("contact_cta", { title: value })} />
          <TextField label="Subtitle" value={formData.contact_cta?.subtitle ?? ""} onChange={(value) => update("contact_cta", { subtitle: value })} />
          <Field label="Button text" value={formData.contact_cta?.buttonText ?? ""} onChange={(value) => update("contact_cta", { buttonText: value })} />
          <Field label="Button link" value={formData.contact_cta?.buttonLink ?? ""} onChange={(value) => update("contact_cta", { buttonLink: value })} />
        </>
      )}
      {activeTab === "seo" && (
        <>
          <Field label="Meta title" value={formData.seo?.title ?? ""} onChange={(value) => update("seo", { title: value })} />
          <TextField label="Meta description" value={formData.seo?.description ?? ""} onChange={(value) => update("seo", { description: value })} />
          <Field label="Keywords" value={formData.seo?.keywords ?? ""} onChange={(value) => update("seo", { keywords: value })} />
          <ImageUpload value={formData.seo?.ogImage ?? ""} onChange={(url) => update("seo", { ogImage: url })} />
        </>
      )}
      {(activeTab === "founders" || activeTab === "values") && (
        <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
          This structured section is still managed from seeded content. Team member cards below sync from Admin users.
        </div>
      )}
      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save
        </Button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function TextField({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (value: string) => void; rows?: number }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Textarea value={value} rows={rows} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function SocialInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={`https://${label.toLowerCase()}.com/...`} />
    </div>
  );
}

function ToggleButton({ active, onClick, activeLabel, inactiveLabel }: { active: boolean; onClick: () => void; activeLabel: string; inactiveLabel: string }) {
  return (
    <Button type="button" variant={active ? "default" : "secondary"} onClick={onClick}>
      {active ? activeLabel : inactiveLabel}
    </Button>
  );
}

function SocialLink({ href, title, icon }: { href?: string | null; title: string; icon: React.ReactNode }) {
  if (!href) {
    return (
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border text-muted-foreground/30" title={`${title} not set`}>
        {icon}
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border text-muted-foreground transition hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
      title={title}
    >
      {icon}
    </a>
  );
}

function BrandIcon({ name }: { name: "github" | "linkedin" | "instagram" | "youtube" }) {
  const paths = {
    github:
      "M12 .5A11.5 11.5 0 0 0 8.36 22.9c.58.1.79-.25.79-.56v-2.14c-3.23.7-3.91-1.37-3.91-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.58-.3-5.29-1.29-5.29-5.74 0-1.27.45-2.3 1.2-3.12-.12-.29-.52-1.47.11-3.07 0 0 .98-.31 3.17 1.19a10.95 10.95 0 0 1 5.76 0c2.19-1.5 3.17-1.19 3.17-1.19.63 1.6.23 2.78.11 3.07.75.82 1.2 1.85 1.2 3.12 0 4.46-2.72 5.44-5.31 5.73.42.36.79 1.08.79 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z",
    linkedin:
      "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z",
    instagram:
      "M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 2.69.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.36-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.36-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z",
    youtube:
      "M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z",
  };

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}
