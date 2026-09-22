import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PanelProps extends Omit<ComponentProps<"section">, "title"> {
  title: string;
  /** Small text at the right of the heading, e.g. a unit. */
  aside?: ReactNode;
}

/** A titled box on a dashboard. It is a region named by its heading, so screen readers can jump between them. */
export function Panel({ title, aside, className, children, ...props }: PanelProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className={cn("rounded-lg border bg-card p-5 shadow-sm", className)} {...props}>
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 id={headingId} className="text-sm font-semibold text-foreground">
          {title}
        </h2>
        {aside && <span className="text-xs text-muted-foreground">{aside}</span>}
      </header>
      {children}
    </section>
  );
}
