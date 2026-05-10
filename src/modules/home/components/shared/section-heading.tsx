interface HomeSectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export function HomeSectionHeading({
  title,
  subtitle,
  align = "center",
}: HomeSectionHeadingProps) {
  return (
    <header
      className={
        align === "center"
          ? "mx-auto max-w-3xl space-y-4 text-center"
          : "max-w-3xl space-y-4"
      }
    >
      <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}

