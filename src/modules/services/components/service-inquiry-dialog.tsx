"use client";

import { useEffect, useMemo } from "react";
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
      <DialogContent className="w-[calc(100vw-1rem)] max-w-3xl overflow-hidden rounded-[1.5rem] border-white/10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.16),transparent_28%),rgba(6,8,16,0.96)] p-0 text-foreground shadow-[0_24px_90px_-44px_rgba(15,23,42,1)] backdrop-blur-2xl max-sm:top-[50%] max-sm:max-h-[calc(100svh-1rem)] sm:w-[calc(100vw-2rem)] sm:rounded-[2rem] md:max-h-[min(860px,calc(100svh-2rem))]">
        <motion.div initial="hidden" animate="visible" variants={scaleIn} className="grid max-h-[inherit] min-h-0 gap-0 md:grid-cols-[0.86fr_1.14fr]">
          <div className="relative overflow-y-auto border-b border-white/10 p-5 md:max-h-[min(860px,calc(100svh-2rem))] md:border-b-0 md:border-r md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]" />
            <DialogHeader className="relative pr-8 text-left">
              <DialogTitle className="text-2xl font-black tracking-tight sm:text-[2rem]">Get Service</DialogTitle>
              <DialogDescription className="mt-2 text-sm leading-6 text-white/65">{description}</DialogDescription>
            </DialogHeader>
            <div className="relative mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl sm:mt-8 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Selected service</p>
              <p className="mt-3 text-xl font-semibold text-foreground sm:text-2xl">{serviceName || "Project Inquiry"}</p>
              <p className="mt-3 text-sm leading-6 text-white/62">
                We will use this selection to route the request inside the admin submissions dashboard with the right context.
              </p>
            </div>
          </div>

          <motion.form variants={staggerContainer} onSubmit={handleSubmit(onSubmit)} className="min-h-0 space-y-4 overflow-y-auto p-5 md:max-h-[min(860px,calc(100svh-2rem))] md:p-8">
            <input className="hidden" tabIndex={-1} autoComplete="off" {...register("website")} aria-hidden="true" />

            <motion.div variants={staggerItem} className="grid gap-4 sm:grid-cols-2">
              <FieldGroup label="Full Name" error={errors.fullName?.message}>
                <input {...register("fullName")} className={fieldClassName} />
              </FieldGroup>
              <FieldGroup label="Email" error={errors.email?.message}>
                <input type="email" {...register("email")} className={fieldClassName} />
              </FieldGroup>
            </motion.div>

            <motion.div variants={staggerItem} className="grid gap-4 sm:grid-cols-2">
              <FieldGroup label="Contact Number" error={errors.contactNumber?.message}>
                <input {...register("contactNumber")} className={fieldClassName} />
              </FieldGroup>
              <FieldGroup label="Company Name" error={errors.companyName?.message}>
                <input {...register("companyName")} className={fieldClassName} />
              </FieldGroup>
            </motion.div>

            <motion.div variants={staggerItem} className="grid gap-4 md:grid-cols-3 md:items-start">
              <FieldGroup label="Service Name" error={errors.serviceName?.message}>
                <input {...register("serviceName")} readOnly className={`${fieldClassName} truncate`} />
              </FieldGroup>
              <SelectField label="Budget Range" error={errors.budgetRange?.message} registration={register("budgetRange")} options={SERVICE_BUDGET_RANGES} />
              <SelectField label="Project Timeline" error={errors.projectTimeline?.message} registration={register("projectTimeline")} options={SERVICE_PROJECT_TIMELINES} />
            </motion.div>

            <motion.div variants={staggerItem}>
              <FieldGroup label="Project Description" error={errors.projectDescription?.message}>
                <Textarea {...register("projectDescription")} rows={6} className="min-h-[170px] rounded-[22px] border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-primary/20 sm:min-h-[190px]" />
              </FieldGroup>
            </motion.div>

            <motion.div variants={staggerItem} className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-sm leading-6 text-white/55">Stored securely and visible in the admin submissions dashboard.</p>
              <Button type="submit" size="lg" disabled={isSubmitting} className="h-12 w-full rounded-full px-7 shadow-[0_18px_50px_-22px_rgba(59,130,246,0.8)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_24px_68px_-20px_rgba(59,130,246,0.92)] sm:w-auto">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    Submit Request
                    <Send className="h-4 w-4" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

const fieldClassName =
  "h-14 w-full rounded-[22px] border border-white/10 bg-white/[0.03] px-4 text-sm text-foreground outline-none transition focus:border-primary/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-primary/20";

function FieldGroup({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
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
  error,
  registration,
  options,
}: {
  label: string;
  error?: string;
  registration: UseFormRegisterReturn;
  options: readonly string[];
}) {
  return (
    <label className="grid min-w-0 gap-2 text-sm font-medium text-foreground">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">{label}</span>
      <select
        {...registration}
        className="h-14 w-full rounded-[22px] border border-white/10 bg-white/[0.03] px-4 text-sm text-foreground outline-none transition focus:border-primary/40 focus:bg-white/[0.05] focus:ring-2 focus:ring-primary/20"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-slate-950 text-foreground">
            {option}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-destructive">{error}</span> : null}
    </label>
  );
}
