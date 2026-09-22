// @vitest-environment node
import { describe, expect, it } from "vitest";
import { verifyCredentials } from "@/features/auth/server/credentials";

const EXPECTED = { DEMO_LOGIN_USER: "demo@adisyo.test", DEMO_LOGIN_PASSWORD: "correct horse battery staple" };

describe("verifyCredentials", () => {
  it("accepts the configured credentials", () => {
    expect(verifyCredentials({ username: "demo@adisyo.test", password: "correct horse battery staple" }, EXPECTED)).toBe(true);
  });

  it("rejects a wrong username", () => {
    expect(verifyCredentials({ username: "someone@else.test", password: "correct horse battery staple" }, EXPECTED)).toBe(false);
  });

  it("rejects a wrong password", () => {
    expect(verifyCredentials({ username: "demo@adisyo.test", password: "wrong" }, EXPECTED)).toBe(false);
  });

  it("rejects when both are wrong", () => {
    expect(verifyCredentials({ username: "a", password: "b" }, EXPECTED)).toBe(false);
  });

  it("is case-sensitive", () => {
    expect(verifyCredentials({ username: "DEMO@adisyo.test", password: "correct horse battery staple" }, EXPECTED)).toBe(false);
  });

  it("copes with inputs of a very different length without throwing", () => {
    expect(() => verifyCredentials({ username: "x".repeat(10_000), password: "" }, EXPECTED)).not.toThrow();
    expect(verifyCredentials({ username: "x".repeat(10_000), password: "" }, EXPECTED)).toBe(false);
  });
});
