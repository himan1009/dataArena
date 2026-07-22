import { cn } from "@/lib/utils";

export function SectionHeader({
  label,
  title,
  description,
  align = "left",
  className,
}: {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-10 sm:mb-12",
        align === "center" && "mx-auto max-w-2xl text-center",
        className,
      )}
    >
      {label && <p className="section-label mb-3">{label}</p>}
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {description && <p className="prose-muted mt-3">{description}</p>}
    </div>
  );
}

export function PageHeader({
  label,
  title,
  description,
  className,
  as: Heading = "h2",
}: {
  label?: string;
  title: string;
  description?: string;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <header className={cn("mb-8 sm:mb-10", className)}>
      {label && <p className="section-label mb-2">{label}</p>}
      <Heading className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</Heading>
      {description && (
        <p className="prose-muted mt-2 max-w-2xl">{description}</p>
      )}
    </header>
  );
}
