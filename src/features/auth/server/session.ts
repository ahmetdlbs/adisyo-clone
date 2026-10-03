import "server-only";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { getServerEnv } from "@/lib/env";

export const SESSION_COOKIE = "session";
/** One long shift. Must match api/'s AuthModule SESSION_TTL_SECONDS — same token, same lifetime. */
export const SESSION_TTL_SECONDS = 12 * 60 * 60;

export const SESSION_ROLES = ["PLATFORM_ADMIN", "OWNER", "MANAGER", "STAFF"] as const;
export type SessionRole = (typeof SESSION_ROLES)[number];

/** Decoded from the JWT api/'s `POST /auth/login` mints (see api/src/auth/auth.service.ts). */
export interface SessionPayload {
  userId: string;
  tenantId: string;
  role: SessionRole;
  name: string;
  email: string;
}

const encodeKey = (secret: string) => new TextEncoder().encode(secret);
const isSessionRole = (value: unknown): value is SessionRole =>
  typeof value === "string" && (SESSION_ROLES as readonly string[]).includes(value);

/** Returns the payload of a valid, unexpired token signed with `secret`, otherwise null. */
export async function decryptSession(token: string | undefined, secret: string): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodeKey(secret), { algorithms: ["HS256"] });
    const { sub: userId, tenantId, role, name, email } = payload;

    if (
      typeof userId === "string" &&
      userId !== "" &&
      typeof tenantId === "string" &&
      tenantId !== "" &&
      isSessionRole(role) &&
      typeof name === "string" &&
      name !== "" &&
      typeof email === "string" &&
      email !== ""
    ) {
      return { userId, tenantId, role, name, email };
    }
    return null;
  } catch {
    // Expired, tampered and malformed tokens all mean the same thing here: not signed in. Logging each one
    // would only add noise to every request from a stale browser.
    return null;
  }
}

/**
 * Stores the token api/'s `/auth/login` returned as an httpOnly cookie. This process never signs a
 * session itself — minting the JWT is api/'s job; app/ only verifies it (`decryptSession`) and forwards
 * it as a Bearer header (`lib/api-client.ts`).
 */
export async function createSession(token: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function deleteSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

/** The signed-in user of this request, or null. Call it wherever data is read, not only in the proxy. */
export async function getSession(): Promise<SessionPayload | null> {
  return decryptSession(await getSessionToken(), getServerEnv().SESSION_SECRET);
}

/** The raw token, forwarded as `Authorization: Bearer <token>` by `lib/api-client.ts`. Never log or render it. */
export async function getSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE)?.value;
}
