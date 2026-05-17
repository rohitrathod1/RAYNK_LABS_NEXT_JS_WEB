"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MessageSquareText, Send, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { CollaborationCtaSection } from "../types";
import {
  ABOUT_INQUIRY_TYPES,
  aboutInquirySchema,
  type AboutInquirySchema,
} from "../validations";
import { AboutIcon } from "./shared/icon";
import { AboutSectionHeading } from "./shared/section-heading";

const defaultValues: AboutInquirySchema = {
  fullName: "",
  email: "",
  companyName: "",
  inquiryType: ABOUT_INQUIRY_TYPES[0],
  message: "",
  website: "",
};

const submissionTypeMap: Record<(typeof ABOUT_INQUIRY_TYPES)[number], string> = {
  "Work With Us": "work_with_us",
  "Join Team": "join_team",
  Feedback: "feedback",
  Partnership: "partnership",
  "Project Inquiry": "project_inquiry",
};

export function CollaborationSection({ data }: { data: CollaborationCtaSection }) {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AboutInquirySchema>({
    resolver: zodResolver(aboutInquirySchema),
    defaultValues,
  });

  const onSubmit = async (values: AboutInquirySchema) => {
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: submissionTypeMap[values.inquiryType],
          name: values.fullName,
          email: values.email,
          company: values.companyName,
          subject: values.inquiryType,
          message: values.message,
          sourcePage: "/about",
          metadata: {
            inquiryType: values.inquiryType,
            channel: "about_page",
          },
          website: values.website,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error ?? "Failed to send inquiry");
      }
      reset(defaultValues);
      setSent(true);
      toast.success(data.successMessage);
      window.setTimeout(() => setSent(false), 4200);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send inquiry");
    }
  };

  return (
    <section id="section7-about-collaborate" className="section-padding bg-background">
      <div className="section-container">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-primary backdrop-blur-xl">
              <MessageSquareText className="h-3.5 w-3.5" aria-hidden="true" />
              Collaboration
            </div>
            <AboutSectionHeading title={data.title} subtitle={data.subtitle} align="left" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-3">
              {data.highlights.map((item, index) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.16 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="flex h-full min-w-0 flex-col rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl sm:p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <AboutIcon name={item.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold leading-tight text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                </motion.article>
              ))}
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(59,130,246,0.12),rgba(255,255,255,0.03),rgba(0,0,0,0.12))] p-5 backdrop-blur-xl">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Thoughtful replies, not canned responses</p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    We use this form for project discussions, hiring interest, partnerships, and direct feedback. Submissions are stored in the admin dashboard so follow-up stays organized.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.14 }}
            transition={{ duration: 0.64, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            onSubmit={handleSubmit(onSubmit)}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_36%),rgba(255,255,255,0.03)] p-6 shadow-[0_24px_90px_-44px_rgba(15,23,42,1)] backdrop-blur-2xl sm:p-8"
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_40%,rgba(168,85,247,0.08))]" />
            <div className="relative space-y-5">
              <input className="hidden" tabIndex={-1} autoComplete="off" {...register("website")} aria-hidden="true" />
              <div className="grid gap-4 sm:grid-cols-2 md:items-start">
                <FieldGroup label="Full Name" error={errors.fullName?.message}>
                  <input {...register("fullName")} className={fieldClassName} />
                </FieldGroup>
                <FieldGroup label="Email" error={errors.email?.message}>
                  <input type="email" {...register("email")} className={fieldClassName} />
                </FieldGroup>
              </div>

              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_240px] md:items-start">
                <FieldGroup label="Company Name" error={errors.companyName?.message}>
                  <input {...register("companyName")} className={fieldClassName} />
                </FieldGroup>
                <SelectField label="Inquiry Type" registration={register("inquiryType")} options={ABOUT_INQUIRY_TYPES} />
              </div>

              <FieldGroup label="Message" error={errors.message?.message}>
                <Textarea
                  {...register("message")}
                  rows={6}
                  className="min-h-[190px] rounded-[22px] border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/40 focus:bg-black/30 focus:ring-2 focus:ring-primary/20"
                />
              </FieldGroup>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-white/55">
                  Best for project work, partnership inquiry, career interest, or product feedback.
                </p>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="h-12 rounded-full px-7 shadow-[0_18px_50px_-22px_rgba(59,130,246,0.8)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_24px_68px_-20px_rgba(59,130,246,0.92)]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Sending...
                    </>
                  ) : (
                    <>
                      {sent ? "Sent" : data.submitText}
                      <Send className="h-4 w-4" aria-hidden="true" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

const fieldClassName =
  "h-14 w-full rounded-[22px] border border-white/10 bg-black/20 px-4 text-sm text-foreground outline-none transition focus:border-primary/40 focus:bg-black/30 focus:ring-2 focus:ring-primary/20";

function FieldGroup({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-medium text-foreground">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">{label}</span>
      {children}
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </label>
  );
}

function SelectField({
  label,
  registration,
  options,
}: {
  label: string;
  registration: ReturnType<typeof useForm<AboutInquirySchema>>["register"] extends (...args: never[]) => infer R ? R : never;
  options: readonly string[];
}) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-medium text-foreground">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">{label}</span>
      <select {...registration} className="h-14 w-full rounded-[22px] border border-white/10 bg-black/20 px-4 text-sm text-foreground outline-none transition focus:border-primary/40 focus:bg-black/30 focus:ring-2 focus:ring-primary/20">
        {options.map((type) => (
          <option key={type} value={type} className="bg-slate-950 text-foreground">
            {type}
          </option>
        ))}
      </select>
    </label>
  );
}
