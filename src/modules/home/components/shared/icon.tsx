import * as Icons from "lucide-react";

interface HomeIconProps {
  name: string;
  className?: string;
}

export function HomeIcon({ name, className }: HomeIconProps) {
  const Icon = Icons[name as keyof typeof Icons] as React.ElementType | undefined;
  const Fallback = Icons.Sparkles;
  const Component = Icon ?? Fallback;

  return <Component className={className} aria-hidden="true" />;
}

