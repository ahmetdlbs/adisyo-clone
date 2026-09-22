// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { loginAction, logoutAction } from "@/features/auth/server/actions";

const mocks = vi.hoisted(() => ({
  createSession: vi.fn(),
  deleteSession: vi.fn(),
  // Next's redirect() throws to unwind the action; the mock does the same so code after it cannot run.
  redirect: vi.fn((to: string) => {
    throw new Error(`NEXT_REDIRECT:${to}`);
  }),
}));

vi.mock("@/features/auth/server/session", () => ({ createSession: mocks.createSession, deleteSession: mocks.deleteSession }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/env", () => ({
  getServerEnv: () => ({
    SESSION_SECRET: "x".repeat(32),
    DEMO_LOGIN_USER: "demo",
    DEMO_LOGIN_PASSWORD: "correct-horse",
  }),
}));

beforeEach(() => {
  mocks.createSession.mockClear();
  mocks.deleteSession.mockClear();
  mocks.redirect.mockClear();
});

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
}

describe("loginAction", () => {
  it("returns a message per empty field without touching the session", async () => {
    const state = await loginAction({}, form({ username: "", password: "" }));

    expect(state.fieldErrors).toEqual({ username: "Boş geçilemez", password: "Lütfen şifrenizi giriniz" });
    expect(mocks.createSession).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("keeps what was typed as username but never echoes a typed password back", async () => {
    const state = await loginAction({}, form({ username: "", password: "s3cret-value" }));

    expect(state.username).toBe("");
    expect(state).not.toHaveProperty("password");
    expect(JSON.stringify(state)).not.toContain("s3cret-value");
  });

  it("refills the username after a failed attempt", async () => {
    const state = await loginAction({}, form({ username: "demo", password: "nope" }));

    expect(state.username).toBe("demo");
  });

  it("rejects wrong credentials with one generic message", async () => {
    const state = await loginAction({}, form({ username: "demo", password: "nope" }));

    expect(state.message).toBe("Kullanıcı adı veya şifre hatalı.");
    expect(mocks.createSession).not.toHaveBeenCalled();
  });

  it("does not reveal whether the username or the password was wrong", async () => {
    const wrongUser = await loginAction({}, form({ username: "nobody", password: "correct-horse" }));
    const wrongPassword = await loginAction({}, form({ username: "demo", password: "nope" }));

    expect(wrongUser.message).toBe(wrongPassword.message);
  });

  it("starts a session and lands on the dashboard after a correct login", async () => {
    await expect(loginAction({}, form({ username: "demo", password: "correct-horse" }))).rejects.toThrow(
      "NEXT_REDIRECT:/dashboard"
    );

    expect(mocks.createSession).toHaveBeenCalledExactlyOnceWith("demo");
  });

  it("returns the user to the page they were heading for", async () => {
    await expect(
      loginAction({}, form({ username: "demo", password: "correct-horse", next: "/orders" }))
    ).rejects.toThrow("NEXT_REDIRECT:/orders");
  });

  it("ignores an off-site destination", async () => {
    await expect(
      loginAction({}, form({ username: "demo", password: "correct-horse", next: "//evil.com" }))
    ).rejects.toThrow("NEXT_REDIRECT:/dashboard");
  });
});

describe("logoutAction", () => {
  it("ends the session and goes to the login page", async () => {
    await expect(logoutAction()).rejects.toThrow("NEXT_REDIRECT:/login");

    expect(mocks.deleteSession).toHaveBeenCalledOnce();
  });
});
