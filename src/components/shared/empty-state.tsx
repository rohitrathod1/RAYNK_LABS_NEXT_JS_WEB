import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, eyebrow, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/40 px-6 py-16 text-center transition-all duration-300 ease-in-out hover:border-primary/40 hover:bg-card/70',
        className,
      )}
    >
      {icon && (
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 ease-in-out hover:scale-105">
          {icon}
        </div>
      )}
      {eyebrow && (
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">{eyebrow}</p>
      )}
      <h3 className="text-lg font-jost-bold text-foreground">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
