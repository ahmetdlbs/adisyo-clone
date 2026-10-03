import "server-only";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { LoginValues } from "../model/login";

/** What api/'s `POST /auth/login` returns on success — see api/src/auth/auth.service.ts LoginResult. */
export interface LoginResult {
  token: string;
  user: { id: string; tenantId: string; role: string; name: string; email: string };
}

/**
 * Checks the given credentials against api/. Returns the login result on success, `null` on a wrong
 * email/password (api/ answers 401 for both, so which one was wrong never leaks here either). Any other
 * failure (api/ unreachable, 5xx, ...) is rethrown — that's not "wrong credentials", it's an outage.
 */
export async function verifyCredentials({ username, password }: LoginValues): Promise<LoginResult | null> {
  try {
    return await apiFetch<LoginResult>("/auth/login", { method: "POST", body: { email: username, password } });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}
