import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const TONE_CLASSES = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
} as const;

export type StatTone = keyof typeof TONE_CLASSES;

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  /** The figure. Any node, so a caller can show a skeleton while data loads. */
  value: ReactNode;
  /** A short line under the figure: a hint or a link. */
  footer?: ReactNode;
  tone?: StatTone;
  /** Replaces the tone's background entirely (e.g. a gradient), for the one card whose brand colour is not one of the tones. */
  iconClassName?: string;
  className?: string;
}

/** One headline figure of a dashboard: coloured icon tile, label, value and an optional footer line. */
export function StatCard({ icon: Icon, label, value, footer, tone = "primary", iconClassName, className }: StatCardProps) {
  return (
    <div role="group" aria-label={label} className={cn("rounded-xl border bg-card p-5 shadow-(--shadow-card)", className)}>
      <div className="flex items-start gap-4">
        <div
          data-testid="stat-card-icon"
          data-tone={iconClassName ? undefined : tone}
          aria-hidden="true"
          className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl", iconClassName ?? TONE_CLASSES[tone])}
        >
          <Icon className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="block text-[13px] leading-snug font-medium text-muted-foreground">{label}</span>
          <div className="mt-1 truncate text-2xl font-bold tracking-tight text-foreground">{value}</div>
        </div>
      </div>
      {footer && (
        <div data-testid="stat-card-footer" className="mt-4 border-t pt-3 text-xs font-medium text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}
