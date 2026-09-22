import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import type { ServerEnv } from "@/lib/env";
import type { LoginValues } from "../model/login";

// Hashing first gives both sides the same length, which timingSafeEqual requires.
const digest = (value: string) => createHash("sha256").update(value).digest();
const safeEqual = (a: string, b: string) => timingSafeEqual(digest(a), digest(b));

/**
 * Checks the demo account. Both comparisons always run, so response time does not reveal which of the two
 * was wrong.
 */
export function verifyCredentials(
  { username, password }: LoginValues,
  expected: Pick<ServerEnv, "DEMO_LOGIN_USER" | "DEMO_LOGIN_PASSWORD">
): boolean {
  const isUserValid = safeEqual(username, expected.DEMO_LOGIN_USER);
  const isPasswordValid = safeEqual(password, expected.DEMO_LOGIN_PASSWORD);
  return isUserValid && isPasswordValid;
}
