import { describe, expect, it } from "vitest";
import { loginSchema } from "@/features/auth/model/login";

function messages(input: unknown): string[] {
  const result = loginSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

describe("loginSchema", () => {
  it("accepts credentials and trims only the username", () => {
    expect(loginSchema.parse({ username: "  demo  ", password: " pw " })).toEqual({
      username: "demo",
      password: " pw ",
    });
  });

  it("requires a username", () => {
    expect(messages({ username: "   ", password: "pw" })).toEqual(["Boş geçilemez"]);
  });

  it("requires a password", () => {
    expect(messages({ username: "demo", password: "" })).toEqual(["Lütfen şifrenizi giriniz"]);
  });

  it("reports both when FormData had neither field (get() returns null)", () => {
    expect(messages({ username: null, password: null }).sort()).toEqual(
      ["Boş geçilemez", "Lütfen şifrenizi giriniz"].sort()
    );
  });
});
