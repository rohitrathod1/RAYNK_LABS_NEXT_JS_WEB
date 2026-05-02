"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactInquirySchema, type ContactInquirySchema } from "../validations";
import { submitContactInquiry } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function ContactFormSection({ title, subtitle, submitText }: { title: string; subtitle: string; submitText: string }) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(contactInquirySchema),
  });

  const onSubmit = async (data: ContactInquirySchema) => {
    setLoading(true);
    try {
      const res = await submitContactInquiry(data);
      if (res.success) {
        toast.success("Message sent successfully!");
        reset();
      } else {
        toast.error(res.error ?? "Failed to send message");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-padding bg-muted/30">
      <div className="section-container max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-muted-foreground">{subtitle}</p>}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card p-8 rounded-lg border">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">Name *</label>
            <Input id="name" {...register("name")} placeholder="Your name" />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email *</label>
            <Input id="email" type="email" {...register("email")} placeholder="your@email.com" />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone</label>
            <Input id="phone" {...register("phone")} placeholder="+91 98765 43210" />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
            <Input id="subject" {...register("subject")} placeholder="Project inquiry" />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">Message *</label>
            <Textarea id="message" {...register("message")} placeholder="Tell us about your project..." rows={5} />
            {errors.message && <p className="text-sm text-destructive mt-1">{errors.message.message}</p>}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Sending..." : submitText}
          </Button>
        </form>
      </div>
    </section>
  );
}
