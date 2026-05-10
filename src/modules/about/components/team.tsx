"use client";

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ABOUT_IMAGE_SIZES } from "../constants";
import type { CoreTeamSection } from "../types";
import { resolveAboutImageSrc } from "./shared/image-url";
import { AboutIcon } from "./shared/icon";
import { Reveal } from "./shared/reveal";
import { AboutSectionHeading } from "./shared/section-heading";

export function TeamSection({ data }: { data: CoreTeamSection }) {
  return (
    <section className="section-padding bg-muted/30">
      <div className="section-container">
        <div className="space-y-12">
          <Reveal>
            <AboutSectionHeading title={data.title} subtitle={data.subtitle} />
          </Reveal>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {data.members.map((member, index) => {
              const socialLinks = [
                { href: member.githubUrl, label: "GitHub", icon: "Github" },
                { href: member.linkedinUrl, label: "LinkedIn", icon: "Linkedin" },
                { href: member.instagramUrl, label: "Instagram", icon: "Instagram" },
                { href: member.youtubeUrl, label: "YouTube", icon: "Youtube" },
              ].filter((item) => Boolean(item.href));

              return (
              <Reveal key={`${member.name}-${index}`} delay={index * 0.05}>
                <article className="group h-full overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative h-64 w-full bg-muted">
                    <Image
                      src={resolveAboutImageSrc(member.image)}
                      alt={member.name}
                      fill
                      sizes={ABOUT_IMAGE_SIZES.card}
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
                    {member.bio ? (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                        {member.bio}
                      </p>
                    ) : null}
                    {socialLinks.length ? (
                      <div className="mt-4 flex justify-center gap-2">
                        {socialLinks.map(({ href, label, icon }) => (
                          <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            aria-label={`${member.name} on ${label}`}
                          >
                            <AboutIcon name={icon} className="h-4 w-4" />
                          </a>
                        ))}
                      </div>
                    ) : null}
                    {member.portfolioUrl ? (
                      <Link
                        href={member.portfolioUrl}
                        className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-primary transition hover:border-primary/40 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        View Portfolio
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    ) : null}
                  </div>
                </article>
              </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
