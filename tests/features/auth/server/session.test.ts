// @vitest-environment node
import { SignJWT } from "jose";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  createSession,
  decryptSession,
  deleteSession,
  getSession,
  getSessionToken,
} from "@/features/auth/server/session";
import { buildSessionToken } from "../../../support/session-fixtures";

const SECRET = "test-secret-that-is-at-least-32-chars!!";
const PAYLOAD = { userId: "user-1", tenantId: "tenant-1", role: "OWNER" as const, name: "Ahmet Demo", email: "demo@adisyonmerkezi.com" };
const cookieStore = vi.hoisted(() => ({ set: vi.fn(), delete: vi.fn(), get: vi.fn() }));

vi.mock("next/headers", () => ({ cookies: async () => cookieStore }));
vi.mock("@/lib/env", () => ({
  getServerEnv: () => ({
    SESSION_SECRET: "test-secret-that-is-at-least-32-chars!!",
    NEST_API_URL: "http://localhost:3001",
  }),
}));

beforeEach(() => {
  cookieStore.set.mockClear();
  cookieStore.delete.mockClear();
  cookieStore.get.mockReset();
});
afterEach(() => vi.unstubAllEnvs());

describe("decryptSession", () => {
  it("round-trips the token payload", async () => {
    const token = await buildSessionToken(SECRET, PAYLOAD);

    expect(await decryptSession(token, SECRET)).toEqual(PAYLOAD);
  });

  it.each([undefined, "", "not.a.jwt"])("rejects %j", async (token) => {
    expect(await decryptSession(token, SECRET)).toBeNull();
  });

  it("rejects a token whose payload was tampered with", async () => {
    const token = await buildSessionToken(SECRET, PAYLOAD);
    const [header, , signature] = token.split(".");
    const forgedPayload = Buffer.from(JSON.stringify({ ...PAYLOAD, role: "PLATFORM_ADMIN" })).toString("base64url");

    expect(await decryptSession(`${header}.${forgedPayload}.${signature}`, SECRET)).toBeNull();
  });

  it("rejects a token signed with another secret", async () => {
    const token = await buildSessionToken("another-secret-that-is-32-chars-long!!", PAYLOAD);

    expect(await decryptSession(token, SECRET)).toBeNull();
  });

  it("rejects an expired token", async () => {
    const issuedLongAgo = new Date(Date.now() - (SESSION_TTL_SECONDS + 3600) * 1000);
    const token = await buildSessionToken(SECRET, { ...PAYLOAD, issuedAt: issuedLongAgo, expiresAt: issuedLongAgo });

    expect(await decryptSession(token, SECRET)).toBeNull();
  });

  it("rejects a token signed with a different algorithm", async () => {
    const token = await new SignJWT({ ...PAYLOAD })
      .setProtectedHeader({ alg: "HS512" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(SECRET));

    expect(await decryptSession(token, SECRET)).toBeNull();
  });

  it("rejects a valid signature whose payload has no subject (userId)", async () => {
    const claims = { tenantId: PAYLOAD.tenantId, role: PAYLOAD.role, name: PAYLOAD.name, email: PAYLOAD.email };
    const token = await new SignJWT(claims).setProtectedHeader({ alg: "HS256" }).setExpirationTime("1h").sign(new TextEncoder().encode(SECRET));

    expect(await decryptSession(token, SECRET)).toBeNull();
  });

  it("rejects a role outside the known set", async () => {
    const token = await new SignJWT({ ...PAYLOAD, role: "SUPERUSER" })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(PAYLOAD.userId)
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(SECRET));

    expect(await decryptSession(token, SECRET)).toBeNull();
  });
});

describe("createSession", () => {
  it("stores the given token in an httpOnly, same-site cookie that expires with the session", async () => {
    await createSession("the-token-from-the-nest-api");

    expect(cookieStore.set).toHaveBeenCalledOnce();
    const [name, token, options] = cookieStore.set.mock.calls[0] as [string, string, Record<string, unknown>];
    expect(name).toBe(SESSION_COOKIE);
    expect(token).toBe("the-token-from-the-nest-api");
    expect(options).toMatchObject({ httpOnly: true, sameSite: "lax", path: "/", maxAge: SESSION_TTL_SECONDS });
  });

  it("marks the cookie secure in production only", async () => {
    await createSession("t");
    expect(cookieStore.set.mock.calls[0]?.[2]).toMatchObject({ secure: false });

    cookieStore.set.mockClear();
    vi.stubEnv("NODE_ENV", "production");
    await createSession("t");
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
    cookieStore.get.mockReturnValue({ value: await buildSessionToken(SECRET, PAYLOAD) });

    expect(await getSession()).toEqual(PAYLOAD);
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

describe("getSessionToken", () => {
  it("returns the raw cookie value", async () => {
    cookieStore.get.mockReturnValue({ value: "raw-token-value" });

    expect(await getSessionToken()).toBe("raw-token-value");
  });

  it("returns undefined without a cookie", async () => {
    cookieStore.get.mockReturnValue(undefined);

    expect(await getSessionToken()).toBeUndefined();
  });
});
