"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface SystemStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
}

interface SystemStateProps {
  eyebrow?: string;
  code?: string;
  title: string;
  description: string;
  icon: LucideIcon;
  primaryAction?: SystemStateAction;
  secondaryAction?: SystemStateAction;
  details?: React.ReactNode;
  className?: string;
}

function ActionButton({ action }: { action: SystemStateAction }) {
  const Icon = action.icon;
  const button = (
    <Button
      type="button"
      variant={action.variant ?? "default"}
      onClick={action.onClick}
      className="h-11 rounded-xl px-5 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-primary/40"
    >
      {Icon && <Icon className="h-4 w-4" />}
      {action.label}
    </Button>
  );

  if (action.href) {
    return (
      <Button
        asChild
        variant={action.variant ?? "default"}
        className="h-11 rounded-xl px-5 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-primary/40"
      >
        <Link href={action.href}>
          {Icon && <Icon className="h-4 w-4" />}
          {action.label}
        </Link>
      </Button>
    );
  }

  return button;
}

export function BackAction({ label = "Back to Previous Page" }: { label?: string }) {
  const router = useRouter();
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => router.back()}
      className="h-11 rounded-xl px-5 transition-all duration-300 ease-in-out hover:-translate-y-0.5 focus-visible:ring-primary/40"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}

export function SystemState({
  eyebrow,
  code,
  title,
  description,
  icon: Icon,
  primaryAction,
  secondaryAction,
  details,
  className,
}: SystemStateProps) {
  return (
    <main
      className={cn(
        "relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-16 text-foreground",
        className,
      )}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background" />

      <section className="relative z-10 w-full max-w-2xl rounded-3xl border border-border bg-card/80 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-border bg-primary/10 text-primary shadow-lg shadow-primary/10 transition-all duration-300 ease-in-out hover:scale-105">
          <Icon className="h-10 w-10 animate-pulse" aria-hidden="true" />
        </div>

        {eyebrow && (
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary sm:text-sm">
            {eyebrow}
          </p>
        )}

        {code && (
          <p className="select-none bg-gradient-to-r from-primary via-foreground to-secondary bg-clip-text text-7xl font-black leading-none text-transparent drop-shadow-sm sm:text-8xl">
            {code}
          </p>
        )}

        <h1 className="mt-4 text-2xl font-black tracking-tight sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
          {description}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {secondaryAction ? <ActionButton action={secondaryAction} /> : <BackAction />}
          {primaryAction && <ActionButton action={primaryAction} />}
        </div>

        {details && (
          <div className="mt-6 rounded-2xl border border-border bg-background/70 p-4 text-left text-xs text-muted-foreground">
            {details}
          </div>
        )}
      </section>
    </main>
  );
}

export function defaultHomeAction(label = "Go Home"): SystemStateAction {
  return { label, href: "/", icon: Home };
}

export function defaultRetryAction(onClick: () => void): SystemStateAction {
  return { label: "Try Again", onClick, icon: RotateCcw };
}
