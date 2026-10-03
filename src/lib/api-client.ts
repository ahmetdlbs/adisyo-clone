import "server-only";
import { getSessionToken } from "@/features/auth/server/session";
import { getServerEnv } from "./env";

const GENERIC_ERROR_MESSAGE = "Sunucu ile iletişim kurulamadı";
const NO_CONTENT_STATUS = 204;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface ApiFetchInit extends Omit<RequestInit, "body"> {
  body?: unknown;
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (body && typeof body === "object" && "message" in body && typeof body.message === "string") {
      return body.message;
    }
  } catch {
    // The body wasn't JSON (or was empty); fall through to the generic message below.
  }
  return GENERIC_ERROR_MESSAGE;
}

/**
 * Calls `api/` (the NestJS backend) on the signed-in user's behalf: forwards the session cookie's own
 * token as `Authorization: Bearer <token>` — the same JWT, no separate exchange — and throws a typed
 * `ApiError` on any non-2xx response so callers can show a Turkish message instead of a raw fetch failure
 * or a leaked stack trace.
 */
export async function apiFetch<T>(path: string, init: ApiFetchInit = {}): Promise<T> {
  const token = await getSessionToken();

  const response = await fetch(`${getServerEnv().NEST_API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ApiError(await extractErrorMessage(response), response.status);
  }
  if (response.status === NO_CONTENT_STATUS) return undefined as T;
  return (await response.json()) as T;
}
