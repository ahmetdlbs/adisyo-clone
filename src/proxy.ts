import { NextResponse, type NextRequest } from "next/server";
import { decideAccess } from "@/features/auth/model/access";
import { SESSION_COOKIE, decryptSession } from "@/features/auth/server/session";
import { getServerEnv } from "@/lib/env";

/**
 * Optimistic gate: reads the signed cookie only (no data lookups), because the proxy also runs for
 * prefetches. It filters visitors out early; data access must still check the session itself.
 */
export async function proxy(request: NextRequest) {
  const session = await decryptSession(request.cookies.get(SESSION_COOKIE)?.value, getServerEnv().SESSION_SECRET);
  const decision = decideAccess(request.nextUrl.pathname, session !== null);

  return decision.action === "redirect"
    ? NextResponse.redirect(new URL(decision.to, request.url))
    : NextResponse.next();
}

// Everything except build assets and files served from /public.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/|fonts/).*)"],
};
