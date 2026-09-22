import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const TONE_CLASSES = {
  primary: "bg-primary text-primary-foreground",
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  destructive: "bg-destructive text-white",
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
    <div role="group" aria-label={label} className={cn("relative rounded-lg border bg-card px-4 pt-4 pb-4 shadow-sm", className)}>
      <div
        data-testid="stat-card-icon"
        data-tone={iconClassName ? undefined : tone}
        aria-hidden="true"
        className={cn("absolute -top-5 left-4 flex size-16 items-center justify-center rounded-lg shadow-lg", iconClassName ?? TONE_CLASSES[tone])}
      >
        <Icon className="size-8" />
      </div>
      <div className="pl-20 text-right">
        <span className="block text-[13px] text-muted-foreground">{label}</span>
        <div className="mt-1 text-2xl font-bold text-foreground">{value}</div>
      </div>
      {footer && (
        <div data-testid="stat-card-footer" className="mt-4 border-t pt-3 text-right text-xs text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}
