import "server-only";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { LoginValues } from "../model/login";
import type { RegisterFormValues } from "../model/register";

/** What api/'s `POST /auth/login` returns on success — see api/src/auth/auth.service.ts LoginResult. */
export interface LoginResult {
  token: string;
  user: { id: string; tenantId: string; role: string; name: string; email: string };
}

/** Creates a restaurant and its owner through api/'s `POST /auth/register`; the result signs the owner in. */
export async function registerRestaurant(values: RegisterFormValues): Promise<LoginResult> {
  return apiFetch<LoginResult>("/auth/register", {
    method: "POST",
    body: {
      restaurantName: values.restaurantName,
      fullName: values.fullName,
      email: values.email,
      phone: `${values.countryCode}${values.phone}`,
      password: values.password,
    },
  });
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
