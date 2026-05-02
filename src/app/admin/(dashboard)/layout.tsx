'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from '@/providers/theme-provider';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import {
  Menu,
  X,
  LayoutDashboard,
  Home,
  Sparkles,
  Newspaper,
  Users,
  Globe,
  Navigation,
  PanelBottom,
  LogOut,
  ArrowLeft,
  Moon,
  Sun,
  ExternalLink,
  UserCog,
  FolderOpen,
  MessageSquare,
} from 'lucide-react';
import { PERMISSIONS } from '@/modules/rbac/constants';
import type { PermissionKey } from '@/modules/rbac/constants';
import { LogoutModal } from '@/components/admin/logout-modal';

interface NavChild {
  title: string;
  href: string;
  icon: React.ElementType;
  tab?: string;
}

interface NavSection {
  title: string;
  href: string;
  icon: React.ElementType;
  permission: PermissionKey | null;
  children: NavChild[];
}

const SIDEBAR_SECTIONS: NavSection[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    permission: null,
    children: [],
  },
  {
    title: 'Profile',
    href: '/admin/profile',
    icon: Users,
    permission: null,
    children: [],
  },
  {
    title: 'Home',
    href: '/admin/home',
    icon: Home,
    permission: PERMISSIONS.EDIT_HOME,
    children: [],
  },
  {
    title: 'Services',
    href: '/admin/services',
    icon: Sparkles,
    permission: PERMISSIONS.MANAGE_SERVICES,
    children: [],
  },
  {
    title: 'Portfolio',
    href: '/admin/portfolio',
    icon: FolderOpen,
    permission: PERMISSIONS.MANAGE_PORTFOLIO,
    children: [],
  },
  {
    title: 'Blog',
    href: '/admin/blogs',
    icon: Newspaper,
    permission: PERMISSIONS.MANAGE_BLOG,
    children: [],
  },
  {
    title: 'Team',
    href: '/admin/team',
    icon: Users,
    permission: PERMISSIONS.MANAGE_TEAM,
    children: [],
  },
  {
    title: 'Contact',
    href: '/admin/contact',
    icon: MessageSquare,
    permission: PERMISSIONS.MANAGE_CONTACT,
    children: [],
  },
  {
    title: 'Navbar',
    href: '/admin/navbar',
    icon: Navigation,
    permission: PERMISSIONS.MANAGE_NAVBAR,
    children: [],
  },
  {
    title: 'Footer',
    href: '/admin/footer',
    icon: PanelBottom,
    permission: PERMISSIONS.MANAGE_FOOTER,
    children: [],
  },
  {
    title: 'SEO',
    href: '/admin/seo',
    icon: Globe,
    permission: PERMISSIONS.MANAGE_SEO,
    children: [],
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: UserCog,
    permission: PERMISSIONS.MANAGE_USERS,
    children: [],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const userRole = session?.user?.role as string | undefined;
  const userPermissions = (session?.user?.permissions as string[]) || [];

  const visibleSections = useMemo(() => {
    return SIDEBAR_SECTIONS.filter((section) => {
      if (!section.permission) return true;
      if (userRole === 'SUPER_ADMIN') return true;
      return userPermissions.includes(section.permission);
    });
  }, [userRole, userPermissions]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node) && mobileOpen) {
        setMobileOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [mobileOpen]);

  const isActive = (href: string) => pathname === href;

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
            const active = isActive(section.href);
            const Icon = section.icon;

            return (
              <div key={section.title}>
                <Link
                  href={section.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary 2xl:px-4 2xl:py-3 2xl:text-base',
                    active
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                      : 'text-foreground/75 hover:translate-x-0.5 hover:bg-accent hover:text-foreground',
                  )}
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
