
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/common/image-upload";
import { hasPermission } from "@/lib/permissions";
import {
  updateAboutCollaborationCta,
  updateAboutCoreTeam,
  updateAboutHero,
  updateAboutMission,
  updateAboutSeo,
  updateAboutStory,
  updateAboutWhyChoose,
} from "@/modules/about/actions";
import { defaultAboutContent } from "@/modules/about/data/defaults";
import type { AboutPageData } from "@/modules/about/types";

const TABS = ["hero", "story", "mission", "why_choose_us", "core_team", "collaboration_cta", "seo"] as const;
type Tab = (typeof TABS)[number];
type FormData = AboutPageData & { seo: { title: string; description: string; keywords: string; ogImage: string; noIndex: boolean } };

const TAB_LABELS: Record<Tab, string> = {
  hero: "Hero",
  story: "Story",
  mission: "Mission",
  why_choose_us: "Why Choose Us",
  core_team: "Core Team",
  collaboration_cta: "Collaboration CTA",
  seo: "SEO",
};

export default function AboutPageManager() {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("hero");
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (session && !hasPermission(session, "EDIT_ABOUT")) router.push("/admin");
  }, [router, session]);

  useEffect(() => {
    fetch("/api/admin/about")
      .then((response) => response.json())
      .then(({ data }: { data: Partial<FormData> }) => {
        setFormData({
          hero: { ...defaultAboutContent.hero, ...(data?.hero ?? {}) },
          story: { ...defaultAboutContent.story, ...(data?.story ?? {}) },
          mission: { ...defaultAboutContent.mission, ...(data?.mission ?? {}) },
          why_choose_us: { ...defaultAboutContent.why_choose_us, ...(data?.why_choose_us ?? {}) },
          core_team: { ...defaultAboutContent.core_team, ...(data?.core_team ?? {}) },
          social_links: { ...defaultAboutContent.social_links, ...(data?.social_links ?? {}) },
          collaboration_cta: { ...defaultAboutContent.collaboration_cta, ...(data?.collaboration_cta ?? {}) },
          seo: { title: "", description: "", keywords: "", ogImage: "", noIndex: false, ...((data as Partial<FormData>)?.seo ?? {}) },
        });
        setLoadingData(false);
      })
      .catch(() => {
        setLoadingData(false);
        toast.error("Failed to load page data");
      });
  }, []);

  function update<K extends keyof FormData>(section: K, patch: Partial<FormData[K]>) {
    setFormData((prev) => ({ ...prev, [section]: { ...(prev[section] as object), ...patch } }));
  }

  async function handleSave() {
    setLoading(true);
    const actionMap: Record<Tab, (data: unknown) => Promise<{ success: boolean; error?: string }>> = {
      hero: updateAboutHero,
      story: updateAboutStory,
      mission: updateAboutMission,
      why_choose_us: updateAboutWhyChoose,
      core_team: updateAboutCoreTeam,
      collaboration_cta: updateAboutCollaborationCta,
      seo: updateAboutSeo,
    };
    const result = await actionMap[activeTab]?.(formData[activeTab]);
    if (result?.success) toast.success("Saved successfully");
    else toast.error(result?.error ?? "Failed to save");
    setLoading(false);
  }

  const hero = formData.hero ?? defaultAboutContent.hero;
  const story = formData.story ?? defaultAboutContent.story;
  const mission = formData.mission ?? defaultAboutContent.mission;
  const whyChoose = formData.why_choose_us ?? defaultAboutContent.why_choose_us;
  const coreTeam = formData.core_team ?? defaultAboutContent.core_team;
  const collaborationCta = formData.collaboration_cta ?? defaultAboutContent.collaboration_cta;
  const seo = (formData as Partial<FormData>).seo ?? { title: "", description: "", keywords: "", ogImage: "", noIndex: false };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">About Page Manager</h1>
          <p className="mt-1 text-muted-foreground">Manage About page sections, team cards, collaboration CTA, and SEO.</p>
        </div>
        <SaveButton loading={loading} loadingData={loadingData} onClick={handleSave} />
      </div>

      <div className="rounded-lg border bg-card">
        <div className="flex overflow-x-auto border-b">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        <div className="p-6">
          {loadingData ? <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div> : (
            <>
              {activeTab === "hero" && <div className="space-y-4"><Field label="Title *"><input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={hero.title} onChange={(event) => update("hero", { title: event.target.value })} /></Field><Field label="Subtitle *"><textarea className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm" rows={3} value={hero.subtitle} onChange={(event) => update("hero", { subtitle: event.target.value })} /></Field><Field label="Background Image"><ImageUpload value={hero.backgroundImage} onChange={(value) => update("hero", { backgroundImage: value })} /></Field></div>}
              {activeTab === "story" && <div className="space-y-4"><Field label="Image"><ImageUpload value={story.image} onChange={(value) => update("story", { image: value })} /></Field><Field label="Content *"><textarea className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm" rows={9} value={story.content} onChange={(event) => update("story", { content: event.target.value })} /></Field></div>}
              {activeTab === "mission" && (
                <div className="space-y-4">
                  <Field label="Section Title *"><input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={mission.title} onChange={(event) => update("mission", { title: event.target.value })} /></Field>
                  <Field label="Subtitle"><input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={mission.subtitle} onChange={(event) => update("mission", { subtitle: event.target.value })} /></Field>
                  <div>
                    <div className="mb-3 flex items-center justify-between"><label className="text-sm font-medium">Mission Items</label><TinyAction onClick={() => update("mission", { items: [...mission.items, { icon: "Star", title: "", description: "" }] })}><Plus className="h-3.5 w-3.5" /> Add Item</TinyAction></div>
                    <div className="space-y-6">{mission.items.map((item, index) => <div key={index} className="space-y-3 rounded-lg border border-border p-4"><ItemHeader label={`Item ${index + 1}`} onDelete={() => update("mission", { items: mission.items.filter((_, current) => current !== index) })} /><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Field label="Icon (Lucide)"><input className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm" value={item.icon} onChange={(event) => { const items = [...mission.items]; items[index] = { ...items[index], icon: event.target.value }; update("mission", { items }); }} /></Field><Field label="Title *"><input className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm" value={item.title} onChange={(event) => { const items = [...mission.items]; items[index] = { ...items[index], title: event.target.value }; update("mission", { items }); }} /></Field></div><Field label="Description *"><textarea className="w-full resize-none rounded-md border border-input bg-background px-2.5 py-1.5 text-sm" rows={2} value={item.description} onChange={(event) => { const items = [...mission.items]; items[index] = { ...items[index], description: event.target.value }; update("mission", { items }); }} /></Field></div>)}</div>
                  </div>
                </div>
              )}
              {activeTab === "why_choose_us" && (
                <div className="space-y-4">
                  <Field label="Section Title *"><input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={whyChoose.title} onChange={(event) => update("why_choose_us", { title: event.target.value })} /></Field>
                  <Field label="Subtitle"><input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={whyChoose.subtitle} onChange={(event) => update("why_choose_us", { subtitle: event.target.value })} /></Field>
                  <div>
                    <div className="mb-3 flex items-center justify-between"><label className="text-sm font-medium">Points</label><TinyAction onClick={() => update("why_choose_us", { points: [...whyChoose.points, { icon: "Star", title: "", description: "" }] })}><Plus className="h-3.5 w-3.5" /> Add Point</TinyAction></div>
                    <div className="space-y-6">{whyChoose.points.map((point, index) => <div key={index} className="space-y-3 rounded-lg border border-border p-4"><ItemHeader label={`Point ${index + 1}`} onDelete={() => update("why_choose_us", { points: whyChoose.points.filter((_, current) => current !== index) })} /><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Field label="Icon (Lucide)"><input className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm" value={point.icon} onChange={(event) => { const points = [...whyChoose.points]; points[index] = { ...points[index], icon: event.target.value }; update("why_choose_us", { points }); }} /></Field><Field label="Title *"><input className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm" value={point.title} onChange={(event) => { const points = [...whyChoose.points]; points[index] = { ...points[index], title: event.target.value }; update("why_choose_us", { points }); }} /></Field></div><Field label="Description *"><textarea className="w-full resize-none rounded-md border border-input bg-background px-2.5 py-1.5 text-sm" rows={2} value={point.description} onChange={(event) => { const points = [...whyChoose.points]; points[index] = { ...points[index], description: event.target.value }; update("why_choose_us", { points }); }} /></Field></div>)}</div>
                  </div>
                </div>
              )}
              {activeTab === "core_team" && (
                <div className="space-y-4">
                  <Field label="Section Title *"><input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={coreTeam.title} onChange={(event) => update("core_team", { title: event.target.value })} /></Field>
                  <Field label="Subtitle"><input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={coreTeam.subtitle} onChange={(event) => update("core_team", { subtitle: event.target.value })} /></Field>
                  <div>
                    <div className="mb-3 flex items-center justify-between"><label className="text-sm font-medium">Team Members</label><TinyAction onClick={() => update("core_team", { members: [...coreTeam.members, { name: "", role: "", image: "", bio: "", skills: [], githubUrl: "", linkedinUrl: "", twitterUrl: "", portfolioUrl: "" }] })}><Plus className="h-3.5 w-3.5" /> Add Member</TinyAction></div>
                    <div className="space-y-6">{coreTeam.members.map((member, index) => <div key={index} className="space-y-3 rounded-lg border border-border p-4"><ItemHeader label={`Member ${index + 1}`} onDelete={() => update("core_team", { members: coreTeam.members.filter((_, current) => current !== index) })} /><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Field label="Name *"><input className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm" value={member.name} onChange={(event) => { const members = [...coreTeam.members]; members[index] = { ...members[index], name: event.target.value }; update("core_team", { members }); }} /></Field><Field label="Role *"><input className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm" value={member.role} onChange={(event) => { const members = [...coreTeam.members]; members[index] = { ...members[index], role: event.target.value }; update("core_team", { members }); }} /></Field></div><Field label="Short Bio"><textarea className="w-full resize-none rounded-md border border-input bg-background px-2.5 py-1.5 text-sm" rows={3} value={member.bio ?? ""} onChange={(event) => { const members = [...coreTeam.members]; members[index] = { ...members[index], bio: event.target.value }; update("core_team", { members }); }} /></Field><Field label="Skills (comma-separated)"><input className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm" value={(member.skills ?? []).join(", ")} onChange={(event) => { const members = [...coreTeam.members]; members[index] = { ...members[index], skills: event.target.value.split(",").map((skill) => skill.trim()).filter(Boolean) }; update("core_team", { members }); }} /></Field><div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"><Field label="LinkedIn URL"><input className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm" value={member.linkedinUrl ?? ""} onChange={(event) => { const members = [...coreTeam.members]; members[index] = { ...members[index], linkedinUrl: event.target.value }; update("core_team", { members }); }} /></Field><Field label="GitHub URL"><input className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm" value={member.githubUrl ?? ""} onChange={(event) => { const members = [...coreTeam.members]; members[index] = { ...members[index], githubUrl: event.target.value }; update("core_team", { members }); }} /></Field><Field label="X / Twitter URL"><input className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm" value={member.twitterUrl ?? ""} onChange={(event) => { const members = [...coreTeam.members]; members[index] = { ...members[index], twitterUrl: event.target.value }; update("core_team", { members }); }} /></Field><Field label="Portfolio URL"><input className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm" value={member.portfolioUrl ?? ""} onChange={(event) => { const members = [...coreTeam.members]; members[index] = { ...members[index], portfolioUrl: event.target.value }; update("core_team", { members }); }} /></Field></div><Field label="Image"><ImageUpload value={member.image} onChange={(value) => { const members = [...coreTeam.members]; members[index] = { ...members[index], image: value }; update("core_team", { members }); }} /></Field></div>)}</div>
                  </div>
                </div>
              )}
              {activeTab === "collaboration_cta" && (
                <div className="space-y-4">
                  <Field label="Section Title *"><input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={collaborationCta.title} onChange={(event) => update("collaboration_cta", { title: event.target.value })} /></Field>
                  <Field label="Subtitle *"><textarea className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm" rows={3} value={collaborationCta.subtitle} onChange={(event) => update("collaboration_cta", { subtitle: event.target.value })} /></Field>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Field label="Submit Button Text *"><input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={collaborationCta.submitText} onChange={(event) => update("collaboration_cta", { submitText: event.target.value })} /></Field><Field label="Success Message *"><input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={collaborationCta.successMessage} onChange={(event) => update("collaboration_cta", { successMessage: event.target.value })} /></Field></div>
                  <div>
                    <div className="mb-3 flex items-center justify-between"><label className="text-sm font-medium">Highlight Cards</label><TinyAction onClick={() => update("collaboration_cta", { highlights: [...collaborationCta.highlights, { icon: "Sparkles", title: "", description: "" }] })}><Plus className="h-3.5 w-3.5" /> Add Highlight</TinyAction></div>
                    <div className="space-y-6">{collaborationCta.highlights.map((highlight, index) => <div key={index} className="space-y-3 rounded-lg border border-border p-4"><ItemHeader label={`Highlight ${index + 1}`} onDelete={() => update("collaboration_cta", { highlights: collaborationCta.highlights.filter((_, current) => current !== index) })} /><div className="grid grid-cols-1 gap-3 sm:grid-cols-2"><Field label="Icon (Lucide)"><input className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm" value={highlight.icon} onChange={(event) => { const highlights = [...collaborationCta.highlights]; highlights[index] = { ...highlights[index], icon: event.target.value }; update("collaboration_cta", { highlights }); }} /></Field><Field label="Title *"><input className="w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm" value={highlight.title} onChange={(event) => { const highlights = [...collaborationCta.highlights]; highlights[index] = { ...highlights[index], title: event.target.value }; update("collaboration_cta", { highlights }); }} /></Field></div><Field label="Description *"><textarea className="w-full resize-none rounded-md border border-input bg-background px-2.5 py-1.5 text-sm" rows={2} value={highlight.description} onChange={(event) => { const highlights = [...collaborationCta.highlights]; highlights[index] = { ...highlights[index], description: event.target.value }; update("collaboration_cta", { highlights }); }} /></Field></div>)}</div>
                  </div>
                </div>
              )}
              {activeTab === "seo" && (
                <div className="space-y-4">
                  <Field label="Meta Title"><input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={seo.title} onChange={(event) => setFormData((prev) => ({ ...prev, seo: { ...seo, title: event.target.value } }))} placeholder="About RaYnk Labs - Story, Mission, Team & Collaboration" /></Field>
                  <Field label="Meta Description"><textarea className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm" rows={3} value={seo.description} onChange={(event) => setFormData((prev) => ({ ...prev, seo: { ...seo, description: event.target.value } }))} /></Field>
                  <Field label="Keywords (comma-separated)"><input className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={seo.keywords} onChange={(event) => setFormData((prev) => ({ ...prev, seo: { ...seo, keywords: event.target.value } }))} placeholder="raynk labs, about us, startup partner, digital studio" /></Field>
                  <Field label="OG Image"><ImageUpload value={seo.ogImage} onChange={(value) => setFormData((prev) => ({ ...prev, seo: { ...seo, ogImage: value } }))} /></Field>
                  <div className="flex items-center gap-3"><input type="checkbox" id="noIndex" checked={seo.noIndex} onChange={(event) => setFormData((prev) => ({ ...prev, seo: { ...seo, noIndex: event.target.checked } }))} className="h-4 w-4 rounded border-border" /><label htmlFor="noIndex" className="text-sm font-medium">No Index (hide from search engines)</label></div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end pb-6"><SaveButton loading={loading} loadingData={loadingData} onClick={handleSave} /></div>
    </div>
  );
}

function SaveButton({ loading, loadingData, onClick }: { loading: boolean; loadingData: boolean; onClick: () => void }) {
  return <button onClick={onClick} disabled={loading || loadingData} className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50">{loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Changes</>}</button>;
}

function TinyAction({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return <button type="button" onClick={onClick} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80">{children}</button>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <div><label className="mb-1.5 block text-sm font-medium">{label}</label>{children}</div>;
}

function ItemHeader({ label, onDelete }: { label: string; onDelete: () => void }) {
  return <div className="flex items-center justify-between"><span className="text-sm font-medium text-muted-foreground">{label}</span><button type="button" onClick={onDelete} className="text-destructive hover:text-destructive/70"><Trash2 className="h-4 w-4" /></button></div>;
}


