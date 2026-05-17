"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { BriefcaseBusiness, ChevronRight, FileText, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import type { TeamApplicationFormValues } from "../types";
import { teamApplicationSchema, type TeamApplicationSchema } from "../validations";

const EXPERIENCE_LEVELS = ["Intern", "Junior", "Mid-Level", "Senior", "Lead"] as const;

interface TeamApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeamApplicationDialog({ open, onOpenChange }: TeamApplicationDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resumeLabel, setResumeLabel] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TeamApplicationSchema>({
    resolver: zodResolver(teamApplicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      roleInterestedIn: "",
      experienceLevel: "",
      portfolioUrl: "",
      resumeUrl: "",
      message: "",
    },
  });

  async function uploadResume(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/team-resume", { method: "POST", body: formData });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error ?? "Upload failed");
      setValue("resumeUrl", payload.data.url, { shouldValidate: true, shouldDirty: true });
      setResumeLabel(payload.data.filename ?? file.name);
      toast.success("Resume uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: TeamApplicationFormValues) {
    setSubmitting(true);
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "join_team",
          name: values.fullName,
          email: values.email,
          phone: values.phone,
          subject: values.roleInterestedIn,
          message: values.message,
          sourcePage: "/team",
          metadata: {
            roleInterestedIn: values.roleInterestedIn,
            experienceLevel: values.experienceLevel,
            portfolioUrl: values.portfolioUrl || null,
            resumeUrl: values.resumeUrl,
          },
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error ?? "Failed to submit application");
      toast.success("Application submitted successfully. Our team will review your profile soon.");
      reset();
      setResumeLabel("");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-white/10 bg-[#0b0d14]/95 p-0 text-white shadow-[0_30px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl sm:max-w-3xl">
        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
              <div className="relative p-6 sm:p-8">
                <DialogHeader className="space-y-3 text-left">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                    <BriefcaseBusiness className="h-3.5 w-3.5 text-primary" />
                    Join Team
                  </div>
                  <DialogTitle className="text-2xl font-black sm:text-3xl">Apply to work with RaYnk Labs</DialogTitle>
                  <DialogDescription className="max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
                    Share your profile, role preference, and portfolio. We use this for full-time roles, internships, and collaboration requests.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 grid gap-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <FloatingField label="Full Name" error={errors.fullName?.message}>
                      <Input {...register("fullName")} className="peer h-12 rounded-2xl border-white/10 bg-white/5 px-4 pt-5 text-white placeholder:text-transparent focus-visible:ring-primary/30" placeholder="Full Name" />
                    </FloatingField>
                    <FloatingField label="Email" error={errors.email?.message}>
                      <Input {...register("email")} type="email" className="peer h-12 rounded-2xl border-white/10 bg-white/5 px-4 pt-5 text-white placeholder:text-transparent focus-visible:ring-primary/30" placeholder="Email" />
                    </FloatingField>
                    <FloatingField label="Phone Number" error={errors.phone?.message}>
                      <Input {...register("phone")} className="peer h-12 rounded-2xl border-white/10 bg-white/5 px-4 pt-5 text-white placeholder:text-transparent focus-visible:ring-primary/30" placeholder="Phone Number" />
                    </FloatingField>
                    <FloatingField label="Role Interested In" error={errors.roleInterestedIn?.message}>
                      <Input {...register("roleInterestedIn")} className="peer h-12 rounded-2xl border-white/10 bg-white/5 px-4 pt-5 text-white placeholder:text-transparent focus-visible:ring-primary/30" placeholder="Role Interested In" />
                    </FloatingField>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Experience Level</Label>
                      <Select value={watch("experienceLevel")} onValueChange={(value) => setValue("experienceLevel", value, { shouldValidate: true, shouldDirty: true })}>
                        <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-white/5 text-white focus:ring-primary/30">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          {EXPERIENCE_LEVELS.map((level) => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.experienceLevel?.message ? <p className="text-xs text-red-400">{errors.experienceLevel.message}</p> : null}
                    </div>
                    <FloatingField label="Portfolio URL" error={errors.portfolioUrl?.message}>
                      <Input {...register("portfolioUrl")} className="peer h-12 rounded-2xl border-white/10 bg-white/5 px-4 pt-5 text-white placeholder:text-transparent focus-visible:ring-primary/30" placeholder="Portfolio URL" />
                    </FloatingField>
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-xs font-semibold uppercase tracking-[0.16em] text-white/60">Resume Upload</Label>
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="group flex min-h-24 w-full items-center justify-between gap-4 rounded-3xl border border-dashed border-white/14 bg-white/[0.04] px-5 py-4 text-left transition-all duration-300 hover:border-primary/45 hover:bg-white/[0.06]"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-white">{resumeLabel || "Upload resume (PDF, DOC, DOCX)"}</p>
                        <p className="mt-1 text-sm text-white/55">Secure file validation, lightweight upload, and admin review ready.</p>
                      </div>
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary transition-transform duration-300 group-hover:-translate-y-0.5">
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                      </span>
                    </button>
                    <input
                      ref={inputRef}
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) void uploadResume(file);
                        event.target.value = "";
                      }}
                    />
                    {errors.resumeUrl?.message ? <p className="text-xs text-red-400">{errors.resumeUrl.message}</p> : null}
                  </div>

                  <FloatingArea label="Message" error={errors.message?.message}>
                    <Textarea {...register("message")} rows={6} className="peer rounded-3xl border-white/10 bg-white/5 px-4 pt-6 text-white placeholder:text-transparent focus-visible:ring-primary/30" placeholder="Tell us about your background, strengths, and the kind of work you want to do." />
                  </FloatingArea>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-white/55">We review every serious application manually.</p>
                    <Button type="submit" disabled={submitting || uploading} className="group h-12 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_18px_44px_rgba(59,130,246,0.34)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90">
                      {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                      Submit Application
                      <ChevronRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function FloatingField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <div className="relative">
        {children}
        <span className="pointer-events-none absolute left-4 top-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/55 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-focus:top-3 peer-focus:text-[11px] peer-focus:tracking-[0.15em] peer-focus:text-primary">
          {label}
        </span>
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

function FloatingArea({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <div className="relative">
        {children}
        <span className="pointer-events-none absolute left-4 top-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/55 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:tracking-normal peer-focus:top-3 peer-focus:text-[11px] peer-focus:tracking-[0.15em] peer-focus:text-primary">
          {label}
        </span>
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
