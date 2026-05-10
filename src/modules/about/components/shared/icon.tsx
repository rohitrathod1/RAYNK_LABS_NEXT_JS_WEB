import * as Icons from "lucide-react";

export function AboutIcon({ name, className }: { name: string; className?: string }) {
  const Icon = Icons[name as keyof typeof Icons] as React.ElementType | undefined;
  const Component = Icon ?? Icons.Sparkles;

  return <Component className={className} aria-hidden="true" />;
}

