import { describe, expect, it } from "vitest";
import { hasAnyApp } from "@/features/entitlements/model/app-keys";

describe("hasAnyApp", () => {
  const active = new Set(["a", "b"]);

  it("is true when any required app is active", () => {
    expect(hasAnyApp(active, ["x", "b"])).toBe(true);
  });

  it("is false when none is", () => {
    expect(hasAnyApp(active, ["x", "y"])).toBe(false);
  });

  it("is false for an empty requirement, so a screen never opens by accident", () => {
    expect(hasAnyApp(active, [])).toBe(false);
  });
});
