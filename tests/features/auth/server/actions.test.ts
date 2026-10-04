// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api-client";
import { loginAction, logoutAction, registerAction } from "@/features/auth/server/actions";

const mocks = vi.hoisted(() => ({
  createSession: vi.fn(),
  deleteSession: vi.fn(),
  verifyCredentials: vi.fn(),
  registerRestaurant: vi.fn(),
  // Next's redirect() throws to unwind the action; the mock does the same so code after it cannot run.
  redirect: vi.fn((to: string) => {
    throw new Error(`NEXT_REDIRECT:${to}`);
  }),
}));

vi.mock("@/features/auth/server/session", () => ({ createSession: mocks.createSession, deleteSession: mocks.deleteSession }));
vi.mock("@/features/auth/server/credentials", () => ({ verifyCredentials: mocks.verifyCredentials, registerRestaurant: mocks.registerRestaurant }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

const LOGIN_RESULT = {
  token: "signed.jwt.token",
  user: { id: "u1", tenantId: "t1", role: "OWNER", name: "Ahmet Demo", email: "demo@adisyonmerkezi.com" },
};

beforeEach(() => {
  mocks.createSession.mockClear();
  mocks.deleteSession.mockClear();
  mocks.verifyCredentials.mockReset();
  mocks.registerRestaurant.mockReset();
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
    expect(mocks.verifyCredentials).not.toHaveBeenCalled();
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
    mocks.verifyCredentials.mockResolvedValue(null);

    const state = await loginAction({}, form({ username: "demo", password: "nope" }));

    expect(state.username).toBe("demo");
  });

  it("rejects wrong credentials with one generic message", async () => {
    mocks.verifyCredentials.mockResolvedValue(null);

    const state = await loginAction({}, form({ username: "demo", password: "nope" }));

    expect(state.message).toBe("Kullanıcı adı veya şifre hatalı.");
    expect(mocks.createSession).not.toHaveBeenCalled();
  });

  it("does not reveal whether the username or the password was wrong", async () => {
    mocks.verifyCredentials.mockResolvedValue(null);

    const wrongUser = await loginAction({}, form({ username: "nobody", password: "correct-horse" }));
    const wrongPassword = await loginAction({}, form({ username: "demo", password: "nope" }));

    expect(wrongUser.message).toBe(wrongPassword.message);
  });

  it("shows a connection message, not a crash, when api/ is unreachable", async () => {
    mocks.verifyCredentials.mockRejectedValue(new TypeError("fetch failed"));

    const state = await loginAction({}, form({ username: "demo", password: "correct-horse" }));

    expect(state.message).toBe("Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.");
    expect(mocks.createSession).not.toHaveBeenCalled();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("starts a session and lands on the dashboard after a correct login", async () => {
    mocks.verifyCredentials.mockResolvedValue(LOGIN_RESULT);

    await expect(loginAction({}, form({ username: "demo", password: "correct-horse" }))).rejects.toThrow(
      "NEXT_REDIRECT:/dashboard"
    );

    expect(mocks.createSession).toHaveBeenCalledExactlyOnceWith(LOGIN_RESULT.token);
  });

  it("returns the user to the page they were heading for", async () => {
    mocks.verifyCredentials.mockResolvedValue(LOGIN_RESULT);

    await expect(
      loginAction({}, form({ username: "demo", password: "correct-horse", next: "/orders" }))
    ).rejects.toThrow("NEXT_REDIRECT:/orders");
  });

  it("ignores an off-site destination", async () => {
    mocks.verifyCredentials.mockResolvedValue(LOGIN_RESULT);

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

describe("registerAction", () => {
  const VALID = {
    restaurantName: "Lezzet Durağı",
    fullName: "Ahmet Yılmaz",
    email: "ahmet@lezzet.test",
    countryCode: "+90" as const,
    phone: "532 111 22 33",
    password: "Sifre1234",
    passwordConfirm: "Sifre1234",
    acceptedTerms: true,
  };

  it("creates the restaurant and signs the owner in", async () => {
    mocks.registerRestaurant.mockResolvedValue(LOGIN_RESULT);

    expect(await registerAction(VALID)).toEqual({ ok: true });
    expect(mocks.createSession).toHaveBeenCalledWith("signed.jwt.token");
  });

  it("re-checks the form's rules on the server and never reaches api/ with a bad sign-up", async () => {
    const result = await registerAction({ ...VALID, passwordConfirm: "Baska1234" });

    expect(result).toEqual({ ok: false, message: "Şifreler eşleşmiyor" });
    expect(mocks.registerRestaurant).not.toHaveBeenCalled();
    expect(mocks.createSession).not.toHaveBeenCalled();
  });

  it("puts a taken e-mail on the e-mail field", async () => {
    mocks.registerRestaurant.mockRejectedValue(new ApiError("Bu e-posta ile kayıtlı bir hesap var", 409));

    expect(await registerAction(VALID)).toMatchObject({ ok: false, field: "email" });
    expect(mocks.createSession).not.toHaveBeenCalled();
  });

  it("explains a rate limit and an outage differently", async () => {
    mocks.registerRestaurant.mockRejectedValueOnce(new ApiError("x", 429));
    expect(await registerAction(VALID)).toMatchObject({ ok: false, message: expect.stringContaining("Çok fazla deneme") });

    mocks.registerRestaurant.mockRejectedValueOnce(new Error("down"));
    expect(await registerAction(VALID)).toMatchObject({ ok: false, message: expect.stringContaining("Kayıt tamamlanamadı") });
  });
});
