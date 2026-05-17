"use client";

import Link from "next/link";
import { useMemo, useState, type ComponentProps, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import type { z } from "zod";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock3,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { blurReveal, cardReveal, fadeIn, staggerContainer, staggerItem } from "@/lib/animation-variants";
import { SplitWords } from "@/components/shared";
import {
  CONTACT_BUDGET_RANGES,
  CONTACT_MAP,
  CONTACT_SECTIONS,
  CONTACT_SERVICE_TYPES,
  CONTACT_SOCIAL_LINKS,
  CONTACT_TIMELINES,
} from "../constants";
import { contactInquirySchema, type ContactInquirySchema } from "../validations";
import type { ContactPageData, ContactSocialLink } from "../types";

const iconMap = { MapPin, Phone, Mail, Clock: Clock3 };
type ContactFormValues = z.input<typeof contactInquirySchema>;

export function ContactExperience({ data }: { data: ContactPageData }) {
  const [openFaq, setOpenFaq] = useState(0);
  const [sent, setSent] = useState(false);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactInquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      serviceType: CONTACT_SERVICE_TYPES[0],
      subject: "",
      budgetRange: CONTACT_BUDGET_RANGES[4],
      projectTimeline: CONTACT_TIMELINES[4],
      message: "",
      website: "",
    },
  });
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = form;

  const socialLinks = useMemo(() => CONTACT_SOCIAL_LINKS, []);

  const onSubmit = async (values: ContactFormValues) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error ?? "Failed to send message");
      setSent(true);
      toast.success("Message submitted successfully. Our team will contact you soon.");
      reset();
      window.setTimeout(() => setSent(false), 4500);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send message");
    }
  };

  return (
    <>
      <section id={CONTACT_SECTIONS.form} className="scroll-mt-24 bg-background py-16 sm:py-20 md:py-24 lg:py-28 2xl:py-36">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={staggerContainer}
          className="section-container grid gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-8 2xl:max-w-screen-2xl 2xl:px-20 2xl:gap-24"
        >
          <motion.div variants={blurReveal} className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Project Inquiry
            </div>
            <h2 className="max-w-xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl 2xl:text-6xl">
              <SplitWords text={data.contact_form.title} inheritParent />
            </h2>
            {data.contact_form.subtitle ? <p className="max-w-xl text-base leading-8 text-white/62 sm:text-lg 2xl:text-xl">{data.contact_form.subtitle}</p> : null}
            <div className="grid gap-4 pt-2 sm:grid-cols-3">
              {[
                "Fast reply",
                "Clear scope",
                "Admin tracked",
              ].map((item) => (
                <motion.div key={item} variants={cardReveal} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-5 text-sm font-semibold text-white/78 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-primary/[0.08]">
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.form
            variants={fadeIn}
            onSubmit={handleSubmit(onSubmit)}
            className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-6 2xl:p-8"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)] opacity-90" />
            <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(circle at top right, rgba(59,130,246,0.14), transparent 38%)" }} />
            <div className="relative grid gap-4">
              <input className="hidden" tabIndex={-1} autoComplete="off" {...register("website")} aria-hidden="true" />
              <div className="grid gap-4 sm:grid-cols-2">
                <FloatingField label="Full name" error={errors.name?.message}><Input {...register("name")} placeholder="Full name" className="peer h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 pt-5 text-white placeholder:text-transparent focus-visible:ring-primary/30" /></FloatingField>
                <FloatingField label="Email" error={errors.email?.message}><Input type="email" {...register("email")} placeholder="Email" className="peer h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 pt-5 text-white placeholder:text-transparent focus-visible:ring-primary/30" /></FloatingField>
                <FloatingField label="Phone" error={errors.phone?.message}><Input {...register("phone")} placeholder="Phone" className="peer h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 pt-5 text-white placeholder:text-transparent focus-visible:ring-primary/30" /></FloatingField>
                <FloatingField label="Company" error={errors.company?.message}><Input {...register("company")} placeholder="Company" className="peer h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 pt-5 text-white placeholder:text-transparent focus-visible:ring-primary/30" /></FloatingField>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <SelectField label="Service" register={register("serviceType")} options={CONTACT_SERVICE_TYPES} />
                <SelectField label="Budget" register={register("budgetRange")} options={CONTACT_BUDGET_RANGES} />
                <SelectField label="Timeline" register={register("projectTimeline")} options={CONTACT_TIMELINES} />
              </div>
              <FloatingField label="Subject" error={errors.subject?.message}><Input {...register("subject")} placeholder="Subject" className="peer h-12 rounded-2xl border-white/10 bg-white/[0.04] px-4 pt-5 text-white placeholder:text-transparent focus-visible:ring-primary/30" /></FloatingField>
              <FloatingArea label="Message" error={errors.message?.message}><Textarea {...register("message")} rows={6} placeholder="Message" className="peer rounded-3xl border-white/10 bg-white/[0.04] px-4 pt-6 text-white placeholder:text-transparent focus-visible:ring-primary/30" /></FloatingArea>
              <Button type="submit" disabled={isSubmitting} className="group/button mt-2 h-12 rounded-2xl bg-linear-to-r from-primary via-blue-500 to-cyan-400 px-6 text-sm font-semibold text-primary-foreground shadow-[0_18px_50px_rgba(59,130,246,0.32)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(59,130,246,0.42)] sm:h-14 sm:text-base">
                <Send className="mr-2 h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-0.5" aria-hidden="true" />
                {isSubmitting ? "Sending..." : sent ? "Sent" : data.contact_form.submitText}
              </Button>
            </div>
          </motion.form>
        </motion.div>
      </section>

      <section id={CONTACT_SECTIONS.info} className="scroll-mt-24 bg-[#0b0d13] py-16 sm:py-20 md:py-24 lg:py-28 2xl:py-36">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }} variants={staggerContainer} className="section-container space-y-10 px-4 sm:px-6 lg:px-8 2xl:max-w-screen-2xl 2xl:px-20">
          <motion.div variants={blurReveal} className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl 2xl:text-6xl"><SplitWords text={data.contact_info.title} inheritParent /></h2>
            {data.contact_info.subtitle ? <p className="mt-4 text-base leading-8 text-white/60 sm:text-lg 2xl:text-xl">{data.contact_info.subtitle}</p> : null}
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 2xl:gap-8">
            {data.contact_info.items.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap] ?? MapPin;
              return (
                <motion.button
                  key={`${item.label}-${item.value}`}
                  variants={cardReveal}
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(item.value).then(() => toast.success(`${item.label} copied`))}
                  className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-6 text-left shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_24px_70px_rgba(37,99,235,0.14)]"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_38%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="mt-5 text-lg font-black text-white">{item.label}</h3>
                    <p className="mt-2 break-words text-sm leading-7 text-white/60">{item.value}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
          {data.contact_info.workingHours ? <motion.p variants={fadeIn} className="text-center text-sm text-white/52 sm:text-base"><Clock3 className="mr-2 inline h-4 w-4" />{data.contact_info.workingHours}</motion.p> : null}
        </motion.div>
      </section>

      <section id={CONTACT_SECTIONS.faq} className="scroll-mt-24 bg-background py-16 sm:py-20 md:py-24 lg:py-28 2xl:py-36">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }} variants={staggerContainer} className="section-container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 2xl:max-w-6xl 2xl:px-20">
          <motion.div variants={blurReveal} className="mb-10 text-center">
            <h2 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl 2xl:text-6xl"><SplitWords text={data.faq.title} inheritParent /></h2>
            {data.faq.subtitle ? <p className="mt-4 text-base leading-8 text-white/60 sm:text-lg 2xl:text-xl">{data.faq.subtitle}</p> : null}
          </motion.div>
          <div className="space-y-4">
            {data.faq.items.map((item, index) => {
              const open = openFaq === index;
              return (
                <motion.div key={item.question} variants={staggerItem} className={`overflow-hidden rounded-[24px] border bg-white/[0.03] transition-all duration-300 ${open ? "border-primary/40 shadow-[0_20px_60px_rgba(37,99,235,0.12)]" : "border-white/10"}`}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : index)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-sm font-semibold text-white transition-all duration-300 hover:bg-white/[0.04] sm:text-base"
                  >
                    {item.question}
                    <ChevronDown className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25, ease: "easeOut" }}>
                        <div className="px-5 pb-5 text-sm leading-7 text-white/60 sm:text-base">{item.answer}</div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {data.map.embedUrl ? (
        <section id={CONTACT_SECTIONS.map} className="scroll-mt-24 bg-[#0a0c12] py-16 sm:py-20 md:py-24 lg:py-28 2xl:py-36">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.16 }} variants={staggerContainer} className="section-container space-y-8 px-4 sm:px-6 lg:px-8 2xl:max-w-screen-2xl 2xl:px-20">
            <motion.div variants={blurReveal} className="text-center">
              <h2 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl 2xl:text-6xl"><SplitWords text={data.map.title} inheritParent /></h2>
            </motion.div>
            <motion.div variants={cardReveal} className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <div className="aspect-[16/9] overflow-hidden rounded-[24px] border border-white/6 bg-black/20">
                <iframe
                  src={CONTACT_MAP.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="RaYnk Labs location map"
                />
              </div>
            </motion.div>
            <motion.div variants={fadeIn} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary shadow-[0_0_30px_rgba(59,130,246,0.15)]"><MapPin className="h-5 w-5" /></div>
                <h3 className="mt-5 text-2xl font-black text-white">{CONTACT_MAP.locationName}</h3>
                <p className="mt-3 text-sm leading-7 text-white/60 sm:text-base">{CONTACT_MAP.fullAddress}</p>
                <p className="mt-4 text-sm leading-7 text-white/50">{CONTACT_MAP.travelNote}</p>
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                <h3 className="text-lg font-black text-white">Visit or Navigate</h3>
                <p className="mt-3 text-sm leading-7 text-white/60">Open the exact Akal University location in Google Maps and use it for travel planning or meeting coordination.</p>
                <Button asChild className="mt-6 h-12 rounded-full bg-primary px-6 text-primary-foreground shadow-[0_18px_50px_rgba(59,130,246,0.32)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90">
                  <Link href={CONTACT_MAP.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    Open in Google Maps
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </section>
      ) : null}

      <section id={CONTACT_SECTIONS.social} className="scroll-mt-24 bg-background py-16 sm:py-20 md:py-24 lg:py-28 2xl:py-36">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.16 }} variants={staggerContainer} className="section-container space-y-8 px-4 text-center sm:px-6 lg:px-8 2xl:max-w-screen-2xl 2xl:px-20">
          <motion.div variants={blurReveal}>
            <h2 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl 2xl:text-6xl"><SplitWords text="Connect With Us" inheritParent /></h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {socialLinks.map((item) => (
              <SocialPill key={item.label} item={item} />
            ))}
          </div>
        </motion.div>
      </section>

      <section id={CONTACT_SECTIONS.cta} className="scroll-mt-24 bg-[#0a0d13] py-16 sm:py-20 md:py-24 lg:py-28 2xl:py-36">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.18 }} variants={staggerContainer} className="section-container px-4 sm:px-6 lg:px-8 2xl:max-w-screen-2xl 2xl:px-20">
          <motion.div variants={blurReveal} className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_28%),linear-gradient(135deg,#0d1220,#0a0d14)] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-10 lg:p-14 2xl:p-16">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
            <div className="relative mx-auto max-w-4xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Collaboration CTA</p>
              <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl 2xl:text-6xl">{data.contact_cta.title}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/62 sm:text-lg 2xl:text-xl">{data.contact_cta.subtitle}</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild className="group h-12 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_18px_44px_rgba(59,130,246,0.34)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 sm:h-14 sm:px-7 sm:text-base">
                  <Link href={data.contact_cta.buttonLink}>
                    Start Your Project
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="group h-12 rounded-full border-white/10 bg-white/[0.04] px-6 text-white transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-white sm:h-14 sm:px-7 sm:text-base">
                  <Link href={CONTACT_MAP.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                    Schedule a Call
                    <CalendarDays className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}

function FloatingField({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <div className="relative">
        {children}
        <span className="pointer-events-none absolute left-4 top-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/55 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-focus:top-3 peer-focus:text-[11px] peer-focus:tracking-[0.15em] peer-focus:text-primary">{label}</span>
      </div>
      {error ? <span className="text-xs text-red-400">{error}</span> : null}
    </div>
  );
}

function FloatingArea({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <div className="relative">
        {children}
        <span className="pointer-events-none absolute left-4 top-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/55 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-focus:top-3 peer-focus:text-[11px] peer-focus:tracking-[0.15em] peer-focus:text-primary">{label}</span>
      </div>
      {error ? <span className="text-xs text-red-400">{error}</span> : null}
    </div>
  );
}

function SelectField({ label, register, options }: { label: string; register: UseFormRegisterReturn; options: readonly string[] }) {
  return (
    <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
      {label}
      <select {...register} className="h-12 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition-all duration-300 focus:border-primary/35 focus-visible:ring-2 focus-visible:ring-primary/30">
        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-950 text-white">{option}</option>
        ))}
      </select>
    </label>
  );
}

function SocialPill({ item }: { item: ContactSocialLink }) {
  const Icon = socialIconFor(item.label);
  const external = item.href.startsWith("http");
  return (
    <motion.div variants={staggerItem}>
      <Link
        href={item.href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="group inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-white"
      >
        <span className="text-primary transition-transform duration-300 group-hover:translate-x-0.5"><Icon className="h-4 w-4" /></span>
        {item.label}
      </Link>
    </motion.div>
  );
}

function socialIconFor(label: string) {
  switch (label) {
    case "GitHub":
      return GitHubIcon;
    case "LinkedIn":
      return LinkedInIcon;
    case "Instagram":
      return InstagramIcon;
    case "YouTube":
      return YouTubeIcon;
    default:
      return WebsiteIcon;
  }
}

function GitHubIcon(props: ComponentProps<"svg">) {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}><path d="M12 .5A11.5 11.5 0 0 0 8.36 22.9c.58.1.79-.25.79-.56v-2.14c-3.23.7-3.91-1.37-3.91-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.58-.3-5.29-1.29-5.29-5.74 0-1.27.45-2.3 1.2-3.12-.12-.29-.52-1.47.11-3.07 0 0 .98-.31 3.17 1.19a10.95 10.95 0 0 1 5.76 0c2.19-1.5 3.17-1.19 3.17-1.19.63 1.6.23 2.78.11 3.07.75.82 1.2 1.85 1.2 3.12 0 4.46-2.72 5.44-5.31 5.73.42.36.79 1.08.79 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" /></svg>;
}

function LinkedInIcon(props: ComponentProps<"svg">) {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" /></svg>;
}

function InstagramIcon(props: ComponentProps<"svg">) {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 2.69.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.36-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.36-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" /></svg>;
}

function YouTubeIcon(props: ComponentProps<"svg">) {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" /></svg>;
}

function WebsiteIcon(props: ComponentProps<"svg">) {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}><path d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2Zm6.93 9h-3.12a15.3 15.3 0 0 0-1.37-5A8.03 8.03 0 0 1 18.93 11ZM12 4.06A13.35 13.35 0 0 1 13.87 11h-3.74A13.35 13.35 0 0 1 12 4.06ZM4.07 13h3.12a15.3 15.3 0 0 0 1.37 5A8.03 8.03 0 0 1 4.07 13Zm3.12-2H4.07a8.03 8.03 0 0 1 4.49-5 15.3 15.3 0 0 0-1.37 5Zm4.81 8.94A13.35 13.35 0 0 1 10.13 13h3.74A13.35 13.35 0 0 1 12 19.94ZM14.19 13h-4.38a13.3 13.3 0 0 1 0-2h4.38a13.3 13.3 0 0 1 0 2Zm.25 5a15.3 15.3 0 0 0 1.37-5h3.12a8.03 8.03 0 0 1-4.49 5Z" /></svg>;
}

export function ContactExperienceSkeleton() {
  return (
    <div className="animate-pulse bg-background">
      <section className="section-container grid gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-28 2xl:max-w-screen-2xl 2xl:px-20 2xl:py-36">
        <div className="space-y-6">
          <div className="h-8 w-44 rounded-full bg-white/10" />
          <div className="h-16 w-full max-w-xl rounded-2xl bg-white/10 sm:h-20" />
          <div className="space-y-3 max-w-xl"><div className="h-4 w-full rounded-full bg-white/10" /><div className="h-4 w-5/6 rounded-full bg-white/10" /></div>
        </div>
        <div className="h-[620px] rounded-[32px] bg-white/[0.05]" />
      </section>
      <section className="section-container px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28 2xl:max-w-screen-2xl 2xl:px-20 2xl:py-36">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">{[0,1,2,3].map((item)=><div key={item} className="h-52 rounded-[28px] bg-white/[0.05]" />)}</div>
      </section>
    </div>
  );
}

