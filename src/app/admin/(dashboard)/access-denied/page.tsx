import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui";

export default function AdminAccessDeniedPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl items-center justify-center px-4 py-10">
      <section className="w-full rounded-3xl border border-border bg-card/80 p-6 text-center shadow-xl backdrop-blur sm:p-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
          <ShieldAlert className="h-10 w-10" aria-hidden="true" />
        </div>
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary sm:text-sm">
          Access Denied
        </p>
        <h1 className="text-2xl font-black tracking-tight sm:text-4xl">
          You do not have permission for this section
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
          Your RBAC role does not include access to this dashboard area. Return to your dashboard
          and use the sections available to your account.
        </p>
        <Button asChild className="mt-8 h-11 rounded-xl px-5 transition-all duration-300 ease-in-out hover:-translate-y-0.5">
          <Link href="/admin">Go Dashboard</Link>
        </Button>
      </section>
    </div>
  );
}
