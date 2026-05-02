"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Save, Loader2, Plus, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { hasPermission } from "@/lib/permissions";
import { ImageUpload } from "@/components/common/image-upload";
import {
  updateContactHero,
  updateContactInfo,
  updateContactForm,
  updateContactMap,
  updateContactFaq,
  updateContactCta,
  updateContactSeo,
  markInquiryAsReadAction,
  deleteInquiryAction,
} from "@/modules/contact/actions";
import type { ContactPageData } from "@/modules/contact/types";
import { defaultContactContent } from "@/modules/contact/data/defaults";

const TABS = ["sections", "inquiries", "seo"] as const;
type Tab = (typeof TABS)[number];

const SECTION_TABS = ["hero", "contact_info", "contact_form", "map", "faq", "contact_cta"] as const;
type SectionTab = (typeof SECTION_TABS)[number];

const SECTION_LABELS: Record<SectionTab, string> = {
  hero: "Hero",
  contact_info: "Contact Info",
  contact_form: "Contact Form",
  map: "Map",
  faq: "FAQ",
  contact_cta: "Contact CTA",
};

type FormData = ContactPageData & {
  seo: { title: string; description: string; keywords: string; ogImage: string; noIndex: boolean };
};

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export default function ContactPageManager() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session && !hasPermission(session, "MANAGE_CONTACT")) {
      router.push("/admin");
    }
  }, [session, router]);

  const [activeTab, setActiveTab] = useState<Tab>("sections");
  const [activeSectionTab, setActiveSectionTab] = useState<SectionTab>("hero");
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetch("/api/admin/contact")
      .then((r) => r.json())
      .then(({ data }: { data: { sections: Partial<FormData>; inquiries: Inquiry[] } }) => {
        const sections = data.sections ?? {};
        setFormData({
          hero: { ...defaultContactContent.hero, ...(sections.hero ?? {}) },
          contact_info: { ...defaultContactContent.contact_info, ...(sections.contact_info ?? {}) },
          contact_form: { ...defaultContactContent.contact_form, ...(sections.contact_form ?? {}) },
          map: { ...defaultContactContent.map, ...(sections.map ?? {}) },
          faq: { ...defaultContactContent.faq, ...(sections.faq ?? {}) },
          contact_cta: { ...defaultContactContent.contact_cta, ...(sections.contact_cta ?? {}) },
          seo: {
            title: "",
            description: "",
            keywords: "",
            ogImage: "",
            noIndex: false,
          },
        });
        setInquiries(data.inquiries ?? []);
        setLoadingData(false);
      })
      .catch(() => {
        setLoadingData(false);
        toast.error("Failed to load contact data");
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
      hero: (d) => updateContactHero(d),
      contact_info: (d) => updateContactInfo(d),
      contact_form: (d) => updateContactForm(d),
      map: (d) => updateContactMap(d),
      faq: (d) => updateContactFaq(d),
      contact_cta: (d) => updateContactCta(d),
    };
    const result = await actionMap[activeSectionTab]?.(formData[activeSectionTab]);
    if (result?.success) toast.success("Section saved successfully!");
    else toast.error(result?.error ?? "Failed to save");
    setLoading(false);
  }

  async function handleSaveSeo() {
    setLoading(true);
    const seo = (formData as Partial<FormData>).seo;
    const result = await updateContactSeo(seo);
    if (result?.success) toast.success("SEO saved successfully!");
    else toast.error(result?.error ?? "Failed to save");
    setLoading(false);
  }

  async function handleMarkRead(inquiry: Inquiry) {
    if (inquiry.isRead) return;
    const result = await markInquiryAsReadAction(inquiry.id);
    if (result?.success) {
      setInquiries((prev) =>
        prev.map((i) => (i.id === inquiry.id ? { ...i, isRead: true } : i))
      );
      toast.success("Marked as read!");
    } else {
      toast.error(result?.error ?? "Failed to update");
    }
  }

  async function handleDeleteInquiry(id: string) {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    const result = await deleteInquiryAction(id);
    if (result?.success) {
      setInquiries((prev) => prev.filter((i) => i.id !== id));
      toast.success("Inquiry deleted!");
    } else {
      toast.error(result?.error ?? "Failed to delete");
    }
  }

  const hero = formData.hero ?? defaultContactContent.hero;
  const contactInfo = formData.contact_info ?? defaultContactContent.contact_info;
  const contactForm = formData.contact_form ?? defaultContactContent.contact_form;
  const map = formData.map ?? defaultContactContent.map;
  const faq = formData.faq ?? defaultContactContent.faq;
  const cta = formData.contact_cta ?? defaultContactContent.contact_cta;
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
          <h1 className="text-2xl sm:text-3xl font-bold">Contact Page Manager</h1>
          <p className="text-muted-foreground mt-1">Manage contact page sections, inquiries, and SEO</p>
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
              {tab === "sections" ? "Page Sections" : tab === "inquiries" ? "Inquiries" : "SEO"}
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

                  {activeSectionTab === "contact_info" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Section Title *</label>
                        <input
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                          value={contactInfo.title}
                          onChange={(e) => update("contact_info", { title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                        <input
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                          value={contactInfo.subtitle}
                          onChange={(e) => update("contact_info", { subtitle: e.target.value })}
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium">Contact Items</label>
                          <button
                            type="button"
                            onClick={() =>
                              update("contact_info", {
                                ...contactInfo,
                                items: [
                                  ...(contactInfo.items || []),
                                  { icon: "", label: "", value: "" },
                                ],
                              })
                            }
                            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Item
                          </button>
                        </div>
                        <div className="space-y-4">
                          {(contactInfo.items || []).map((item: { icon: string; label: string; value: string }, i: number) => (
                            <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                  Item {i + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (contactInfo.items || []).filter((_: unknown, j: number) => j !== i);
                                    update("contact_info", { ...contactInfo, items: updated });
                                  }}
                                  className="text-destructive hover:text-destructive/70"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                  <label className="block text-xs font-medium mb-1">Icon *</label>
                                  <input
                                    className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                    value={item.icon}
                                    onChange={(e) => {
                                      const updated = [...(contactInfo.items || [])];
                                      updated[i] = { ...updated[i], icon: e.target.value };
                                      update("contact_info", { ...contactInfo, items: updated });
                                    }}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium mb-1">Label *</label>
                                  <input
                                    className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                    value={item.label}
                                    onChange={(e) => {
                                      const updated = [...(contactInfo.items || [])];
                                      updated[i] = { ...updated[i], label: e.target.value };
                                      update("contact_info", { ...contactInfo, items: updated });
                                    }}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium mb-1">Value *</label>
                                  <input
                                    className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                    value={item.value}
                                    onChange={(e) => {
                                      const updated = [...(contactInfo.items || [])];
                                      updated[i] = { ...updated[i], value: e.target.value };
                                      update("contact_info", { ...contactInfo, items: updated });
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Working Hours</label>
                        <input
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                          value={contactInfo.workingHours}
                          onChange={(e) => update("contact_info", { workingHours: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {activeSectionTab === "contact_form" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Title *</label>
                        <input
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                          value={contactForm.title}
                          onChange={(e) => update("contact_form", { title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                        <input
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                          value={contactForm.subtitle}
                          onChange={(e) => update("contact_form", { subtitle: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Submit Button Text</label>
                        <input
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                          value={contactForm.submitText}
                          onChange={(e) => update("contact_form", { submitText: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {activeSectionTab === "map" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Section Title *</label>
                        <input
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                          value={map.title}
                          onChange={(e) => update("map", { title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Embed URL</label>
                        <textarea
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                          rows={3}
                          value={map.embedUrl}
                          onChange={(e) => update("map", { embedUrl: e.target.value })}
                          placeholder="https://www.google.com/maps/embed?..."
                        />
                      </div>
                    </div>
                  )}

                  {activeSectionTab === "faq" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Section Title *</label>
                        <input
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                          value={faq.title}
                          onChange={(e) => update("faq", { title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                        <input
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                          value={faq.subtitle}
                          onChange={(e) => update("faq", { subtitle: e.target.value })}
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium">FAQ Items</label>
                          <button
                            type="button"
                            onClick={() =>
                              update("faq", {
                                ...faq,
                                items: [
                                  ...(faq.items || []),
                                  { question: "", answer: "" },
                                ],
                              })
                            }
                            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add FAQ
                          </button>
                        </div>
                        <div className="space-y-4">
                          {(faq.items || []).map((item: { question: string; answer: string }, i: number) => (
                            <div key={i} className="p-4 rounded-lg border border-border space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-muted-foreground">
                                  FAQ {i + 1}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (faq.items || []).filter((_: unknown, j: number) => j !== i);
                                    update("faq", { ...faq, items: updated });
                                  }}
                                  className="text-destructive hover:text-destructive/70"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1">Question *</label>
                                <input
                                  className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm"
                                  value={item.question}
                                  onChange={(e) => {
                                    const updated = [...(faq.items || [])];
                                    updated[i] = { ...updated[i], question: e.target.value };
                                    update("faq", { ...faq, items: updated });
                                  }}
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium mb-1">Answer *</label>
                                <textarea
                                  className="w-full px-2.5 py-1.5 rounded-md border border-input bg-background text-sm resize-none"
                                  rows={2}
                                  value={item.answer}
                                  onChange={(e) => {
                                    const updated = [...(faq.items || [])];
                                    updated[i] = { ...updated[i], answer: e.target.value };
                                    update("faq", { ...faq, items: updated });
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
                        <label className="block text-sm font-medium mb-1.5">Title *</label>
                        <input
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                          value={cta.title}
                          onChange={(e) => update("contact_cta", { title: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Subtitle</label>
                        <input
                          className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                          value={cta.subtitle}
                          onChange={(e) => update("contact_cta", { subtitle: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1.5">Button Text *</label>
                          <input
                            className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                            value={cta.buttonText}
                            onChange={(e) => update("contact_cta", { buttonText: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1.5">Button Link *</label>
                          <input
                            className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                            value={cta.buttonLink}
                            onChange={(e) => update("contact_cta", { buttonLink: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "inquiries" && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">Contact Inquiries ({inquiries.length})</h2>

                  {inquiries.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No inquiries yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {inquiries.map((inquiry) => (
                        <div
                          key={inquiry.id}
                          className={`rounded-lg border p-4 space-y-3 ${
                            inquiry.isRead ? "bg-card" : "bg-primary/5 border-primary/20"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{inquiry.name}</h3>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>Email: {inquiry.email}</p>
                                {inquiry.phone && <p>Phone: {inquiry.phone}</p>}
                                {inquiry.subject && <p>Subject: {inquiry.subject}</p>}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              {!inquiry.isRead && (
                                <button
                                  onClick={() => handleMarkRead(inquiry)}
                                  className="p-1.5 rounded hover:bg-muted transition text-primary"
                                  title="Mark as read"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteInquiry(inquiry.id)}
                                className="p-1.5 rounded hover:bg-muted transition text-destructive"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="bg-muted/50 rounded-md p-3">
                            <p className="text-sm">{inquiry.message}</p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(inquiry.createdAt).toLocaleString()}
                            {inquiry.isRead && (
                              <span className="ml-2 text-green-600">✓ Read</span>
                            )}
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
                      placeholder="Contact Us — RaYnk Labs"
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
                      placeholder="contact, get in touch, raynk labs"
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
                      id="contactNoIndex"
                      checked={seo.noIndex}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          seo: { ...seo, noIndex: e.target.checked },
                        }))
                      }
                      className="w-4 h-4 rounded border-border"
                    />
                    <label htmlFor="contactNoIndex" className="text-sm font-medium">
                      No Index (hide from search engines)
                    </label>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
