import { createHash, timingSafeEqual } from "node:crypto";

// Demo-account check for the clone. Credentials come from the environment (.env.local):
//   DEMO_LOGIN_USER=...        DEMO_LOGIN_PASSWORD=...
// Nothing is forwarded to the real Adisyo API.

interface ApiResponse {
  success: boolean;
  error: string | null;
}

const digest = (value: string) => createHash("sha256").update(value).digest();
const safeEqual = (a: string, b: string) => timingSafeEqual(digest(a), digest(b));

const respond = (body: ApiResponse, status: number) => Response.json(body, { status });

export async function POST(request: Request) {
  const expectedUser = process.env.DEMO_LOGIN_USER;
  const expectedPassword = process.env.DEMO_LOGIN_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    console.error("[api/login] DEMO_LOGIN_USER / DEMO_LOGIN_PASSWORD are not configured");
    return respond({ success: false, error: "login_not_configured" }, 500);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return respond({ success: false, error: "invalid_body" }, 400);
  }

  const { username, password } = (payload ?? {}) as Record<string, unknown>;
  if (typeof username !== "string" || typeof password !== "string") {
    return respond({ success: false, error: "invalid_body" }, 400);
  }

  const isUserValid = safeEqual(username, expectedUser);
  const isPasswordValid = safeEqual(password, expectedPassword);
  if (!isUserValid || !isPasswordValid) {
    return respond({ success: false, error: "invalid_credentials" }, 401);
  }

  return respond({ success: true, error: null }, 200);
}
