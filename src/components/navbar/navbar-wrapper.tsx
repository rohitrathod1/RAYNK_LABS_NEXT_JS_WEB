'use client';

import { useState, useEffect } from 'react';
import { Navbar } from './navbar';
import { SITE_NAME } from '@/lib/constants';

interface NavLink {
  title: string;
  href?: string;
  subLinks?: { title: string; href: string }[];
}

interface ApiNavLink {
  id: string;
  title: string;
  href?: string | null;
  subLinks?: { title: string; href: string }[];
}

interface NavbarSettingsResponse {
  success?: boolean;
  data?: {
    logoUrl?: string | null;
    logoAlt?: string | null;
  };
}

export function NavbarWrapper() {
  const [navLinks, setNavLinks] = useState<NavLink[]>([
    { title: 'About', subLinks: [{ title: 'About Us', href: '/about' }, { title: 'Team', href: '/team' }] },
    { title: 'Services', subLinks: [{ title: 'Our Services', href: '/services' }] },
    { title: 'Work', subLinks: [{ title: 'Portfolio', href: '/portfolio' }, { title: 'Blog', href: '/blog' }] },
    { title: 'Contact', subLinks: [{ title: 'Contact Us', href: '/contact' }] },
  ]);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoAlt, setLogoAlt] = useState<string>(SITE_NAME);

  useEffect(() => {
    Promise.all([
      fetch('/api/navbar', { cache: 'no-store' }).then((response) => response.json()),
      fetch('/api/navbar/settings', { cache: 'no-store' }).then((response) => response.json()),
    ])
      .then(([navPayload, settingPayload]: [{ success?: boolean; data?: ApiNavLink[] }, NavbarSettingsResponse]) => {
        if (navPayload.success && Array.isArray(navPayload.data)) {
          const mapped = navPayload.data.map((link) => ({
            title: link.title,
            href: link.href ?? undefined,
            subLinks: link.subLinks?.map((child) => ({
              title: child.title,
              href: child.href,
            })),
          }));
          setNavLinks(mapped);
        }

        if (settingPayload.success && settingPayload.data) {
          setLogoUrl(settingPayload.data.logoUrl ?? null);
          setLogoAlt(settingPayload.data.logoAlt?.trim() || SITE_NAME);
        }
      })
      .catch((err) => console.error('Failed to load navbar data', err));
  }, []);

  return <Navbar logoUrl={logoUrl} logoAlt={logoAlt} links={navLinks} />;
}
