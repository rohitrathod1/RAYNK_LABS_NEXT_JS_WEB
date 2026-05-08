"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  BriefcaseBusiness,
  Globe,
  Loader2,
  Mail,
  Phone,
  Save,
  Upload,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button, Input, Label, Textarea } from "@/components/ui";
import { SafeImage } from "@/components/common/safe-image";
import { toSrc } from "@/components/common/image-upload";
import { TeamCard } from "@/modules/team/components/team-card";
import { profileUpdateSchema } from "@/modules/profile/validations";
import type { ProfileData } from "@/modules/profile/types";
import type { ProfileUpdateSchema } from "@/modules/profile/validations";

export const dynamic = "force-dynamic";

type ProfileForm = ProfileUpdateSchema;

const emptyForm: ProfileForm = {
  name: "",
  email: "",
  mobile: "",
  imageUrl: "",
  bio: "",
  designation: "",
  github: "",
  linkedin: "",
  instagram: "",
  youtube: "",
  portfolio: "",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";
}

function cardClassName(className = "") {
  return `rounded-2xl border border-border bg-card p-6 shadow-sm ${className}`;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: emptyForm,
  });

  const watchedValues = watch();
  const previewName = watchedValues.name || profile?.name || "Team Member";
  const previewImage = watchedValues.imageUrl || profile?.imageUrl || "";
  const previewRole = watchedValues.designation || (profile?.role === "SUPER_ADMIN" ? "Super Admin" : "Admin");
  const previewPhone = watchedValues.mobile || profile?.mobile || "";
  const previewEmail = watchedValues.email || profile?.email || "";

  useEffect(() => {
    let active = true;
    fetch("/api/admin/profile", { cache: "no-store" })
      .then((response) => response.json())
      .then(({ success, data, error }) => {
        if (!active) return;
        if (!success) throw new Error(error ?? "Failed to load profile");
        setProfile(data);
        reset({
          name: data.name ?? "",
          email: data.email ?? "",
          mobile: data.mobile ?? "",
          imageUrl: data.imageUrl ?? "",
          bio: data.bio ?? "",
          designation: data.designation ?? "",
          github: data.github ?? "",
          linkedin: data.linkedin ?? "",
          instagram: data.instagram ?? "",
          youtube: data.youtube ?? "",
          portfolio: data.portfolio ?? "",
        });
      })
      .catch((error) => toast.error(error instanceof Error ? error.message : "Failed to load profile"))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reset]);

  async function uploadAvatar(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile photo must be 5MB or smaller");
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error ?? "Upload failed");
      setValue("imageUrl", payload.data.filename, { shouldDirty: true, shouldValidate: true });
      toast.success("Profile photo uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: ProfileForm) {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error ?? "Failed to update profile");
      setProfile(payload.data);
      reset({
        name: payload.data.name ?? "",
        email: payload.data.email ?? "",
        mobile: payload.data.mobile ?? "",
        imageUrl: payload.data.imageUrl ?? "",
        bio: payload.data.bio ?? "",
        designation: payload.data.designation ?? "",
        github: payload.data.github ?? "",
        linkedin: payload.data.linkedin ?? "",
        instagram: payload.data.instagram ?? "",
        youtube: payload.data.youtube ?? "",
        portfolio: payload.data.portfolio ?? "",
      });
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return <div className="p-6 text-sm text-destructive">Profile not found.</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-6xl space-y-7 py-4">
      <div>
        <h1 className="flex items-center gap-3 text-3xl font-black tracking-tight">
          <span className="text-primary">My Profile</span>
          <User className="h-7 w-7 text-primary" />
        </h1>
        <p className="mt-6 text-sm text-muted-foreground">Manage your profile information and account settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[330px_minmax(0,1fr)] xl:grid-cols-[330px_minmax(0,1fr)]">
        <div className="space-y-6">
          <section className={cardClassName()}>
            <h2 className="text-lg font-bold">Profile Photo</h2>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative mx-auto mt-6 flex h-48 w-48 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary/10 ring-1 ring-primary/10 transition-all duration-300 hover:scale-[1.02] hover:ring-primary/40 hover:shadow-lg"
            >
              {previewImage ? (
                <SafeImage src={toSrc(previewImage)} alt={previewName} width={192} height={192} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-6xl font-black text-primary">
                  {initials(previewName)}
                </span>
              )}
              <span className="absolute inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-xs text-foreground opacity-0 transition group-hover:opacity-100">
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                Upload
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadAvatar(file);
                event.target.value = "";
              }}
            />
            <p className="mt-5 text-center text-xs text-muted-foreground">Click the image to upload a new photo (Max 5MB)</p>
          </section>

          <section className={cardClassName()}>
            <h2 className="text-lg font-bold">Live Preview</h2>
            <p className="mt-2 text-xs text-muted-foreground">Frontend Team Member card preview</p>
            <div className="mt-5">
              <TeamCard
                member={{
                  id: profile.id,
                  displayName: previewName,
                  role: previewRole,
                  bio: watchedValues.bio,
                  avatar: previewImage || undefined,
                  email: previewEmail || undefined,
                  phone: previewPhone || undefined,
                  githubUrl: watchedValues.github || undefined,
                  linkedinUrl: watchedValues.linkedin || undefined,
                  instagramUrl: watchedValues.instagram || undefined,
                  youtubeUrl: watchedValues.youtube || undefined,
                  portfolioUrl: watchedValues.portfolio || undefined,
                }}
              />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className={cardClassName()}>
            <h2 className="text-lg font-bold">Basic Information</h2>
            <div className="mt-6 grid gap-5">
              <Field label="Full Name" error={errors.name?.message}>
                <Input {...register("name")} placeholder="Enter your full name" className="h-12 rounded-xl border-border bg-background px-4 focus-visible:ring-primary/30" />
              </Field>

              <Field label="Mobile Number" helper="Displayed on Team page" icon={<Phone className="h-4 w-4" />} error={errors.mobile?.message}>
                <Input {...register("mobile")} placeholder="+91 98765 43210" className="h-12 rounded-xl border-border bg-background px-4 focus-visible:ring-primary/30" />
              </Field>

              <Field label="Email" helper="Displayed on Team page" icon={<Mail className="h-4 w-4" />} error={errors.email?.message}>
                <Input {...register("email")} type="email" placeholder="your.email@example.com" className="h-12 rounded-xl border-border bg-background px-4 focus-visible:ring-primary/30" />
              </Field>

              <Field label="Short Bio" error={errors.bio?.message}>
                <Textarea {...register("bio")} rows={4} placeholder="Tell visitors about your work..." className="resize-none rounded-xl border-border bg-background px-4 py-3 focus-visible:ring-primary/30" />
              </Field>

              <Field label="Designation/Role" icon={<BriefcaseBusiness className="h-4 w-4" />} error={errors.designation?.message}>
                <Input {...register("designation")} placeholder="Founder, Designer, Developer..." className="h-12 rounded-xl border-border bg-background px-4 focus-visible:ring-primary/30" />
              </Field>
            </div>
          </section>

          <section className={cardClassName()}>
            <h2 className="text-lg font-bold">Social Links</h2>
            <p className="mt-5 text-xs text-muted-foreground">These links will be displayed on your Team Member card</p>
            <div className="mt-5 grid gap-5">
              <Field label="GitHub" icon={<BrandIcon name="github" />} error={errors.github?.message}>
                <Input {...register("github")} placeholder="https://github.com/yourusername" className="h-12 rounded-xl border-border bg-background px-4 focus-visible:ring-primary/30" />
              </Field>
              <Field label="Instagram" icon={<BrandIcon name="instagram" />} error={errors.instagram?.message}>
                <Input {...register("instagram")} placeholder="https://instagram.com/yourusername" className="h-12 rounded-xl border-border bg-background px-4 focus-visible:ring-primary/30" />
              </Field>
              <Field label="LinkedIn" icon={<BrandIcon name="linkedin" />} error={errors.linkedin?.message}>
                <Input {...register("linkedin")} placeholder="https://linkedin.com/in/yourusername" className="h-12 rounded-xl border-border bg-background px-4 focus-visible:ring-primary/30" />
              </Field>
              <Field label="Portfolio" icon={<Globe className="h-4 w-4" />} error={errors.portfolio?.message}>
                <Input {...register("portfolio")} placeholder="https://yourportfolio.com" className="h-12 rounded-xl border-border bg-background px-4 focus-visible:ring-primary/30" />
              </Field>
              <Field label="YouTube" icon={<BrandIcon name="youtube" />} error={errors.youtube?.message}>
                <Input {...register("youtube")} placeholder="https://youtube.com/@yourusername" className="h-12 rounded-xl border-border bg-background px-4 focus-visible:ring-primary/30" />
              </Field>
            </div>
          </section>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saving || uploading}
          className="h-12 cursor-pointer rounded-2xl bg-primary px-8 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.03] hover:bg-primary/90"
        >
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Profile
        </Button>
      </div>
    </form>
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

function Field({
  label,
  helper,
  icon,
  error,
  children,
}: {
  label: string;
  helper?: string;
  icon?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label className="flex items-center gap-2 text-sm font-bold">
        {icon}
        {label}
        {helper && <span className="text-xs font-normal text-muted-foreground">({helper})</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
