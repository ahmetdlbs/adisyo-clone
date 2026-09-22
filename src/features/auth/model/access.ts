import { ROUTES } from "@/config/routes";

/** Pages only a visitor makes sense on: a signed-in user is sent to the dashboard instead. */
const GUEST_ONLY_ROUTES: readonly string[] = [ROUTES.login, ROUTES.register, ROUTES.forgotPassword];
/** Pages that need no session. Onboarding stays reachable while signed in. */
const PUBLIC_ROUTES: readonly string[] = [...GUEST_ONLY_ROUTES, ROUTES.onboarding];

const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;

const isUnder = (routes: readonly string[], pathname: string) =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

export type AccessDecision = { action: "allow" } | { action: "redirect"; to: string };

/** The one rule the proxy applies to every request. Pure, so it is tested without a running server. */
export function decideAccess(pathname: string, isAuthenticated: boolean): AccessDecision {
  if (!isAuthenticated) {
    if (isUnder(PUBLIC_ROUTES, pathname)) return { action: "allow" };
    const next = pathname === "/" ? "" : `?next=${encodeURIComponent(pathname)}`;
    return { action: "redirect", to: `${ROUTES.login}${next}` };
  }
  return isUnder(GUEST_ONLY_ROUTES, pathname) ? { action: "redirect", to: ROUTES.dashboard } : { action: "allow" };
}

/**
 * Validates a post-login destination taken from the URL. Only same-site absolute paths pass, which rules out
 * open redirects (`//evil.com`, `/\evil.com`, `https://…`, tab-smuggled `/\t/evil.com`) and login loops.
 */
export function safeRedirectPath(value: string | string[] | null | undefined, fallback: string = ROUTES.dashboard): string {
  if (typeof value !== "string" || CONTROL_CHARACTERS.test(value)) return fallback;

  const isSameSitePath = value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\");
  if (!isSameSitePath) return fallback;

  const pathname = value.split(/[?#]/)[0] ?? value;
  return isUnder(GUEST_ONLY_ROUTES, pathname) ? fallback : value;
}
