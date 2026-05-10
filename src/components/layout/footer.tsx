import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { SafeImage } from '@/components/shared';
import { getVisibleFooter } from '@/modules/footer';
import { FOOTER_SOCIAL_TITLES } from '@/modules/footer/constants';
import type { FooterColumnWithLinks } from '@/modules/footer/types';

const BRAND_DESCRIPTION =
  'Empowering students through innovation, education, and real-world project experience.';

type IconProps = {
  className?: string;
};

function ColumnBody({ column }: { column: FooterColumnWithLinks }) {
  return (
    <>
      <h4 className="mb-3 text-sm font-jost-bold uppercase tracking-[0.15em] text-foreground sm:mb-4 sm:text-base md:mb-5 md:text-lg 2xl:mb-6 2xl:text-xl">
        {column.title}
      </h4>
      <ul className="space-y-2 sm:space-y-2.5 md:space-y-3 2xl:space-y-4">
        {column.links.map((link) => (
          <li key={link.id}>
            <Link
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group relative inline-flex items-start gap-1.5 text-xs leading-snug text-muted-foreground transition-colors duration-300 sm:gap-2 sm:text-sm md:text-base 2xl:text-lg"
            >
              <span className="mt-[1px] shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                &gt;
              </span>
              <span className="relative break-words transition-colors duration-300 group-hover:text-foreground">
                {link.title}
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function BrandColumn({ socialLinks }: { socialLinks: FooterColumnWithLinks['links'] }) {
  return (
    <div className="min-w-0 lg:min-w-[15rem] lg:px-4 lg:pl-0 2xl:min-w-[18rem] 2xl:px-6 2xl:pl-0">
      <Link
        href="/"
        className="inline-flex text-base font-jost-bold text-foreground transition-colors duration-300 hover:text-primary sm:text-lg md:text-xl 2xl:text-2xl"
      >
        RaYnk Labs
      </Link>
      <p className="mt-3 max-w-[16rem] text-xs leading-relaxed text-muted-foreground sm:text-sm md:text-base 2xl:max-w-xs 2xl:text-lg">
        {BRAND_DESCRIPTION}
      </p>
      {socialLinks.length > 0 && (
        <div className="mt-5 flex flex-nowrap items-center gap-2.5" aria-label="Social links">
          {socialLinks.map((link) => {
            const Icon = getSocialIcon(link.title);
            return (
              <Link
                key={link.id}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={link.title}
                className="group inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-10 md:w-10 2xl:h-11 2xl:w-11"
              >
                <Icon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110 md:h-4 md:w-4 2xl:h-5 2xl:w-5" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export async function Footer() {
  const { columns, setting } = await getVisibleFooter();
  const allLinks = columns.flatMap((column) => column.links);
  const socialLinks = allLinks
    .filter((link) =>
      FOOTER_SOCIAL_TITLES.some((title) => link.title.toLowerCase().includes(title)),
    )
    .slice(0, 6);

  const footerColumns = columns
    .map((column) => ({
      ...column,
      links: column.links.filter(
        (link) => !FOOTER_SOCIAL_TITLES.some((title) => link.title.toLowerCase().includes(title)),
      ),
    }))
    .filter((column) => column.links.length > 0)
    .slice(0, 4);

  const raw = setting.logoUrl || '';
  const logoSrc = !raw
    ? '/api/uploads/placeholder.png'
    : raw.startsWith('/') || raw.startsWith('http')
      ? raw
      : `/api/uploads/${raw}`;

  const year = new Date().getFullYear();
  const copyright = setting.copyrightText || `All Right Reserved \u00a9 ${year}`;

  return (
    <footer className="bg-background text-foreground" aria-label="Site footer">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:py-14 lg:px-8 lg:py-10 2xl:max-w-screen-2xl 2xl:px-20 2xl:py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 sm:gap-x-10 sm:gap-y-10 md:grid-cols-4 md:gap-x-12 md:gap-y-12 lg:grid-cols-[1.25fr_repeat(4,minmax(0,1fr))] lg:divide-x lg:divide-border 2xl:gap-x-14 2xl:gap-y-14">
          <BrandColumn socialLinks={socialLinks} />

          {footerColumns.map((column) => (
            <div
              key={column.id}
              className="min-w-0 lg:px-4 2xl:px-6"
            >
              <ColumnBody column={column} />
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border bg-muted">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-4 py-5 text-center sm:gap-5 sm:px-6 sm:py-6 md:py-7 lg:flex-row lg:justify-between lg:gap-6 lg:px-8 lg:text-left xl:px-12 2xl:max-w-screen-2xl 2xl:gap-8 2xl:px-20 2xl:py-8">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3 md:gap-4 2xl:gap-5">
            <SafeImage
              src={logoSrc}
              alt={setting.logoAlt || 'RaYnk Labs'}
              width={140}
              height={56}
              className="h-7 w-auto object-contain sm:h-8 md:h-9 2xl:h-12"
            />
            <p className="text-xs leading-snug text-muted-foreground sm:text-sm md:text-base 2xl:text-lg">
              {copyright}
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5 sm:gap-y-2 md:gap-x-6 lg:gap-x-8 2xl:gap-x-10">
            {setting.address && (
              <div className="flex max-w-full items-center gap-1.5 text-xs text-muted-foreground sm:text-sm md:gap-2 md:text-base 2xl:gap-2.5 2xl:text-lg">
                <MapPin className="h-4 w-4 shrink-0 md:h-5 md:w-5 2xl:h-6 2xl:w-6" />
                <span className="break-words">{setting.address}</span>
              </div>
            )}

            {setting.email && (
              <Link
                href={`mailto:${setting.email}`}
                className="group flex max-w-full items-center gap-1.5 text-xs text-muted-foreground transition-colors duration-300 hover:text-foreground sm:text-sm md:gap-2 md:text-base 2xl:gap-2.5 2xl:text-lg"
              >
                <Mail className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110 md:h-5 md:w-5 2xl:h-6 2xl:w-6" />
                <span className="relative break-all sm:break-normal">
                  {setting.email}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
                </span>
              </Link>
            )}

            {setting.phone && (
              <Link
                href={`tel:${setting.phone.replace(/\s+/g, '')}`}
                className="group flex items-center gap-1.5 text-xs text-muted-foreground transition-colors duration-300 hover:text-foreground sm:text-sm md:gap-2 md:text-base 2xl:gap-2.5 2xl:text-lg"
              >
                <Phone className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110 md:h-5 md:w-5 2xl:h-6 2xl:w-6" />
                <span className="relative whitespace-nowrap">
                  {setting.phone}
                  {setting.phoneLabel ? ` ${setting.phoneLabel}` : ''}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

function GithubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 .5A11.5 11.5 0 0 0 8.36 22.9c.58.11.79-.25.79-.56v-2.02c-3.22.7-3.9-1.39-3.9-1.39-.53-1.34-1.29-1.69-1.29-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.11-.75.41-1.26.74-1.55-2.57-.29-5.27-1.29-5.27-5.73 0-1.27.45-2.3 1.2-3.11-.12-.29-.52-1.47.11-3.06 0 0 .98-.31 3.17 1.19A10.9 10.9 0 0 1 12 6.04c.98 0 1.97.13 2.89.39 2.2-1.5 3.17-1.19 3.17-1.19.63 1.59.23 2.77.11 3.06.75.81 1.2 1.84 1.2 3.11 0 4.46-2.71 5.43-5.29 5.72.42.36.79 1.07.79 2.16v3.2c0 .31.21.68.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.61 0 4.27 2.37 4.27 5.46v6.28ZM5.32 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.54V9H7.1v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.22.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.37 1.05.42 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.42 2.22-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.05.37-2.22.42-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.22-.42a3.71 3.71 0 0 1-1.38-.9 3.71 3.71 0 0 1-.9-1.38c-.17-.42-.37-1.05-.42-2.22-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.42-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.05-.37 2.22-.42 1.27-.06 1.65-.07 4.85-.07ZM12 0C8.74 0 8.33.01 7.05.07 5.77.13 4.9.33 4.14.63a5.86 5.86 0 0 0-2.12 1.39A5.86 5.86 0 0 0 .63 4.14C.33 4.9.13 5.77.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.31.79.72 1.46 1.39 2.12.66.67 1.33 1.08 2.12 1.39.76.3 1.63.5 2.91.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56a5.86 5.86 0 0 0 2.12-1.39 5.86 5.86 0 0 0 1.39-2.12c.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91a5.86 5.86 0 0 0-1.39-2.12A5.86 5.86 0 0 0 19.86.63c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
    </svg>
  );
}

function YoutubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M23.5 6.2a3.01 3.01 0 0 0-2.12-2.13C19.5 3.56 12 3.56 12 3.56s-7.5 0-9.38.51A3.01 3.01 0 0 0 .5 6.2C0 8.07 0 12 0 12s0 3.93.5 5.8a3.01 3.01 0 0 0 2.12 2.13c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.01 3.01 0 0 0 2.12-2.13c.5-1.87.5-5.8.5-5.8s0-3.93-.5-5.8ZM9.6 15.56V8.44L15.82 12 9.6 15.56Z" />
    </svg>
  );
}

function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.49l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.23H4.3l13.31 17.42Z" />
    </svg>
  );
}

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.68.23 2.68.23v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.27h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

function GlobeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
    </svg>
  );
}

function getSocialIcon(title: string) {
  const normalized = title.toLowerCase();
  if (normalized.includes('github')) return GithubIcon;
  if (normalized.includes('linkedin')) return LinkedInIcon;
  if (normalized.includes('instagram')) return InstagramIcon;
  if (normalized.includes('youtube')) return YoutubeIcon;
  if (normalized.includes('twitter') || normalized === 'x' || normalized.includes(' x')) return XIcon;
  if (normalized.includes('facebook')) return FacebookIcon;
  return GlobeIcon;
}
