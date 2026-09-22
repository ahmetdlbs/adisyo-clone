import { describe, expect, it } from "vitest";
import { forgotPasswordSchema, registerSchema } from "@/features/auth/model/register";

const VALID = {
  restaurantName: "Lezzet Durağı",
  fullName: "Ahmet Yılmaz",
  email: "ahmet@lezzet.test",
  countryCode: "+90",
  phone: "532 111 22 33",
  password: "Sifre1234",
  passwordConfirm: "Sifre1234",
  acceptedTerms: true,
};

function messages(overrides: Record<string, unknown>): string[] {
  const result = registerSchema.safeParse({ ...VALID, ...overrides });
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

describe("registerSchema", () => {
  it("accepts a complete registration and normalises the phone number to digits", () => {
    const result = registerSchema.parse(VALID);

    expect(result.phone).toBe("5321112233");
    expect(result.email).toBe("ahmet@lezzet.test");
  });

  it("requires a restaurant name of at least two characters", () => {
    expect(messages({ restaurantName: " a " })).toEqual(["Restoran adı en az 2 karakter olmalıdır"]);
  });

  it("wants both a first and a last name", () => {
    expect(messages({ fullName: "Ahmet" })).toEqual(["Lütfen ad ve soyadınızı giriniz"]);
  });

  it.each(["", "not-an-email", "a@b"])("rejects the e-mail %j", (email) => {
    expect(messages({ email })).toHaveLength(1);
  });

  it.each(["", "abc", "12", "1".repeat(16)])("rejects the phone number %j", (phone) => {
    expect(messages({ phone })).toEqual(["Geçerli bir telefon numarası giriniz"]);
  });

  it("accepts common phone formatting", () => {
    expect(registerSchema.safeParse({ ...VALID, phone: "(532) 111-22-33" }).success).toBe(true);
  });

  it("requires a password of at least 8 characters with a letter and a digit", () => {
    expect(messages({ password: "Ab1", passwordConfirm: "Ab1" })).toEqual(["Şifre en az 8 karakter olmalıdır"]);
    expect(messages({ password: "12345678", passwordConfirm: "12345678" })).toEqual([
      "Şifre en az bir harf içermelidir",
    ]);
    expect(messages({ password: "abcdefgh", passwordConfirm: "abcdefgh" })).toEqual([
      "Şifre en az bir rakam içermelidir",
    ]);
  });

  it("requires the confirmation to match", () => {
    expect(messages({ passwordConfirm: "Baska1234" })).toEqual(["Şifreler eşleşmiyor"]);
  });

  it("requires accepting the terms", () => {
    expect(messages({ acceptedTerms: false })).toEqual(["Devam etmek için sözleşmeyi kabul etmelisiniz"]);
  });

  it("only offers the supported country codes", () => {
    expect(messages({ countryCode: "+44" })).toHaveLength(1);
  });
});

describe("forgotPasswordSchema", () => {
  it("accepts an e-mail address and trims it", () => {
    expect(forgotPasswordSchema.parse({ email: "  ahmet@lezzet.test " })).toEqual({ email: "ahmet@lezzet.test" });
  });

  it("requires an e-mail address", () => {
    const result = forgotPasswordSchema.safeParse({ email: "" });

    expect(result.success ? [] : result.error.issues.map((issue) => issue.message)).toEqual(["E-posta zorunludur"]);
  });

  it("rejects something that is not an e-mail address", () => {
    const result = forgotPasswordSchema.safeParse({ email: "ahmet" });

    expect(result.success ? [] : result.error.issues.map((issue) => issue.message)).toEqual([
      "Geçerli bir e-posta adresi giriniz",
    ]);
  });
});
