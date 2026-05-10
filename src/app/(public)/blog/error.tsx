"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BlogError({ reset }: { reset: () => void }) {
  return (
    <main className="section-container flex min-h-[60vh] items-center justify-center py-20">
      <div className="max-w-xl rounded-xl border border-border bg-card p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold">Blog could not load</h1>
        <p className="mt-3 text-muted-foreground">Something went wrong while loading the articles.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button type="button" onClick={reset}>Try Again</Button>
          <Button asChild variant="outline">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
