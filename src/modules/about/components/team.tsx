"use client";

import type { ReactNode } from "react";
import { ArrowUpRight, Globe } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SafeImage } from "@/components/shared/safe-image";
import { ABOUT_IMAGE_SIZES } from "../constants";
import type { CoreTeamSection } from "../types";
import { Reveal } from "./shared/reveal";
import { AboutSectionHeading } from "./shared/section-heading";

export function TeamSection({ data }: { data: CoreTeamSection }) {
  return (
    <section className="section-padding bg-muted/20">
      <span id="section6-about-team" className="block scroll-mt-24" aria-hidden="true" />
      <div className="section-container">
        <div className="space-y-12">
          <Reveal>
            <AboutSectionHeading title={data.title} subtitle={data.subtitle} />
          </Reveal>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-2 xl:gap-6">
            {data.members.map((member, index) => {
              const socialLinks = [
                member.linkedinUrl ? { href: member.linkedinUrl, label: "LinkedIn", icon: <BrandIcon name="linkedin" /> } : null,
                member.githubUrl ? { href: member.githubUrl, label: "GitHub", icon: <BrandIcon name="github" /> } : null,
                member.twitterUrl ? { href: member.twitterUrl, label: "X", icon: <BrandIcon name="x" /> } : null,
                member.portfolioUrl ? { href: member.portfolioUrl, label: "Portfolio", icon: <Globe className="h-4 w-4" /> } : null,
              ].filter(Boolean) as Array<{ href: string; label: string; icon: ReactNode }>;

              return (
                <Reveal key={`${member.name}-${index}`} delay={index * 0.05}>
                  <motion.article
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 250, damping: 18 }}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-background/90 shadow-[0_18px_60px_-44px_rgba(15,23,42,1)]"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_48%),linear-gradient(180deg,transparent,rgba(168,85,247,0.08))] opacity-0 transition duration-500 group-hover:opacity-100" />
                    <div className="absolute inset-0 rounded-[1.75rem] p-px opacity-60 transition duration-500 group-hover:opacity-100 [background:linear-gradient(160deg,rgba(59,130,246,0.5),rgba(255,255,255,0.06),rgba(168,85,247,0.32))]">
                      <div className="h-full w-full rounded-[calc(1.75rem-1px)] bg-transparent" />
                    </div>
                    <div className="relative aspect-[4/3.5] overflow-hidden bg-muted">
                      <SafeImage
                        src={member.image || "placeholder.png"}
                        alt={member.name}
                        fill
                        sizes={ABOUT_IMAGE_SIZES.card}
                        className="object-cover grayscale transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />
                    </div>
                    <div className="relative flex flex-1 flex-col p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">{member.name}</h3>
                          <p className="mt-1 text-sm font-medium text-primary">{member.role}</p>
                        </div>
                        <div className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">Team</div>
                      </div>
                      {member.bio ? <p className="mt-3 text-sm leading-6 text-muted-foreground">{member.bio}</p> : null}
                      {member.skills?.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {member.skills.map((skill) => (
                            <span key={skill} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/70">
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : null}
                      <div className="mt-5 flex flex-1 flex-col justify-end gap-3">
                        <div className="flex flex-wrap gap-2">
                          {socialLinks.map(({ href, label, icon }) => (
                            <a
                              key={label}
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-muted-foreground transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              aria-label={`${member.name} on ${label}`}
                            >
                              {icon}
                            </a>
                          ))}
                        </div>
                        {member.portfolioUrl ? (
                          <Link
                            href={member.portfolioUrl}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-foreground transition duration-300 hover:border-primary/30 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto sm:justify-start"
                          >
                            View Portfolio
                            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </motion.article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function BrandIcon({ name }: { name: "github" | "linkedin" | "x" }) {
  const paths = {
    github: "M12 .5A11.5 11.5 0 0 0 8.36 22.9c.58.1.79-.25.79-.56v-2.14c-3.23.7-3.91-1.37-3.91-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.58-.3-5.29-1.29-5.29-5.74 0-1.27.45-2.3 1.2-3.12-.12-.29-.52-1.47.11-3.07 0 0 .98-.31 3.17 1.19a10.95 10.95 0 0 1 5.76 0c2.19-1.5 3.17-1.19 3.17-1.19.63 1.6.23 2.78.11 3.07.75.82 1.2 1.85 1.2 3.12 0 4.46-2.72 5.44-5.31 5.73.42.36.79 1.08.79 2.18v3.23c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z",
    linkedin: "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z",
    x: "M18.9 2H22l-6.77 7.73L23 22h-6.1l-4.78-6.22L6.67 22H3.55l7.24-8.28L1 2h6.26l4.32 5.7L18.9 2Zm-1.07 18h1.69L6.34 3.9H4.53L17.83 20Z",
  };

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}
