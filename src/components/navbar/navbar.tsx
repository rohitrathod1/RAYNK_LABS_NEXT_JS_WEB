"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { useScroll } from "@/hooks";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { toSrc } from "@/components/shared/image-upload";
import { useTheme } from "@/providers/theme-provider";
import {
  getCanonicalSectionId,
  getPageKeyFromPathname,
  getSectionIdsForPathname,
} from "@/config/section-map";

type NavbarSubLink = {
  title: string;
  href: string;
  openInNewTab?: boolean;
};

type NavbarLink = {
  title: string;
  href?: string;
  hasDropdown?: boolean;
  openInNewTab?: boolean;
  subLinks?: NavbarSubLink[];
};

const HOME_LINK: NavbarLink = { title: "Home", href: "/" };
const NAVBAR_OFFSET = 84;
const HASH_SCROLL_RETRY_MS = 80;
const HASH_SCROLL_MAX_ATTEMPTS = 30;

export type NavbarProps = {
  logoUrl?: string | null;
  logoAlt?: string | null;
  links: NavbarLink[];
};

function isExternalHref(href = "") {
  return /^https?:\/\//i.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");
}

function pathnameFromHref(href = "") {
  if (!href || isExternalHref(href)) return "";
  const [path] = href.split("#");
  return path || "/";
}

function hashFromHref(href = "") {
  const [, hash] = href.split("#");
  return hash ? decodeURIComponent(hash) : "";
}

function scrollToHash(hash: string, attempt = 0) {
  const pageKey = getPageKeyFromPathname(window.location.pathname);
  const targetId = getCanonicalSectionId(hash, pageKey);
  const target = document.getElementById(targetId) ?? document.getElementById(hash);
  if (!target) {
    if (attempt < HASH_SCROLL_MAX_ATTEMPTS) {
      window.setTimeout(() => scrollToHash(hash, attempt + 1), HASH_SCROLL_RETRY_MS);
    }
    return;
  }
  const top = target.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

export function Navbar({ logoUrl, logoAlt, links: navLinks }: NavbarProps) {
  const pathname = usePathname();
  const pageKey = useMemo(() => getPageKeyFromPathname(pathname), [pathname]);
  const sectionIds = useMemo(() => getSectionIdsForPathname(pathname), [pathname]);
  const links = useMemo<NavbarLink[]>(
    () => (pathname === "/" ? navLinks : [HOME_LINK, ...navLinks]),
    [pathname, navLinks],
  );
  const scrolled = useScroll(40);
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string>("");
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const altText = logoAlt?.trim() || SITE_NAME;

  const openDropdown = useCallback((key: string) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setActiveDropdown(key);
  }, []);

  const closeDropdown = useCallback(() => {
    leaveTimer.current = setTimeout(() => setActiveDropdown(null), 180);
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveDropdown(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    setActiveSectionId(getCanonicalSectionId(hash, pageKey));
    const id = window.setTimeout(() => scrollToHash(hash), 120);
    return () => window.clearTimeout(id);
  }, [pathname, pageKey]);

  useEffect(() => {
    if (!sectionIds.length) {
      setActiveSectionId("");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) {
          setActiveSectionId(visible.target.id);
        }
      },
      {
        rootMargin: "-96px 0px -58% 0px",
        threshold: [0.12, 0.25, 0.45],
      },
    );

    const nodes = sectionIds
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));
    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [sectionIds]);

  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, []);

  const handleInternalHashClick = useCallback(
    (href: string | undefined, event: MouseEvent<HTMLAnchorElement>) => {
      if (!href || isExternalHref(href)) return;
      const hash = hashFromHref(href);
      if (!hash) return;
      const canonicalHash = getCanonicalSectionId(hash, pageKey);
      const targetPathname = pathnameFromHref(href);
      if (targetPathname !== pathname) return;

      event.preventDefault();
      window.history.pushState(null, "", href);
      setActiveSectionId(canonicalHash);
      scrollToHash(canonicalHash);
      setActiveDropdown(null);
      setMobileOpen(false);
    },
    [pathname, pageKey],
  );

  function isActiveHref(href: string | undefined) {
    const path = pathnameFromHref(href);
    const hash = hashFromHref(href);
    const canonicalHash = hash ? getCanonicalSectionId(hash, pageKey) : "";
    if (canonicalHash && activeSectionId) return canonicalHash === activeSectionId;
    if (path && path !== "/" && pathname.startsWith(path)) return true;
    return path === "/" && pathname === "/";
  }

  function isActiveLink(link: NavbarLink) {
    if (isActiveHref(link.href)) return true;
    return link.subLinks?.some((sub) => isActiveHref(sub.href));
  }

  const navLinkClass = (active: boolean) =>
    cn(
      "group relative inline-flex items-center gap-1 text-[13px] font-medium tracking-wide text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 lg:text-sm 2xl:text-base",
      active ? "text-white" : "text-white/90 hover:text-white",
    );

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const renderNavLink = (link: NavbarLink, className?: string) => {
    const href = link.href?.trim() || "#";
    const external = isExternalHref(href);

    return (
      <Link
        href={href}
        scroll={false}
        target={external || link.openInNewTab ? "_blank" : undefined}
        rel={external || link.openInNewTab ? "noopener noreferrer" : undefined}
        onClick={(event) => handleInternalHashClick(href, event)}
        className={className}
      >
        <span className="relative inline-block">
          {link.title}
          <span className="absolute -bottom-1 left-1/2 h-[1.5px] w-0 -translate-x-1/2 bg-current transition-all duration-300 ease-out group-hover:w-full group-focus-visible:w-full" />
        </span>
      </Link>
    );
  };

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-black/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-xl backdrop-saturate-150"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 lg:h-16 lg:px-12 2xl:h-20 2xl:max-w-screen-2xl 2xl:px-20">
        <Link
          href="/"
          className="flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          aria-label={altText}
        >
          {logoUrl ? (
            <Image
              src={toSrc(logoUrl)}
              alt={altText}
              width={170}
              height={56}
              priority
              className="h-7 w-auto object-contain lg:h-9 2xl:h-12"
            />
          ) : (
            <span className="text-xl font-bold tracking-tight text-white lg:text-2xl 2xl:text-3xl">
              {altText}
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-8 md:flex 2xl:gap-12" aria-label="Primary navigation">
          {links.map((link) => {
            const key = link.title;
            const hasSubLinks = Boolean(link.hasDropdown && link.subLinks?.length);
            const dropdownOpen = activeDropdown === key;
            const active = Boolean(isActiveLink(link));

            return (
              <div
                key={`${key}-${link.href}`}
                className="relative"
                onMouseEnter={() => hasSubLinks && openDropdown(key)}
                onMouseLeave={() => hasSubLinks && closeDropdown()}
                onFocus={() => hasSubLinks && openDropdown(key)}
              >
                <div className="flex items-center">
                  {renderNavLink(
                    link,
                    cn(navLinkClass(active), hasSubLinks && "pr-5"),
                  )}
                  {hasSubLinks ? (
                    <button
                      type="button"
                      aria-label={`${dropdownOpen ? "Close" : "Open"} ${link.title} menu`}
                      aria-expanded={dropdownOpen}
                      aria-controls={`desktop-nav-${key}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setActiveDropdown((current) => (current === key ? null : key));
                      }}
                      className="absolute -right-1 flex h-6 w-6 items-center justify-center rounded-full text-white/85 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          dropdownOpen && "rotate-180",
                        )}
                      />
                    </button>
                  ) : null}
                </div>

                <AnimatePresence>
                  {hasSubLinks && dropdownOpen ? (
                    <motion.div
                      id={`desktop-nav-${key}`}
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute -left-6 top-full z-50 pt-4 2xl:pt-5"
                    >
                      <div className="min-w-[220px] rounded-2xl border border-white/40 bg-muted/95 p-2 shadow-[0_20px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl 2xl:min-w-64 2xl:p-3">
                        {link.subLinks?.map((sub) => (
                          <Link
                            key={`${sub.href}-${sub.title}`}
                            href={sub.href}
                            scroll={false}
                            target={
                              isExternalHref(sub.href) || sub.openInNewTab
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              isExternalHref(sub.href) || sub.openInNewTab
                                ? "noopener noreferrer"
                                : undefined
                            }
                            onClick={(event) => {
                              handleInternalHashClick(sub.href, event);
                              setActiveDropdown(null);
                            }}
                            className={cn(
                              "group block rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-background/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary 2xl:px-5 2xl:py-3 2xl:text-base",
                              isActiveHref(sub.href)
                                ? "bg-background/80 text-primary"
                                : "text-foreground",
                            )}
                          >
                            <span className="relative inline-block">
                              {sub.title}
                              <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-current transition-all duration-300 group-hover:w-full" />
                            </span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
          <button
            type="button"
            onClick={toggleTheme}
            className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 2xl:h-10 2xl:w-10"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45 2xl:h-5 2xl:w-5" />
            ) : (
              <Moon className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-12 2xl:h-5 2xl:w-5" />
            )}
          </button>
        </nav>

        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:hidden"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            id="mobile-navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden border-t border-white/20 bg-zinc-950/95 shadow-2xl backdrop-blur-3xl md:hidden"
          >
            <nav className="flex flex-col px-4 py-6" aria-label="Mobile navigation">
              {links.map((link) => {
                const key = link.title;
                const hasSubLinks = Boolean(link.hasDropdown && link.subLinks?.length);
                const expanded = expandedMobile === key;
                const active = Boolean(isActiveLink(link));

                return (
                  <div key={`${key}-${link.href}`}>
                    <div className="flex items-center">
                      {renderNavLink(
                        link,
                        cn(
                          "flex-1 rounded-2xl px-4 py-4 text-base font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                          active ? "text-white" : "text-white hover:text-white",
                        ),
                      )}
                      {hasSubLinks ? (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedMobile((current) => (current === key ? null : key))
                          }
                          className="mr-2 flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                          aria-label={`${expanded ? "Collapse" : "Expand"} ${link.title}`}
                          aria-expanded={expanded}
                          aria-controls={`mobile-nav-${key}`}
                        >
                          <ChevronDown
                            className={cn(
                              "h-5 w-5 transition-transform duration-200",
                              expanded && "rotate-180",
                            )}
                          />
                        </button>
                      ) : null}
                    </div>

                    {hasSubLinks ? (
                      <div
                        id={`mobile-nav-${key}`}
                        className={cn(
                          "grid transition-all duration-300",
                          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                        )}
                      >
                        <div className="overflow-hidden">
                          <div className="ml-4 overflow-hidden rounded-xl bg-muted/95">
                            {link.subLinks?.map((sub) => (
                              <Link
                                key={`${sub.href}-${sub.title}`}
                                href={sub.href}
                                scroll={false}
                                target={
                                  isExternalHref(sub.href) || sub.openInNewTab
                                    ? "_blank"
                                    : undefined
                                }
                                rel={
                                  isExternalHref(sub.href) || sub.openInNewTab
                                    ? "noopener noreferrer"
                                    : undefined
                                }
                                onClick={(event) => {
                                  handleInternalHashClick(sub.href, event);
                                  setMobileOpen(false);
                                }}
                                className={cn(
                                  "group block border-b border-foreground/5 px-6 py-3 text-sm font-bold text-foreground transition last:border-0 hover:bg-background/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                                  isActiveHref(sub.href)
                                    ? "bg-background/80 text-primary"
                                    : "text-foreground",
                                )}
                              >
                                <span className="relative inline-block">
                                  {sub.title}
                                  <span className="absolute -bottom-0.5 left-0 h-[1.5px] w-0 bg-current transition-all duration-300 group-hover:w-full" />
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
              <button
                type="button"
                onClick={toggleTheme}
                className="mt-3 flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-base font-semibold text-white transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              >
                <span>Theme</span>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </span>
              </button>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
