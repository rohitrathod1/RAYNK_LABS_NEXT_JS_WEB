'use client';

import { useState, useEffect } from 'react';
import { Navbar } from './navbar';
import { SITE_NAME } from '@/lib/constants';

interface NavLink {
  title: string;
  href: string;
  subLinks?: { title: string; href: string }[];
}

interface ApiNavLink {
  title: string;
  href: string;
  subLinks?: { title: string; href: string }[];
}

interface NavbarSetting {
  logoUrl: string | null;
  logoAlt: string | null;
}

export function NavbarWrapper() {
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [setting, setSetting] = useState<NavbarSetting | null>(null);

  useEffect(() => {
    fetch('/api/navbar')
      .then((r) => r.json())
      .then(({ data }: { data?: ApiNavLink[] }) => {
        const mapped = (data || []).map((link) => ({
          title: link.title,
          href: link.href,
          subLinks: link.subLinks?.map((child) => ({
            title: child.title,
            href: child.href,
          })),
        }));
        setNavLinks(mapped);
      })
      .catch((err) => console.error('Failed to load nav links', err));

    fetch('/api/navbar/settings')
      .then((r) => r.json())
      .then(({ data }: { data?: NavbarSetting }) => setSetting(data ?? null))
      .catch((err) => console.error('Failed to load navbar settings', err));
  }, []);

  return (
    <Navbar
      logoUrl={setting?.logoUrl ?? null}
      logoAlt={setting?.logoAlt ?? SITE_NAME}
      links={navLinks}
    />
  );
}
