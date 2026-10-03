const TRY_FORMATTER = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
});

/** "20:03" for an ISO timestamp, in the viewer's time zone unless one is given. Render it on the client only. */
export function formatClock(isoTime: string, timeZone?: string): string {
  return new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone }).format(new Date(isoTime));
}

/** "19.09.2026" for an ISO timestamp, in the viewer's time zone unless one is given. Render it on the client only. */
export function formatDate(isoTime: string, timeZone?: string): string {
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone }).format(new Date(isoTime));
}

/** Formats a lira amount for display, e.g. `1234.5` -> `₺1.234,50`. Throws on NaN/Infinity so a broken total never renders. */
export function formatTRY(amount: number): string {
  if (!Number.isFinite(amount)) {
    throw new RangeError(`formatTRY: amount must be a finite number, received ${amount}`);
  }
  return TRY_FORMATTER.format(amount);
}
