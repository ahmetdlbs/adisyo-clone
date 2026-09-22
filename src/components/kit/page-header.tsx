import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  /** Help text; may contain links. */
  description?: ReactNode;
  icon?: LucideIcon;
  /** Right-aligned controls: primary/secondary buttons, filters. */
  actions?: ReactNode;
  className?: string;
}

/** Title block shared by every dashboard screen: icon tile, heading, help text, actions. */
export function PageHeader({ title, description, icon: Icon, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("flex items-start justify-between gap-4", className)}>
      <div className="flex gap-4">
        {Icon && (
          <div
            data-testid="page-header-icon"
            aria-hidden="true"
            className="flex size-14 shrink-0 items-center justify-center rounded-md bg-section text-section-foreground shadow-sm"
          >
            <Icon className="size-7" />
          </div>
        )}
        <div className="flex max-w-2xl flex-col gap-1">
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {description && (
            <p data-testid="page-header-description" className="text-[13px] leading-snug text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </header>
  );
}
