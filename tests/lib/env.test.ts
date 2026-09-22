// @vitest-environment node
import { describe, expect, it } from "vitest";
import { parseServerEnv } from "@/lib/env";

const VALID = {
  SESSION_SECRET: "a-secret-that-is-at-least-32-characters-long",
  DEMO_LOGIN_USER: "demo",
  DEMO_LOGIN_PASSWORD: "hunter2-hunter2",
};

describe("parseServerEnv", () => {
  it("returns the typed values when everything is configured", () => {
    expect(parseServerEnv(VALID)).toEqual(VALID);
  });

  it("ignores unrelated variables", () => {
    expect(parseServerEnv({ ...VALID, PATH: "/usr/bin" })).toEqual(VALID);
  });

  it("names every missing variable in one error", () => {
    expect(() => parseServerEnv({})).toThrowError(/SESSION_SECRET/);
    expect(() => parseServerEnv({})).toThrowError(/DEMO_LOGIN_USER/);
    expect(() => parseServerEnv({})).toThrowError(/DEMO_LOGIN_PASSWORD/);
  });

  it("rejects a session secret that is too short to sign with", () => {
    expect(() => parseServerEnv({ ...VALID, SESSION_SECRET: "short" })).toThrowError(/SESSION_SECRET/);
  });

  it("never puts a configured value into the error message", () => {
    const secret = "too-short-but-secret";

    expect(() => parseServerEnv({ ...VALID, SESSION_SECRET: secret })).toThrowError(
      expect.objectContaining({ message: expect.not.stringContaining(secret) })
    );
  });
});
