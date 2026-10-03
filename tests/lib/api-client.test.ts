// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiFetch } from "@/lib/api-client";

const mocks = vi.hoisted(() => ({ getSessionToken: vi.fn() }));
vi.mock("@/features/auth/server/session", () => ({ getSessionToken: mocks.getSessionToken }));
vi.mock("@/lib/env", () => ({ getServerEnv: () => ({ SESSION_SECRET: "x".repeat(32), NEST_API_URL: "http://localhost:3001" }) }));

const originalFetch = global.fetch;

beforeEach(() => {
  mocks.getSessionToken.mockReset().mockResolvedValue(undefined);
  global.fetch = vi.fn();
});
afterEach(() => {
  global.fetch = originalFetch;
});

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

describe("apiFetch", () => {
  it("calls the given path under NEST_API_URL and returns the parsed JSON body", async () => {
    vi.mocked(global.fetch).mockResolvedValue(jsonResponse(200, { hello: "world" }));

    const result = await apiFetch<{ hello: string }>("/apps-catalog");

    expect(result).toEqual({ hello: "world" });
    const [url] = vi.mocked(global.fetch).mock.calls[0] as [string, RequestInit];
    expect(url).toBe("http://localhost:3001/apps-catalog");
  });

  it("forwards the session token as a Bearer header when one exists", async () => {
    mocks.getSessionToken.mockResolvedValue("the-session-token");
    vi.mocked(global.fetch).mockResolvedValue(jsonResponse(200, {}));

    await apiFetch("/billing/entitlements");

    const [, init] = vi.mocked(global.fetch).mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer the-session-token");
  });

  it("sends no Authorization header when there is no session (e.g. logging in)", async () => {
    vi.mocked(global.fetch).mockResolvedValue(jsonResponse(200, { token: "t" }));

    await apiFetch("/auth/login");

    const [, init] = vi.mocked(global.fetch).mock.calls[0] as [string, RequestInit];
    expect(init.headers as Record<string, string>).not.toHaveProperty("Authorization");
  });

  it("JSON-encodes the body and sets the content type", async () => {
    vi.mocked(global.fetch).mockResolvedValue(jsonResponse(201, {}));

    await apiFetch("/billing/checkout", { method: "POST", body: { appIds: ["a1"], period: "MONTHLY" } });

    const [, init] = vi.mocked(global.fetch).mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ appIds: ["a1"], period: "MONTHLY" }));
    expect((init.headers as Record<string, string>)["Content-Type"]).toBe("application/json");
  });

  it("returns undefined for a 204 No Content response", async () => {
    vi.mocked(global.fetch).mockResolvedValue(new Response(null, { status: 204 }));

    expect(await apiFetch("/integrations/yemeksepeti/connect", { method: "POST" })).toBeUndefined();
  });

  it("throws an ApiError carrying the status and the server's own message", async () => {
    vi.mocked(global.fetch).mockResolvedValue(jsonResponse(401, { message: "E-posta veya şifre hatalı" }));

    const error = await apiFetch("/auth/login").catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(401);
    expect((error as ApiError).message).toBe("E-posta veya şifre hatalı");
  });

  it("falls back to a generic message when the error body is not JSON", async () => {
    vi.mocked(global.fetch).mockResolvedValue(new Response("not json", { status: 500 }));

    const error = await apiFetch("/apps-catalog").catch((caught: unknown) => caught);

    expect((error as ApiError).message).toBe("Sunucu ile iletişim kurulamadı");
  });
});
