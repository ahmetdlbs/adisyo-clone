import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { getServerEnv } from "@/lib/env";

export const SESSION_COOKIE = "session";
/** One long shift. */
export const SESSION_TTL_SECONDS = 12 * 60 * 60;

/** Kept minimal on purpose: enough to know who is signed in, nothing personal. */
export interface SessionPayload {
  username: string;
}

const encodeKey = (secret: string) => new TextEncoder().encode(secret);

export async function encryptSession(
  { username }: SessionPayload,
  secret: string,
  issuedAt: Date = new Date()
): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(issuedAt)
    .setExpirationTime(Math.floor(issuedAt.getTime() / 1000) + SESSION_TTL_SECONDS)
    .sign(encodeKey(secret));
}

/** Returns the payload of a valid, unexpired token signed with `secret`, otherwise null. */
export async function decryptSession(token: string | undefined, secret: string): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodeKey(secret), { algorithms: ["HS256"] });
    return typeof payload.username === "string" && payload.username !== "" ? { username: payload.username } : null;
  } catch {
    // Expired, tampered and malformed tokens all mean the same thing here: not signed in. Logging each one
    // would only add noise to every request from a stale browser.
    return null;
  }
}

export async function createSession(username: string): Promise<void> {
  const issuedAt = new Date();
  const token = await encryptSession({ username }, getServerEnv().SESSION_SECRET, issuedAt);

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(issuedAt.getTime() + SESSION_TTL_SECONDS * 1000),
  });
}

export async function deleteSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

/** The signed-in user of this request, or null. Call it wherever data is read, not only in the proxy. */
export async function getSession(): Promise<SessionPayload | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return decryptSession(token, getServerEnv().SESSION_SECRET);
}
