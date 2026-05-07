'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from '@/providers/theme-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Globe,
  FileText,
  Home,
  Info,
  Briefcase,
  FolderKanban,
  Newspaper,
  Mail,
  Navigation,
  PanelBottom,
  ChevronDown,
  LogOut,
  ArrowLeft,
  Moon,
  Sun,
  ExternalLink,
  UserCog,
} from 'lucide-react';
import { PERMISSIONS } from '@/modules/rbac/constants';
import type { PermissionKey } from '@/modules/rbac/constants';
import { LogoutModal } from '@/components/admin/logout-modal';

interface NavChild {
  title: string;
  href: string;
  icon: React.ElementType;
  query?: string;
  permission: PermissionKey | null;
}

interface NavSection {
  title: string;
  href: string;
  icon: React.ElementType;
  permission: PermissionKey | null;
  children: NavChild[];
}

const CMS_PAGES: NavChild[] = [
  { title: 'Home', href: '/admin/home', icon: Home, permission: PERMISSIONS.EDIT_HOME },
  { title: 'About', href: '/admin/about', icon: Info, permission: PERMISSIONS.EDIT_ABOUT },
  { title: 'Services', href: '/admin/services', icon: Briefcase, permission: PERMISSIONS.MANAGE_SERVICES },
  { title: 'Portfolio', href: '/admin/portfolio', icon: FolderKanban, permission: PERMISSIONS.MANAGE_PORTFOLIO },
  { title: 'Blog', href: '/admin/blogs', icon: Newspaper, permission: PERMISSIONS.MANAGE_BLOG },
  { title: 'Contact', href: '/admin/contact', icon: Mail, permission: PERMISSIONS.MANAGE_CONTACT },
  { title: 'Navbar', href: '/admin/navbar', icon: Navigation, permission: PERMISSIONS.MANAGE_NAVBAR },
  { title: 'Footer', href: '/admin/footer', icon: PanelBottom, permission: PERMISSIONS.MANAGE_FOOTER },
];

const TEAM_PAGES: NavChild[] = [
  { title: 'Team Page', href: '/admin/team', icon: Users, permission: PERMISSIONS.MANAGE_TEAM },
  { title: 'Users', href: '/admin/users', icon: UserCog, permission: PERMISSIONS.MANAGE_USERS },
  { title: 'Profile', href: '/admin/profile', icon: Users, permission: null },
];

interface SeoSidebarPage {
  id: string;
  page: string;
  metaTitle: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ Dashboard: true, SEO: true, Team: true });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [seoPages, setSeoPages] = useState<SeoSidebarPage[]>([]);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const userRole = session?.user?.role as string | undefined;
  const rawPermissions = session?.user?.permissions;
  const userPermissions = useMemo(
    () => (Array.isArray(rawPermissions) ? (rawPermissions as string[]) : []),
    [rawPermissions],
  );

  const can = useCallback((permission: PermissionKey | null) => {
    if (!permission) return true;
    if (userRole === 'SUPER_ADMIN') return true;
    return userPermissions.includes(permission);
  }, [userRole, userPermissions]);

  const canManageSeo = can(PERMISSIONS.MANAGE_SEO);

  useEffect(() => {
    if (!session || !canManageSeo) return;
    const id = window.setTimeout(() => {
      fetch('/api/admin/seo', { cache: 'no-store' })
        .then((response) => response.json())
        .then((payload: { success?: boolean; data?: SeoSidebarPage[] }) => {
          if (payload.success) setSeoPages(payload.data ?? []);
        })
        .catch(() => setSeoPages([]));
    }, 0);

    return () => window.clearTimeout(id);
  }, [canManageSeo, session]);

  const sidebarSections = useMemo<NavSection[]>(() => {
    const dashboardChildren = CMS_PAGES.filter((page) => can(page.permission));
    const seoChildren = canManageSeo
      ? seoPages
          .map((seoPage) => {
            const matchingPage = CMS_PAGES.find((page) => page.title.toLowerCase().replace(/\s+/g, '-') === seoPage.page || page.href.endsWith(`/${seoPage.page}`));
            if (matchingPage && !can(matchingPage.permission)) return null;
            return {
              title: seoPage.page.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
              href: '/admin/seo',
              icon: FileText,
              query: `page=${encodeURIComponent(seoPage.page)}`,
              permission: matchingPage?.permission ?? PERMISSIONS.MANAGE_SEO,
            };
          })
          .filter(Boolean) as NavChild[]
      : [];
    const teamChildren = TEAM_PAGES.filter((page) => can(page.permission));

    return [
      {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
        permission: null,
        children: dashboardChildren,
      },
      {
        title: 'SEO',
        href: '/admin/seo',
        icon: Globe,
        permission: PERMISSIONS.MANAGE_SEO,
        children: seoChildren,
      },
      {
        title: 'Team',
        href: teamChildren[0]?.href ?? '/admin/profile',
        icon: Users,
        permission: null,
        children: teamChildren,
      },
    ];
  }, [can, canManageSeo, seoPages]);

  const visibleSections = useMemo(() => {
    return sidebarSections.filter((section) => {
      if (section.children.length === 0 && section.title !== 'SEO') return false;
      if (!section.permission) return section.children.length > 0 || section.href === '/admin';
      return can(section.permission);
    });
  }, [can, sidebarSections]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node) && mobileOpen) {
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [mobileOpen]);

  const currentQuery = searchParams.toString();
  const isChildActive = (child: NavChild) =>
    pathname === child.href && (child.query ? currentQuery === child.query : !currentQuery || child.href !== '/admin/seo');
  const isActive = (section: NavSection) =>
    pathname === section.href || section.children.some((child) => isChildActive(child));

  const handleLogout = () => {
    signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <div className="admin-shell flex h-screen overflow-hidden bg-background">
      {mobileOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* ── Sidebar ───────────────────────────── */}
      <aside
        ref={sidebarRef}
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex h-screen w-64 flex-col border-r border-white/10 bg-card shadow-sm 2xl:w-72',
          'transform transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-64',
          'md:translate-x-0',
        )}
      >
        {/* Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4 2xl:h-20 2xl:px-6">
          <Link
            href="/"
            title="Back to Website"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowLeft size={20} className="2xl:h-6 2xl:w-6" />
          </Link>
          <span className="truncate px-2 text-lg font-bold 2xl:text-xl">Admin Panel</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-accent hover:text-foreground md:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
          <div className="hidden h-10 w-10 md:block" />
        </div>

        {/* Nav */}
        <nav className="no-scrollbar flex-1 space-y-1 overflow-y-auto p-3">
          {visibleSections.map((section) => {
            const active = isActive(section);
            const isOpen = expanded[section.title] ?? false;
            const Icon = section.icon;

            return (
              <div key={section.title}>
                <div
                  className={cn(
                    'flex items-center rounded-xl transition-all duration-200',
                    active ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-foreground/75 hover:bg-accent hover:text-foreground',
                  )}
                >
                  <Link
                    href={section.href}
                    onClick={() => setMobileOpen(false)}
                    className="group flex min-h-11 flex-1 items-center gap-3 px-3 py-2.5 text-sm font-semibold 2xl:px-4 2xl:py-3 2xl:text-base"
                  >
                    <span
                      className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition',
                        active ? 'bg-white/15' : 'bg-transparent group-hover:bg-primary/10 group-hover:text-primary',
                      )}
                    >
                      <Icon size={17} />
                    </span>
                    <span className="truncate">{section.title}</span>
                  </Link>
                  {section.children.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setExpanded((prev) => ({ ...prev, [section.title]: !isOpen }))}
                      className="flex min-h-11 w-10 items-center justify-center"
                      aria-label={isOpen ? `Collapse ${section.title}` : `Expand ${section.title}`}
                    >
                      <ChevronDown size={16} className={cn('transition-transform duration-200', isOpen && 'rotate-180')} />
                    </button>
                  )}
                </div>

                {section.children.length > 0 && (
                  <div className={cn('overflow-hidden transition-all duration-200', isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0')}>
                    <div className="no-scrollbar ml-5 max-h-72 overflow-y-auto border-l border-border/50 py-1 pl-3">
                      {section.children.map((child) => {
                        const ChildIcon = child.icon;
                        const href = child.query ? `${child.href}?${child.query}` : child.href;
                        const childActive = isChildActive(child);
                        return (
                          <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition',
                              childActive ? 'bg-primary/15 font-semibold text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                            )}
                          >
                            <ChildIcon size={14} />
                            <span>{child.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {visibleSections.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              You don&apos;t have access to any modules
            </div>
          )}
        </nav>

        <div className="shrink-0 border-t border-white/10 p-4 text-xs text-muted-foreground 2xl:p-5 2xl:text-sm">
          <p>Manage all pages from sidebar.</p>
        </div>
      </aside>

      {/* ── Main content ──────────────────────── */}
      <div className="flex h-screen min-w-0 flex-1 flex-col md:ml-64 2xl:ml-72">
        <header className="z-20 flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-background/95 px-4 backdrop-blur md:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 transition hover:border-primary/40 hover:bg-accent"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <h1 className="truncate text-sm font-bold">Admin Panel</h1>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="ghost" size="icon" title="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="h-9 w-9 rounded-xl border border-white/15 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/10">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-white/15 px-3 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/10"
            >
              <ExternalLink className="h-3.5 w-3.5" /> <span className="hidden sm:inline">View Site</span>
            </a>
            <Button variant="destructive" size="sm" onClick={() => setShowLogoutModal(true)} className="h-9 gap-2 rounded-xl bg-red-600 px-3 text-xs shadow-lg shadow-red-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-700">
              <LogOut className="h-3.5 w-3.5" /> <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </header>

        <header className="z-20 hidden h-16 shrink-0 items-center justify-end gap-3 border-b border-white/10 bg-background/95 px-6 backdrop-blur md:flex 2xl:h-20 2xl:px-8 2xl:gap-4">
          <Button variant="ghost" size="icon" title="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="h-10 w-10 rounded-xl border border-white/15 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/10">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/10"
          >
            <ExternalLink className="h-4 w-4" /> View Site
          </a>
          <Button variant="destructive" size="sm" onClick={() => setShowLogoutModal(true)} className="h-10 gap-2 rounded-xl bg-red-600 px-4 shadow-lg shadow-red-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-700">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </header>

        <main className="no-scrollbar min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 2xl:p-10">{children}</main>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

    </div>
  );
}
