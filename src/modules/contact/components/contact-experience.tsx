"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import type { z } from "zod";
import { ChevronDown, Clock, GitFork, Globe, Mail, MapPin, Phone, Play, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animation-variants";
import {
  CONTACT_BUDGET_RANGES,
  CONTACT_SECTIONS,
  CONTACT_SERVICE_TYPES,
  CONTACT_TIMELINES,
} from "../constants";
import { submitContactInquiry } from "../actions";
import { contactInquirySchema, type ContactInquirySchema } from "../validations";
import type { ContactPageData } from "../types";

const iconMap = { MapPin, Phone, Mail, Clock };
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

  const onSubmit = async (values: ContactFormValues) => {
    const result = await submitContactInquiry(values);
    if (result.success) {
      setSent(true);
      toast.success("Message sent successfully");
      reset();
      window.setTimeout(() => setSent(false), 4500);
      return;
    }
    toast.error(result.error ?? "Failed to send message");
  };

  return (
    <>
      <section id={CONTACT_SECTIONS.form} className="section-padding scroll-mt-24 bg-background">
        <div className="section-container grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeIn} className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Project inquiry</p>
            <h2 className="text-3xl font-bold sm:text-4xl">{data.contact_form.title}</h2>
            {data.contact_form.subtitle && <p className="text-lg leading-relaxed text-muted-foreground">{data.contact_form.subtitle}</p>}
            <div className="grid gap-4 pt-4 sm:grid-cols-3">
              {["Fast reply", "Clear scope", "Admin tracked"].map((item) => (
                <div key={item} className="rounded-xl border border-border bg-card p-4 text-sm font-medium shadow-sm">
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.form
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4 rounded-xl border border-border bg-card p-5 shadow-xl sm:p-6"
          >
            <input className="hidden" tabIndex={-1} autoComplete="off" {...register("website")} aria-hidden="true" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.name?.message}><Input {...register("name")} placeholder="Rohit Rathod" /></Field>
              <Field label="Email" error={errors.email?.message}><Input type="email" {...register("email")} placeholder="you@example.com" /></Field>
              <Field label="Phone" error={errors.phone?.message}><Input {...register("phone")} placeholder="+91 98765 43210" /></Field>
              <Field label="Company" error={errors.company?.message}><Input {...register("company")} placeholder="Company / startup" /></Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <SelectField label="Service" register={register("serviceType")} options={CONTACT_SERVICE_TYPES} />
              <SelectField label="Budget" register={register("budgetRange")} options={CONTACT_BUDGET_RANGES} />
              <SelectField label="Timeline" register={register("projectTimeline")} options={CONTACT_TIMELINES} />
            </div>
            <Field label="Subject" error={errors.subject?.message}><Input {...register("subject")} placeholder="New website project" /></Field>
            <Field label="Message" error={errors.message?.message}>
              <Textarea {...register("message")} rows={6} placeholder="Tell us about the goal, current stage, and what success looks like..." />
            </Field>
            <Button type="submit" disabled={isSubmitting} className="h-12">
              <Send className="mr-2 h-4 w-4" aria-hidden="true" />
              {isSubmitting ? "Sending..." : sent ? "Sent" : data.contact_form.submitText}
            </Button>
          </motion.form>
        </div>
      </section>

      <section id={CONTACT_SECTIONS.info} className="section-padding scroll-mt-24 bg-muted/30">
        <div className="section-container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{data.contact_info.title}</h2>
            {data.contact_info.subtitle && <p className="text-lg text-muted-foreground">{data.contact_info.subtitle}</p>}
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {data.contact_info.items.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap] ?? MapPin;
              return (
                <button
                  key={`${item.label}-${item.value}`}
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(item.value).then(() => toast.success(`${item.label} copied`))}
                  className="rounded-xl border border-border bg-card p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon className="mb-4 h-8 w-8 text-primary" aria-hidden="true" />
                  <h3 className="font-semibold">{item.label}</h3>
                  <p className="mt-2 break-words text-muted-foreground">{item.value}</p>
                </button>
              );
            })}
          </div>
          {data.contact_info.workingHours && (
            <p className="mt-8 text-center text-muted-foreground">
              <Clock className="mr-2 inline h-4 w-4" aria-hidden="true" />
              {data.contact_info.workingHours}
            </p>
          )}
        </div>
      </section>

      <section id={CONTACT_SECTIONS.offices} className="section-padding scroll-mt-24 bg-background">
        <div className="section-container grid gap-6 md:grid-cols-2">
          <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <MapPin className="h-9 w-9 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-bold">RaYnk Labs Studio</h2>
            <p className="mt-3 text-muted-foreground">
              Remote-first delivery with India-based availability for project discovery, sprint planning, and support.
            </p>
          </article>
          <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <Clock className="h-9 w-9 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-bold">Response Window</h2>
            <p className="mt-3 text-muted-foreground">
              Most project inquiries receive a practical next-step response within one business day.
            </p>
          </article>
        </div>
      </section>

      <section id={CONTACT_SECTIONS.faq} className="section-padding scroll-mt-24 bg-muted/30">
        <div className="section-container mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{data.faq.title}</h2>
            {data.faq.subtitle && <p className="text-lg text-muted-foreground">{data.faq.subtitle}</p>}
          </div>
          <div className="space-y-3">
            {data.faq.items.map((item, index) => (
              <div key={item.question} className="overflow-hidden rounded-xl border border-border bg-card">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  aria-expanded={openFaq === index}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left font-medium hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.question}
                  <ChevronDown className={`h-5 w-5 transition-transform ${openFaq === index ? "rotate-180" : ""}`} />
                </button>
                {openFaq === index && <div className="px-4 pb-4 text-muted-foreground">{item.answer}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {data.map.embedUrl && (
        <section id={CONTACT_SECTIONS.map} className="section-padding scroll-mt-24 bg-background">
          <div className="section-container">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">{data.map.title}</h2>
            </div>
            <div className="aspect-video overflow-hidden rounded-xl border border-border bg-muted shadow-sm">
              <iframe
                src={data.map.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="RaYnk Labs location map"
              />
            </div>
          </div>
        </section>
      )}

      <section id={CONTACT_SECTIONS.social} className="section-padding scroll-mt-24 bg-muted/30">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Connect With Us</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              ["GitHub", GitFork, "https://github.com"],
              ["LinkedIn", Globe, "https://linkedin.com"],
              ["Instagram", Globe, "https://instagram.com"],
              ["YouTube", Play, "https://youtube.com"],
              ["Website", Globe, "/"],
            ].map(([label, Icon, href]) => (
              <Button key={label as string} asChild variant="outline" size="lg">
                <Link href={href as string} target={(href as string).startsWith("http") ? "_blank" : undefined}>
                  <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
                  {label as string}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section id={CONTACT_SECTIONS.cta} className="section-padding scroll-mt-24 bg-primary text-primary-foreground">
        <div className="section-container text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-3xl font-bold sm:text-4xl">{data.contact_cta.title}</h2>
            <p className="text-lg opacity-90">{data.contact_cta.subtitle}</p>
            <Button asChild size="lg" variant="secondary">
              <Link href={data.contact_cta.buttonLink}>{data.contact_cta.buttonText}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  );
}

function SelectField({
  label,
  register,
  options,
}: {
  label: string;
  register: UseFormRegisterReturn;
  options: readonly string[];
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <select {...register} className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
