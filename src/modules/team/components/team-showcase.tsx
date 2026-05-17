"use client";

import { useEffect, useMemo, useRef, useState, type ComponentProps } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CirclePlay,
  Globe,
  Mail,
  Phone,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Button,
} from "@/components/ui";
import { SafeImage, SplitWords } from "@/components/shared";
import { blurReveal, cardReveal, fadeIn, staggerContainer, staggerItem } from "@/lib/animation-variants";
import { TEAM_DEPARTMENT_ALL, TEAM_SECTIONS } from "../constants";
import type { CtaSection, IntroSection, TeamMember, TeamMembersSection, ValuesSection } from "../types";
import { TeamApplicationDialog } from "./team-application-dialog";

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

function getDepartment(member: TeamMember) {
  if (member.department) return member.department;
  const normalized = member.role.toLowerCase();
  if (normalized.includes("founder") || normalized.includes("ceo") || normalized.includes("admin") || normalized.includes("lead")) return "Leadership";
  if (normalized.includes("design") || normalized.includes("ui") || normalized.includes("ux") || normalized.includes("brand")) return "Design";
  if (normalized.includes("seo") || normalized.includes("marketing") || normalized.includes("growth")) return "Growth";
  if (normalized.includes("manager") || normalized.includes("operation") || normalized.includes("project")) return "Operations";
  return "Engineering";
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function memberLinks(member: TeamMember) {
  return [
    { href: member.linkedinUrl, label: "LinkedIn", icon: LinkedInIcon },
    { href: member.githubUrl, label: "GitHub", icon: GitHubIcon },
    { href: member.portfolioUrl, label: "Portfolio", icon: Globe },
    { href: member.email ? `mailto:${member.email}` : undefined, label: "Email", icon: Mail },
    { href: member.phone ? `tel:${member.phone}` : undefined, label: "Phone", icon: Phone },
    { href: member.youtubeUrl, label: "YouTube", icon: CirclePlay },
  ].filter((item) => Boolean(item.href));
}

function LinkedInIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function GitHubIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5A11.5 11.5 0 0 0 8.36 22.9c.58.1.79-.25.79-.56v-2.14c-3.23.7-3.91-1.37-3.91-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.58-.3-5.29-1.29-5.29-5.74 0-1.27.45-2.3 1.2-3.12-.12-.29-.52-1.47.11-3.07 0 0 .98-.31 3.17 1.19a10.95 10.95 0 0 1 5.76 0c2.19-1.5 3.17-1.19 3.17-1.19.63 1.6.23 2.78.11 3.07.75.82 1.2 1.85 1.2 3.12 0 4.46-2.72 5.44-5.31 5.73.42.36.79 1.08.79 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function Counter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || started) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        setStarted(true);
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 900;
    const start = performance.now();
    let frame = 0;

    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setDisplay(Math.round(value * progress));
      if (progress < 1) frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [started, value]);

  return <span ref={ref}>{display}</span>;
}

function TeamMemberCard({ member, onPreview }: { member: TeamMember; onPreview: (member: TeamMember) => void }) {
  const links = memberLinks(member);

  return (
    <motion.article
      layout
      variants={cardReveal}
      className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_26px_80px_rgba(37,99,235,0.18)]"
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),transparent_28%,transparent_72%,rgba(59,130,246,0.08))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative aspect-[4/4.15] overflow-hidden border-b border-white/8">
        {member.avatar && member.avatar !== "placeholder.png" && member.avatar !== "/placeholder.png" ? (
          <SafeImage
            src={member.avatar}
            alt={member.displayName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.24),transparent_34%),linear-gradient(180deg,#151a29,#0b0d14)]" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0b0d14] to-transparent" />
        {!member.avatar || member.avatar === "placeholder.png" || member.avatar === "/placeholder.png" ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/12 bg-white/5 text-3xl font-black text-white/85 shadow-[0_0_0_16px_rgba(255,255,255,0.03)]">
              {initials(member.displayName)}
            </div>
          </div>
        ) : null}
        <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#091224]/75 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur-xl">
          {getDepartment(member)}
        </div>
        {member.isFeatured ? (
          <div className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/12 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5" /> Featured
          </div>
        ) : null}
      </div>

      <div className="relative flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-2xl font-black text-white">{member.displayName}</h3>
            <p className="mt-1 text-sm font-medium text-primary">{getRoleLabel(member.role)}</p>
          </div>
          <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary sm:flex">
            <UserRound className="h-4.5 w-4.5" />
          </div>
        </div>

        {member.bio ? <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/62">{member.bio}</p> : null}

        {member.expertiseTags?.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {member.expertiseTags.map((tag) => (
              <span key={`${member.id}-${tag}`} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          {links.slice(0, 5).map(({ href, label, icon: Icon }) => (
            <Link
              key={`${member.id}-${label}`}
              href={href!}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/62 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/12 hover:text-primary"
              aria-label={`${member.displayName} ${label}`}
            >
              <Icon className="h-4 w-4" />
            </Link>
          ))}
        </div>

        <div className="mt-6 pt-1">
          <Button type="button" variant="outline" onClick={() => onPreview(member)} className="group h-11 rounded-full border-white/10 bg-white/[0.04] px-5 text-white transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-white">
            View Profile
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

export function TeamShowcase({ intro, membersSection, values, cta, members }: TeamShowcaseProps) {
  const [activeDepartment, setActiveDepartment] = useState(TEAM_DEPARTMENT_ALL);
  const [previewMember, setPreviewMember] = useState<TeamMember | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const departments = useMemo(() => {
    const items = Array.from(new Set(members.map((member) => getDepartment(member))));
    return [TEAM_DEPARTMENT_ALL, ...items];
  }, [members]);

  const featuredMembers = useMemo(() => {
    const featured = members.filter((member) => member.isFeatured);
    return (featured.length > 0 ? featured : members.slice(0, 3)).slice(0, 3);
  }, [members]);

  const filteredMembers = useMemo(
    () =>
      activeDepartment === TEAM_DEPARTMENT_ALL
        ? members
        : members.filter((member) => getDepartment(member) === activeDepartment),
    [activeDepartment, members],
  );

  const stats = [
    { label: "Team Members", value: members.length },
    { label: "Departments", value: Math.max(1, departments.length - 1) },
    { label: "Featured Leaders", value: featuredMembers.length },
    { label: "Visible Profiles", value: members.filter((member) => member.isVisible !== false).length },
  ];

  return (
    <>
      <section id={TEAM_SECTIONS.leadership} className="scroll-mt-24 bg-background py-16 sm:py-20 md:py-24 lg:py-28 2xl:py-36">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={staggerContainer}
          className="section-container space-y-12 px-4 sm:px-6 lg:px-8 2xl:max-w-screen-2xl 2xl:px-20"
        >
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16 2xl:gap-24">
            <motion.div variants={blurReveal} className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                <UsersRound className="h-3.5 w-3.5" /> Team Culture
              </div>
              <h2 className="max-w-xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl 2xl:text-6xl">
                <SplitWords text="Builders, operators, and creative leads." inheritParent />
              </h2>
            </motion.div>
            <motion.div variants={fadeIn} className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-8 2xl:p-10">
              <div className="absolute inset-y-0 left-0 w-px bg-linear-to-b from-transparent via-primary/70 to-transparent" />
              <p className="text-base leading-8 text-white/68 sm:text-lg 2xl:text-xl">{intro.description}</p>
              <div className="mt-8 h-px w-full bg-linear-to-r from-primary/60 via-white/10 to-transparent" />
              <p className="mt-6 text-sm uppercase tracking-[0.22em] text-white/45">Compact team. High ownership. Fast iteration.</p>
            </motion.div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 2xl:gap-8">
            {featuredMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} onPreview={setPreviewMember} />
            ))}
          </div>
        </motion.div>
      </section>

      <section id={TEAM_SECTIONS.grid} className="scroll-mt-24 bg-[#0a0c12] py-16 sm:py-20 md:py-24 lg:py-28 2xl:py-36">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={staggerContainer}
          className="section-container space-y-10 px-4 sm:px-6 lg:px-8 2xl:max-w-screen-2xl 2xl:px-20"
        >
          <motion.div variants={blurReveal} className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> {membersSection.title}
            </p>
            <h2 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl 2xl:text-6xl">
              <SplitWords text="A compact team with full-stack range." inheritParent />
            </h2>
            <p className="mt-4 text-base leading-8 text-white/62 sm:text-lg 2xl:text-xl">{membersSection.subtitle}</p>
          </motion.div>

          <motion.div variants={fadeIn} className="flex flex-wrap justify-center gap-3" aria-label="Filter team by department">
            {departments.map((department) => {
              const active = activeDepartment === department;
              return (
                <button
                  key={department}
                  type="button"
                  onClick={() => setActiveDepartment(department)}
                  className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-300 ${active ? "border-primary/50 bg-primary text-primary-foreground shadow-[0_12px_30px_rgba(59,130,246,0.34)]" : "border-white/10 bg-white/[0.04] text-white/64 hover:border-primary/30 hover:bg-primary/10 hover:text-white"}`}
                >
                  {department}
                </button>
              );
            })}
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeDepartment}
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:gap-8"
            >
              {filteredMembers.map((member) => (
                <TeamMemberCard key={member.id} member={member} onPreview={setPreviewMember} />
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </section>

      <section id={TEAM_SECTIONS.departments} className="scroll-mt-24 bg-background py-16 sm:py-20 md:py-24 lg:py-28 2xl:py-36">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.14 }}
          variants={staggerContainer}
          className="section-container px-4 sm:px-6 lg:px-8 2xl:max-w-screen-2xl 2xl:px-20"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 2xl:gap-6">
            {stats.map((stat) => (
              <motion.article key={stat.label} variants={cardReveal} className="group rounded-[28px] border border-white/10 bg-white/[0.03] p-6 text-center shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_26px_70px_rgba(37,99,235,0.16)] 2xl:p-8">
                <div className="text-4xl font-black text-primary sm:text-5xl 2xl:text-6xl"><Counter value={stat.value} /></div>
                <p className="mt-3 text-sm font-medium text-white/60 2xl:text-base">{stat.label}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>

      <section id={TEAM_SECTIONS.stats} className="scroll-mt-24 bg-[#090b11] py-16 sm:py-20 md:py-24 lg:py-28 2xl:py-36">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
          variants={staggerContainer}
          className="section-container space-y-10 px-4 sm:px-6 lg:px-8 2xl:max-w-screen-2xl 2xl:px-20"
        >
          <motion.div variants={blurReveal} className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-black text-white sm:text-4xl lg:text-5xl 2xl:text-6xl"><SplitWords text={values.title} inheritParent /></h2>
            <p className="mt-4 text-base leading-8 text-white/60 sm:text-lg 2xl:text-xl">{values.subtitle}</p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:gap-8">
            {values.points.map((point, index) => (
              <motion.article key={point.title} variants={index % 2 === 0 ? cardReveal : staggerItem} className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.03] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-[0_26px_80px_rgba(37,99,235,0.16)] 2xl:p-8">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_38%),linear-gradient(180deg,transparent,rgba(59,130,246,0.04))] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/25 bg-primary/10 text-primary shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-black text-white">{point.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/60 2xl:text-base">{point.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </section>

      <section id={TEAM_SECTIONS.join} className="scroll-mt-24 bg-background py-16 sm:py-20 md:py-24 lg:py-28 2xl:py-36">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={staggerContainer}
          className="section-container px-4 sm:px-6 lg:px-8 2xl:max-w-screen-2xl 2xl:px-20"
        >
          <motion.div variants={blurReveal} className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_28%),linear-gradient(135deg,#0d1220,#0a0d14)] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-10 lg:p-14 2xl:p-16">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-20" />
            <div className="relative mx-auto max-w-4xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Build with us</p>
              <h2 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl 2xl:text-6xl">{cta.title}</h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-white/62 sm:text-lg 2xl:text-xl">{cta.subtitle}</p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button type="button" onClick={() => setDialogOpen(true)} className="group h-12 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_18px_44px_rgba(59,130,246,0.34)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 sm:h-14 sm:px-7 sm:text-base">
                  Join Team
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
                <Button asChild type="button" variant="outline" className="group h-12 rounded-full border-white/10 bg-white/[0.04] px-6 text-white transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-white sm:h-14 sm:px-7 sm:text-base">
                  <Link href={cta.buttonLink}>
                    {cta.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-white/55">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">Full-time opportunities</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">Internship inquiries</span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">Collaboration requests</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <Dialog open={Boolean(previewMember)} onOpenChange={(open) => !open && setPreviewMember(null)}>
        <DialogContent className="overflow-hidden border-white/10 bg-[#0b0d14]/96 p-0 text-white shadow-[0_30px_100px_rgba(0,0,0,0.56)] backdrop-blur-2xl sm:max-w-3xl">
          {previewMember ? (
            <>
              <div className="relative h-72 overflow-hidden border-b border-white/10">
                {previewMember.avatar && previewMember.avatar !== "placeholder.png" && previewMember.avatar !== "/placeholder.png" ? (
                  <SafeImage src={previewMember.avatar} alt={previewMember.displayName} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_34%),linear-gradient(180deg,#141a28,#0b0d14)]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d14] via-[#0b0d14]/40 to-transparent" />
                {(!previewMember.avatar || previewMember.avatar === "placeholder.png" || previewMember.avatar === "/placeholder.png") ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border border-white/12 bg-white/5 text-4xl font-black text-white/86">
                      {initials(previewMember.displayName)}
                    </div>
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => setPreviewMember(null)}
                  className="absolute right-4 top-4 rounded-full border border-white/10 bg-[#0b0d14]/75 p-2 text-white/80 transition hover:border-primary/40 hover:text-white"
                  aria-label="Close team profile"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-5 p-6 sm:p-8">
                <DialogHeader className="space-y-2 text-left">
                  <DialogTitle className="text-3xl font-black">{previewMember.displayName}</DialogTitle>
                  <DialogDescription className="text-sm text-primary">{getRoleLabel(previewMember.role)} · {getDepartment(previewMember)}</DialogDescription>
                </DialogHeader>
                {previewMember.bio ? <p className="text-sm leading-7 text-white/65 sm:text-base">{previewMember.bio}</p> : null}
                {previewMember.expertiseTags?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {previewMember.expertiseTags.map((tag) => (
                      <span key={`${previewMember.id}-${tag}-detail`} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/72">{tag}</span>
                    ))}
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  {memberLinks(previewMember).map(({ href, label, icon: Icon }) => (
                    <Button key={`${previewMember.id}-${label}-detail`} asChild variant="outline" size="sm" className="rounded-full border-white/10 bg-white/[0.04] text-white hover:border-primary/40 hover:bg-primary/10 hover:text-white">
                      <Link href={href!} target={href?.startsWith("http") ? "_blank" : undefined} rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}>
                        <Icon className="mr-2 h-4 w-4" />
                        {label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <TeamApplicationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}

export function TeamShowcaseSkeleton() {
  return (
    <div className="animate-pulse bg-background">
      <section className="section-container px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28 2xl:max-w-screen-2xl 2xl:px-20 2xl:py-36">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-5">
            <div className="h-8 w-44 rounded-full bg-white/10" />
            <div className="h-16 w-full max-w-xl rounded-2xl bg-white/10 sm:h-20" />
          </div>
          <div className="h-56 rounded-[32px] bg-white/[0.05]" />
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {[0, 1, 2].map((item) => <div key={item} className="h-[520px] rounded-[28px] bg-white/[0.05]" />)}
        </div>
      </section>
      <section className="section-container px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28 2xl:max-w-screen-2xl 2xl:px-20 2xl:py-36">
        <div className="mx-auto h-28 max-w-3xl rounded-[28px] bg-white/[0.05]" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => <div key={item} className="h-[520px] rounded-[28px] bg-white/[0.05]" />)}
        </div>
      </section>
    </div>
  );
}



