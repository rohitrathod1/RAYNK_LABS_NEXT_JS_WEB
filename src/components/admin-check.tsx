import { NavbarWrapper } from '@/components/navbar/navbar-wrapper';

export function AdminCheck({ pathname }: { pathname: string }) {
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return null;
  }

  return <NavbarWrapper />;
}
