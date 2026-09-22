// @vitest-environment node
import { SignJWT } from "jose";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  createSession,
  decryptSession,
  deleteSession,
  encryptSession,
  getSession,
} from "@/features/auth/server/session";

const SECRET = "test-secret-that-is-at-least-32-chars!!";
const cookieStore = vi.hoisted(() => ({ set: vi.fn(), delete: vi.fn(), get: vi.fn() }));

vi.mock("next/headers", () => ({ cookies: async () => cookieStore }));
vi.mock("@/lib/env", () => ({
  getServerEnv: () => ({
    SESSION_SECRET: "test-secret-that-is-at-least-32-chars!!",
    DEMO_LOGIN_USER: "demo",
    DEMO_LOGIN_PASSWORD: "pw",
  }),
}));

beforeEach(() => {
  cookieStore.set.mockClear();
  cookieStore.delete.mockClear();
  cookieStore.get.mockReset();
});
afterEach(() => vi.unstubAllEnvs());

const HOURS = 60 * 60 * 1000;

describe("encryptSession / decryptSession", () => {
  it("round-trips the username", async () => {
    const token = await encryptSession({ username: "demo" }, SECRET);

    expect(await decryptSession(token, SECRET)).toEqual({ username: "demo" });
  });

  it.each([undefined, "", "not.a.jwt"])("rejects %j", async (token) => {
    expect(await decryptSession(token, SECRET)).toBeNull();
  });

  it("rejects a token whose payload was tampered with", async () => {
    const token = await encryptSession({ username: "demo" }, SECRET);
    const [header, , signature] = token.split(".");
    const forgedPayload = Buffer.from(JSON.stringify({ username: "admin" })).toString("base64url");

    expect(await decryptSession(`${header}.${forgedPayload}.${signature}`, SECRET)).toBeNull();
  });

  it("rejects a token signed with another secret", async () => {
    const token = await encryptSession({ username: "demo" }, "another-secret-that-is-32-chars-long!!");

    expect(await decryptSession(token, SECRET)).toBeNull();
  });

  it("rejects an expired token", async () => {
    const issuedLongAgo = new Date(Date.now() - (SESSION_TTL_SECONDS / 3600 + 1) * HOURS);
    const token = await encryptSession({ username: "demo" }, SECRET, issuedLongAgo);

    expect(await decryptSession(token, SECRET)).toBeNull();
  });

  it("rejects a token signed with a different algorithm", async () => {
    const token = await new SignJWT({ username: "demo" })
      .setProtectedHeader({ alg: "HS512" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(SECRET));

    expect(await decryptSession(token, SECRET)).toBeNull();
  });

  it("rejects a valid signature whose payload has no username", async () => {
    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(SECRET));

    expect(await decryptSession(token, SECRET)).toBeNull();
  });
});

describe("createSession", () => {
  it("stores a signed token in an httpOnly, same-site cookie that expires with the session", async () => {
    const before = Date.now();

    await createSession("demo");

    expect(cookieStore.set).toHaveBeenCalledOnce();
    const [name, token, options] = cookieStore.set.mock.calls[0] as [string, string, Record<string, unknown>];
    expect(name).toBe(SESSION_COOKIE);
    expect(await decryptSession(token, SECRET)).toEqual({ username: "demo" });
    expect(options).toMatchObject({ httpOnly: true, sameSite: "lax", path: "/" });
    const expires = (options.expires as Date).getTime();
    expect(expires).toBeGreaterThanOrEqual(before + SESSION_TTL_SECONDS * 1000 - 1000);
    expect(expires).toBeLessThanOrEqual(Date.now() + SESSION_TTL_SECONDS * 1000 + 1000);
  });

  it("marks the cookie secure in production only", async () => {
    await createSession("demo");
    expect(cookieStore.set.mock.calls[0]?.[2]).toMatchObject({ secure: false });

    cookieStore.set.mockClear();
    vi.stubEnv("NODE_ENV", "production");
    await createSession("demo");
    expect(cookieStore.set.mock.calls[0]?.[2]).toMatchObject({ secure: true });
  });
});

describe("deleteSession", () => {
  it("removes the session cookie", async () => {
    await deleteSession();

    expect(cookieStore.delete).toHaveBeenCalledWith(SESSION_COOKIE);
  });
});

describe("getSession", () => {
  it("returns the signed-in user from a valid cookie", async () => {
    cookieStore.get.mockReturnValue({ value: await encryptSession({ username: "demo" }, SECRET) });

    expect(await getSession()).toEqual({ username: "demo" });
  });

  it("returns null without a cookie", async () => {
    cookieStore.get.mockReturnValue(undefined);

    expect(await getSession()).toBeNull();
  });

  it("returns null for a cookie that does not verify", async () => {
    cookieStore.get.mockReturnValue({ value: "garbage" });

    expect(await getSession()).toBeNull();
  });
});
