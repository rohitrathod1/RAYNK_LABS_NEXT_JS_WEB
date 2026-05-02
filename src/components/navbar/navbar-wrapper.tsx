'use client';

import { useState, useEffect } from 'react';
import { Navbar } from './navbar';
import { SITE_NAME } from '@/lib/constants';

interface NavLink {
  title: string;
  href: string;
  subLinks?: { title: string; href: string }[];
}

export function NavbarWrapper() {
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);

  useEffect(() => {
    fetch('/api/navbar')
      .then((r) => r.json())
      .then(({ links }) => {
        const mapped = (links || []).map((link: any) => ({
          title: link.title,
          href: link.href,
          subLinks: link.subLinks?.map((child: any) => ({
            title: child.title,
            href: child.href,
          })),
        }));
        setNavLinks(mapped);
      })
      .catch((err) => console.error('Failed to load nav links', err));
  }, []);

  return <Navbar logoUrl={null} logoAlt={SITE_NAME} links={navLinks} />;
}
