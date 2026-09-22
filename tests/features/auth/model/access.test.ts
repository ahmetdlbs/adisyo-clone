import { describe, expect, it } from "vitest";
import { decideAccess, safeRedirectPath } from "@/features/auth/model/access";

describe("decideAccess", () => {
  it("sends a visitor without a session to the login page, remembering where they were going", () => {
    expect(decideAccess("/orders", false)).toEqual({ action: "redirect", to: "/login?next=%2Forders" });
    expect(decideAccess("/kitchen-detail/98012", false)).toEqual({
      action: "redirect",
      to: "/login?next=%2Fkitchen-detail%2F98012",
    });
  });

  it("does not bother remembering the bare root", () => {
    expect(decideAccess("/", false)).toEqual({ action: "redirect", to: "/login" });
  });

  it.each(["/login", "/register", "/forgot-password", "/onboarding"])("lets a visitor open %s", (path) => {
    expect(decideAccess(path, false)).toEqual({ action: "allow" });
  });

  it("lets a signed-in user through to the app", () => {
    expect(decideAccess("/orders", true)).toEqual({ action: "allow" });
    expect(decideAccess("/dashboard", true)).toEqual({ action: "allow" });
  });

  it.each(["/login", "/register", "/forgot-password"])(
    "sends a signed-in user away from %s to the dashboard",
    (path) => {
      expect(decideAccess(path, true)).toEqual({ action: "redirect", to: "/dashboard" });
    }
  );

  it("still lets a signed-in user finish onboarding", () => {
    expect(decideAccess("/onboarding", true)).toEqual({ action: "allow" });
  });
});

describe("safeRedirectPath", () => {
  it("keeps a same-site path, including its query", () => {
    expect(safeRedirectPath("/orders")).toBe("/orders");
    expect(safeRedirectPath("/reports?range=week")).toBe("/reports?range=week");
  });

  it.each([
    ["a protocol-relative URL", "//evil.com"],
    ["an absolute URL", "https://evil.com/x"],
    ["a backslash trick", "/\\evil.com"],
    ["a protocol-relative URL hidden behind a tab (browsers strip it)", "/\t/evil.com"],
    ["a scheme without slashes", "javascript:alert(1)"],
    ["a relative path", "orders"],
    ["an empty string", ""],
  ])("falls back for %s", (_label, value) => {
    expect(safeRedirectPath(value)).toBe("/dashboard");
  });

  it("falls back when there is nothing, or several values", () => {
    expect(safeRedirectPath(undefined)).toBe("/dashboard");
    expect(safeRedirectPath(null)).toBe("/dashboard");
    expect(safeRedirectPath(["/orders", "/users"])).toBe("/dashboard");
  });

  it("never bounces back into a guest-only page", () => {
    expect(safeRedirectPath("/login")).toBe("/dashboard");
    expect(safeRedirectPath("/register?x=1")).toBe("/dashboard");
  });
});
