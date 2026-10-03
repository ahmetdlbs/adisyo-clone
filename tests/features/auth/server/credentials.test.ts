// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { verifyCredentials } from "@/features/auth/server/credentials";
import { ApiError } from "@/lib/api-client";

const mocks = vi.hoisted(() => ({ apiFetch: vi.fn() }));
vi.mock("@/lib/api-client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api-client")>();
  return { ...actual, apiFetch: mocks.apiFetch };
});

const LOGIN_RESULT = {
  token: "signed.jwt.token",
  user: { id: "u1", tenantId: "t1", role: "OWNER", name: "Ahmet Demo", email: "demo@adisyonmerkezi.com" },
};

// Reset happens inline per test (not in a shared beforeEach): with this module-mock setup, resetting the
// mock from a `beforeEach` hook confuses Vitest's per-test unhandled-rejection attribution and makes an
// otherwise-caught rejection fail the wrong assertion. Resetting first thing in each test body sidesteps it.
describe("verifyCredentials", () => {
  it("posts the username as email to api/'s /auth/login and returns its result on success", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue(LOGIN_RESULT);

    const result = await verifyCredentials({ username: "demo@adisyonmerkezi.com", password: "demo1234" });

    expect(result).toEqual(LOGIN_RESULT);
    expect(mocks.apiFetch).toHaveBeenCalledWith("/auth/login", {
      method: "POST",
      body: { email: "demo@adisyonmerkezi.com", password: "demo1234" },
    });
  });

  it("returns null when api/ answers 401 (wrong email or password)", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new ApiError("E-posta veya şifre hatalı", 401));

    expect(await verifyCredentials({ username: "demo@adisyonmerkezi.com", password: "wrong" })).toBeNull();
  });

  it("rethrows a non-401 failure instead of treating it as wrong credentials", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new ApiError("Sunucu ile iletişim kurulamadı", 503));

    await expect(verifyCredentials({ username: "demo@adisyonmerkezi.com", password: "demo1234" })).rejects.toThrow(
      ApiError
    );
  });

  it("rethrows a non-ApiError failure (e.g. api/ unreachable) as-is", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new TypeError("fetch failed"));

    await expect(verifyCredentials({ username: "demo@adisyonmerkezi.com", password: "demo1234" })).rejects.toThrow(
      TypeError
    );
  });
});
