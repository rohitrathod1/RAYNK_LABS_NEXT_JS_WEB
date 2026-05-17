"use client";

import { useEffect, useMemo, type ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Textarea,
} from "@/components/ui";
import { scaleIn, staggerContainer, staggerItem } from "@/lib/animation-variants";
import { SERVICE_BUDGET_RANGES, SERVICE_PROJECT_TIMELINES } from "../constants";

import { serviceInquirySchema, type ServiceInquirySchema } from "../validations";

const defaultValues: ServiceInquirySchema = {
  fullName: "",
  email: "",
  contactNumber: "",
  companyName: "",
  serviceName: "",
  budgetRange: SERVICE_BUDGET_RANGES[2],
  projectTimeline: SERVICE_PROJECT_TIMELINES[2],
  projectDescription: "",
  website: "",
};

export function ServiceInquiryDialog({
  open,
  onOpenChange,
  serviceName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceName: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServiceInquirySchema>({
    resolver: zodResolver(serviceInquirySchema),
    defaultValues,
  });

  useEffect(() => {
    setValue("serviceName", serviceName || "Project Inquiry", { shouldValidate: true });
  }, [serviceName, setValue]);

  useEffect(() => {
    if (!open) reset({ ...defaultValues, serviceName: serviceName || "Project Inquiry" });
  }, [open, reset, serviceName]);

  const description = useMemo(() => {
    if (!serviceName) return "Tell us a bit about what you are trying to build.";
    return `Share the goals, constraints, and scope for ${serviceName}.`;
  }, [serviceName]);

  async function onSubmit(values: ServiceInquirySchema) {
    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "service",
          name: values.fullName,
          email: values.email,
          phone: values.contactNumber,
          company: values.companyName,
          subject: values.serviceName,
          service: values.serviceName,
          serviceName: values.serviceName,
          budget: values.budgetRange,
          timeline: values.projectTimeline,
          message: values.projectDescription,
          sourcePage: "/services",
          metadata: {
            budget: values.budgetRange,
            timeline: values.projectTimeline,
            channel: "services_modal",
          },
          website: values.website,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error ?? "Failed to submit request");
      toast.success("Your request has been submitted successfully. Our team will contact you soon.");
      onOpenChange(false);
      reset({ ...defaultValues, serviceName: values.serviceName });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit request");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden rounded-[2rem] border-white/10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_28%),rgba(6,8,16,0.96)] p-0 text-foreground shadow-[0_24px_90px_-44px_rgba(15,23,42,1)] backdrop-blur-2xl">
        <motion.div initial="hidden" animate="visible" variants={scaleIn} className="grid gap-0 md:grid-cols-[0.88fr_1.12fr]">
          <div className="relative overflow-hidden border-b border-white/10 p-7 md:border-b-0 md:border-r md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
            <DialogHeader className="relative text-left">
              <DialogTitle className="text-2xl font-black tracking-tight">Get Service</DialogTitle>
              <DialogDescription className="mt-2 text-sm leading-6 text-white/65">{description}</DialogDescription>
            </DialogHeader>
            <div className="relative mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Selected service</p>
              <p className="mt-3 text-xl font-semibold text-foreground">{serviceName || "Project Inquiry"}</p>
              <p className="mt-3 text-sm leading-6 text-white/62">We will use this selection to route the request inside the admin submissions dashboard with the right context.</p>
            </div>
          </div>

          <motion.form variants={staggerContainer} onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-7 md:p-8">
            <input className="hidden" tabIndex={-1} autoComplete="off" {...register("website")} aria-hidden="true" />
            <motion.div variants={staggerItem} className="grid gap-4 sm:grid-cols-2">
              <FloatingField label="Full Name" error={errors.fullName?.message}><input {...register("fullName")} placeholder=" " className="peer h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 pt-6 text-sm text-foreground outline-none transition focus:border-primary/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-primary/20" /></FloatingField>
              <FloatingField label="Email" error={errors.email?.message}><input type="email" {...register("email")} placeholder=" " className="peer h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 pt-6 text-sm text-foreground outline-none transition focus:border-primary/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-primary/20" /></FloatingField>
            </motion.div>
            <motion.div variants={staggerItem} className="grid gap-4 sm:grid-cols-2">
              <FloatingField label="Contact Number" error={errors.contactNumber?.message}><input {...register("contactNumber")} placeholder=" " className="peer h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 pt-6 text-sm text-foreground outline-none transition focus:border-primary/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-primary/20" /></FloatingField>
              <FloatingField label="Company Name" error={errors.companyName?.message}><input {...register("companyName")} placeholder=" " className="peer h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 pt-6 text-sm text-foreground outline-none transition focus:border-primary/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-primary/20" /></FloatingField>
            </motion.div>
            <motion.div variants={staggerItem} className="grid gap-4 sm:grid-cols-3">
              <FloatingField label="Service Name" error={errors.serviceName?.message}><input {...register("serviceName")} placeholder=" " readOnly className="peer h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 pt-6 text-sm text-foreground outline-none" /></FloatingField>
              <SelectField label="Budget Range" error={errors.budgetRange?.message} registration={register("budgetRange")} options={SERVICE_BUDGET_RANGES} />
              <SelectField label="Project Timeline" error={errors.projectTimeline?.message} registration={register("projectTimeline")} options={SERVICE_PROJECT_TIMELINES} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <FloatingTextarea label="Project Description" error={errors.projectDescription?.message}>
                <Textarea {...register("projectDescription")} rows={6} placeholder=" " className="peer min-h-[170px] rounded-[1.5rem] border-white/10 bg-white/[0.03] px-4 pt-7 text-sm text-foreground outline-none transition focus:border-primary/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-primary/20" />
              </FloatingTextarea>
            </motion.div>
            <motion.div variants={staggerItem} className="flex items-center justify-between gap-3 pt-2">
              <p className="text-sm text-white/55">Stored securely and visible in the admin submissions dashboard.</p>
              <Button type="submit" size="lg" disabled={isSubmitting} className="h-12 rounded-full px-7 shadow-[0_18px_50px_-22px_rgba(59,130,246,0.8)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_24px_68px_-20px_rgba(59,130,246,0.92)]">
                {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : <>Submit Request<Send className="h-4 w-4" /></>}
              </Button>
            </motion.div>
          </motion.form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

function FloatingField({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return <label className="relative block">{children}<span className="pointer-events-none absolute left-4 top-4 text-sm text-white/48 transition-all peer-placeholder-shown:top-[1.05rem] peer-focus:top-2.5 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-primary peer-not-placeholder-shown:top-2.5 peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:uppercase peer-not-placeholder-shown:tracking-[0.18em] peer-not-placeholder-shown:text-white/48">{label}</span>{error ? <span className="mt-2 block text-xs text-destructive">{error}</span> : null}</label>;
}

function FloatingTextarea({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return <label className="relative block">{children}<span className="pointer-events-none absolute left-4 top-4 text-sm text-white/48 transition-all peer-placeholder-shown:top-4 peer-focus:top-2.5 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-[0.18em] peer-focus:text-primary peer-not-placeholder-shown:top-2.5 peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:font-semibold peer-not-placeholder-shown:uppercase peer-not-placeholder-shown:tracking-[0.18em] peer-not-placeholder-shown:text-white/48">{label}</span>{error ? <span className="mt-2 block text-xs text-destructive">{error}</span> : null}</label>;
}

function SelectField({ label, error, registration, options }: { label: string; error?: string; registration: UseFormRegisterReturn; options: readonly string[] }) {
  return <label className="grid gap-2 text-sm font-medium"><span className="text-xs uppercase tracking-[0.18em] text-white/55">{label}</span><select {...registration} className="h-14 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-foreground outline-none transition focus:border-primary/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-primary/20">{options.map((option) => <option key={option} value={option} className="bg-slate-950 text-foreground">{option}</option>)}</select>{error ? <span className="text-xs text-destructive">{error}</span> : null}</label>;
}

function registerShim(name: string) {
  return { name };
}


