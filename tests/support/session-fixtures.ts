import { SignJWT } from "jose";
import type { SessionRole } from "@/features/auth/server/session";

export interface SessionTokenOverrides {
  userId?: string;
  tenantId?: string;
  role?: SessionRole;
  name?: string;
  email?: string;
  issuedAt?: Date;
  /** Omit for a token that expires 12h from `issuedAt` (the real session TTL). */
  expiresAt?: Date;
}

/**
 * Builds a token shaped exactly like the one api/'s `AuthService.login` mints, for tests that need a
 * signed-in session without a running backend. Field names mirror `api/src/auth/auth.service.ts`.
 */
export async function buildSessionToken(secret: string, overrides: SessionTokenOverrides = {}): Promise<string> {
  const {
    userId = "user-1",
    tenantId = "tenant-1",
    role = "OWNER",
    name = "Ahmet Demo",
    email = "demo@adisyonmerkezi.com",
    issuedAt = new Date(),
    expiresAt,
  } = overrides;

  const jwt = new SignJWT({ tenantId, role, name, email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt(issuedAt);

  jwt.setExpirationTime(expiresAt ? Math.floor(expiresAt.getTime() / 1000) : "12h");

  return jwt.sign(new TextEncoder().encode(secret));
}
