"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  BriefcaseBusiness,
  GitFork,
  Globe,
  Mail,
  Phone,
  Play,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/common/safe-image";
import { fadeIn, staggerContainer, staggerItem } from "@/lib/animation-variants";
import { TEAM_DEPARTMENT_ALL, TEAM_SECTIONS } from "../constants";
import type { CtaSection, IntroSection, TeamMember, TeamMembersSection, ValuesSection } from "../types";

interface TeamShowcaseProps {
  intro: IntroSection;
  membersSection: TeamMembersSection;
  values: ValuesSection;
  cta: CtaSection;
  members: TeamMember[];
}

function getRoleLabel(role: string) {
  return role === "SUPER_ADMIN" ? "Super Admin" : role === "ADMIN" ? "Admin" : role;
}

function getDepartment(role: string) {
  const normalized = role.toLowerCase();
  if (normalized.includes("founder") || normalized.includes("ceo") || normalized.includes("admin")) return "Leadership";
  if (normalized.includes("design") || normalized.includes("ui") || normalized.includes("ux")) return "Design";
  if (normalized.includes("seo") || normalized.includes("marketing") || normalized.includes("growth")) return "Marketing";
  if (normalized.includes("manager") || normalized.includes("operation")) return "Management";
  return "Development";
}

function socialLinks(member: TeamMember) {
  return [
    { href: member.linkedinUrl, label: "LinkedIn", icon: Globe },
    { href: member.githubUrl, label: "GitHub", icon: GitFork },
    { href: member.instagramUrl, label: "Instagram", icon: Globe },
    { href: member.youtubeUrl, label: "YouTube", icon: Play },
    { href: member.portfolioUrl, label: "Portfolio", icon: Globe },
    { href: member.email ? `mailto:${member.email}` : undefined, label: "Email", icon: Mail },
    { href: member.phone ? `tel:${member.phone}` : undefined, label: "Phone", icon: Phone },
  ].filter((item) => Boolean(item.href));
}

function TeamCard({
  member,
  featured = false,
  onPreview,
}: {
  member: TeamMember;
  featured?: boolean;
  onPreview: (member: TeamMember) => void;
}) {
  const links = socialLinks(member);

  return (
    <article className={`group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${featured ? "lg:grid lg:grid-cols-[0.9fr_1.1fr]" : ""}`}>
      <div className={`relative overflow-hidden ${featured ? "min-h-80" : "h-72"}`}>
        <SafeImage
          src={member.avatar ?? "placeholder.png"}
          alt={member.displayName}
          fill
          sizes={featured ? "(max-width: 1024px) 100vw, 40vw" : "(max-width: 768px) 100vw, 33vw"}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 to-transparent" />
        {member.isFeatured && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Featured
          </span>
        )}
      </div>
      <div className="space-y-4 p-6">
        <div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {getRoleLabel(member.role)}
          </span>
          <h3 className="mt-3 text-2xl font-bold">{member.displayName}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{getDepartment(member.role)}</p>
        </div>
        {member.bio && (
          <p className={`${featured ? "" : "line-clamp-3"} text-sm leading-relaxed text-muted-foreground`}>
            {member.bio}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href!}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`${member.displayName} ${label}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </Link>
          ))}
        </div>
        <Button type="button" variant="outline" onClick={() => onPreview(member)}>
          View Profile
        </Button>
      </div>
    </article>
  );
}

export function TeamShowcase({ intro, membersSection, values, cta, members }: TeamShowcaseProps) {
  const [activeDepartment, setActiveDepartment] = useState(TEAM_DEPARTMENT_ALL);
  const [previewMember, setPreviewMember] = useState<TeamMember | null>(null);

  const departments = useMemo(() => {
    const items = Array.from(new Set(members.map((member) => getDepartment(member.role))));
    return [TEAM_DEPARTMENT_ALL, ...items];
  }, [members]);

  const leadership = useMemo(() => {
    const featured = members.filter((member) => member.isFeatured);
    return (featured.length > 0 ? featured : members.filter((member) => getDepartment(member.role) === "Leadership")).slice(0, 2);
  }, [members]);

  const filteredMembers = useMemo(
    () =>
      activeDepartment === TEAM_DEPARTMENT_ALL
        ? members
        : members.filter((member) => getDepartment(member.role) === activeDepartment),
    [activeDepartment, members],
  );

  const stats = [
    { label: "Team Members", value: members.length },
    { label: "Departments", value: Math.max(departments.length - 1, 0) },
    { label: "Featured Leaders", value: leadership.length },
    { label: "Visible Profiles", value: members.filter((member) => member.isVisible !== false).length },
  ];

  return (
    <>
      <section id={TEAM_SECTIONS.leadership} className="scroll-mt-24 bg-background py-16 sm:py-20">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            variants={staggerContainer}
            className="space-y-10"
          >
            <motion.div variants={fadeIn} className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Leadership</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">
                Builders, operators, and creative leads.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{intro.description}</p>
            </motion.div>
            {leadership.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
                Team profiles will appear here after they are enabled from the admin dashboard.
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {leadership.map((member) => (
                  <motion.div key={member.id} variants={staggerItem}>
                    <TeamCard member={member} featured onPreview={setPreviewMember} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section id={TEAM_SECTIONS.grid} className="scroll-mt-24 bg-muted/30 py-16 sm:py-20">
        <div className="section-container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.14 }}
            variants={staggerContainer}
            className="space-y-10"
          >
            <motion.div variants={fadeIn} className="mx-auto max-w-3xl text-center">
              <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
                <UsersRound className="h-4 w-4" aria-hidden="true" />
                {membersSection.title}
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">A compact team with full-stack range.</h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{membersSection.subtitle}</p>
            </motion.div>

            <motion.div variants={fadeIn} className="flex flex-wrap justify-center gap-2" aria-label="Filter team by department">
              {departments.map((department) => (
                <button
                  key={department}
                  type="button"
                  onClick={() => setActiveDepartment(department)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    activeDepartment === department
                      ? "bg-primary text-primary-foreground shadow"
                      : "bg-background text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {department}
                </button>
              ))}
            </motion.div>

            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeDepartment}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={staggerContainer}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
              >
                {filteredMembers.map((member) => (
                  <motion.div key={member.id} layout variants={staggerItem}>
                    <TeamCard member={member} onPreview={setPreviewMember} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section id={TEAM_SECTIONS.departments} className="scroll-mt-24 bg-background py-16 sm:py-20">
        <div className="section-container grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {departments.filter((item) => item !== TEAM_DEPARTMENT_ALL).map((department) => (
            <article key={department} className="rounded-xl border border-border bg-card p-6 shadow-sm transition-transform hover:-translate-y-1">
              <BriefcaseBusiness className="h-8 w-8 text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-semibold">{department}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {members.filter((member) => getDepartment(member.role) === department).length} active profile(s)
                contributing to this capability.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id={TEAM_SECTIONS.stats} className="scroll-mt-24 bg-muted/30 py-16 sm:py-20">
        <div className="section-container grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-6 text-center shadow-sm">
              <p className="text-4xl font-bold text-primary">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id={TEAM_SECTIONS.testimonials} className="section-padding scroll-mt-24 bg-background">
        <div className="section-container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">{values.title}</h2>
            <p className="text-lg text-muted-foreground">{values.subtitle}</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.points.map((point) => (
              <article key={point.title} className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{point.title}</h3>
                <p className="text-muted-foreground">{point.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id={TEAM_SECTIONS.join} className="section-padding scroll-mt-24 bg-primary text-primary-foreground">
        <div className="section-container text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-3xl font-bold sm:text-4xl">{cta.title}</h2>
            <p className="text-lg opacity-90">{cta.subtitle}</p>
            <Button asChild size="lg" variant="secondary">
              <Link href={cta.buttonLink}>{cta.buttonText}</Link>
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={Boolean(previewMember)} onOpenChange={(open) => !open && setPreviewMember(null)}>
        <DialogContent className="max-w-2xl overflow-hidden p-0">
          {previewMember && (
            <>
              <div className="relative h-72">
                <SafeImage
                  src={previewMember.avatar ?? "placeholder.png"}
                  alt={previewMember.displayName}
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPreviewMember(null)}
                  className="absolute right-3 top-3 rounded-full bg-background/90 p-2 text-foreground shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Close team profile"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="space-y-5 p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl">{previewMember.displayName}</DialogTitle>
                  <DialogDescription>{getRoleLabel(previewMember.role)}</DialogDescription>
                </DialogHeader>
                {previewMember.bio && <p className="leading-relaxed text-muted-foreground">{previewMember.bio}</p>}
                <div className="flex flex-wrap gap-2">
                  {socialLinks(previewMember).map(({ href, label, icon: Icon }) => (
                    <Button key={label} asChild variant="outline" size="sm">
                      <Link
                        href={href!}
                        target={href?.startsWith("http") ? "_blank" : undefined}
                        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
                        {label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
