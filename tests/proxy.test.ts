// @vitest-environment node
import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";
import { SESSION_COOKIE } from "@/features/auth/server/session";
import { proxy } from "@/proxy";
import { buildSessionToken } from "./support/session-fixtures";

const SECRET = "test-secret-that-is-at-least-32-chars!!";

vi.mock("next/headers", () => ({ cookies: async () => ({ set: vi.fn(), get: vi.fn(), delete: vi.fn() }) }));
vi.mock("@/lib/env", () => ({
  getServerEnv: () => ({
    SESSION_SECRET: "test-secret-that-is-at-least-32-chars!!",
    NEST_API_URL: "http://localhost:3001",
  }),
}));

async function request(path: string, cookie?: string) {
  const headers = cookie ? { cookie: `${SESSION_COOKIE}=${cookie}` } : undefined;
  return proxy(new NextRequest(`http://localhost:3000${path}`, { headers }));
}

const location = (response: Response) => new URL(response.headers.get("location") ?? "", "http://localhost:3000");
const passesThrough = (response: Response) => response.headers.get("x-middleware-next") === "1";

describe("proxy", () => {
  it("sends a visitor to the login page and remembers the destination", async () => {
    const response = await request("/orders");

    expect(response.status).toBe(307);
    expect(location(response).pathname).toBe("/login");
    expect(location(response).searchParams.get("next")).toBe("/orders");
  });

  it("lets a visitor open the login page", async () => {
    expect(passesThrough(await request("/login"))).toBe(true);
  });

  it("lets a signed-in user through", async () => {
    const token = await buildSessionToken(SECRET);

    expect(passesThrough(await request("/orders", token))).toBe(true);
  });

  it("sends a signed-in user away from the login page", async () => {
    const token = await buildSessionToken(SECRET);

    const response = await request("/login", token);

    expect(response.status).toBe(307);
    expect(location(response).pathname).toBe("/dashboard");
  });

  it("treats a forged cookie like no cookie", async () => {
    const response = await request("/orders", "forged.token.value");

    expect(location(response).pathname).toBe("/login");
  });

  it("treats an expired session like no session", async () => {
    const issuedLongAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const expired = await buildSessionToken(SECRET, { issuedAt: issuedLongAgo, expiresAt: issuedLongAgo });

    const response = await request("/orders", expired);

    expect(location(response).pathname).toBe("/login");
  });
});
