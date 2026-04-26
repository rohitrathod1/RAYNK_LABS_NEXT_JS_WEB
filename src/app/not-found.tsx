import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
};

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-6 text-center px-4">
      <h1 className="text-8xl font-bold text-primary">404</h1>
      <p className="text-xl text-muted-foreground">This page does not exist.</p>
      <Link
        href="/"
        className="text-sm underline underline-offset-4 hover:text-primary transition-colors"
      >
        Back to home
      </Link>
    </main>
  );
}
