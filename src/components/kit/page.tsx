import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** Canvas of a signed-in screen: padding plus a centred, width-limited column that fills the height. */
export function PageContainer({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="page-container" className="flex h-full min-h-0 w-full flex-col overflow-auto p-6" {...props}>
      <div className={cn("mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col", className)}>{children}</div>
    </div>
  );
}

/** White surface that holds a screen's header and content. */
export function PageCard({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      data-slot="page-card"
      className={cn("flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-(--shadow-card)", className)}
      {...props}
    />
  );
}

/** Row under a screen's header for search, filters and the primary action. */
export function PageToolbar({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="page-toolbar" className={cn("flex items-center justify-between gap-3 border-y px-6 py-3", className)} {...props} />;
}

/** The scrolling part of a PageCard, below its header. */
export function PageBody({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="page-body" className={cn("min-h-0 flex-1 overflow-auto px-6 pb-6", className)} {...props} />;
}
