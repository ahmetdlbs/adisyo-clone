import { describe, expect, it } from "vitest";
import { profileFormSchema } from "@/features/profile/model/profile";

const values = { firstName: "Ahmet", lastName: "Can", phone: "0544 307 11 60", email: "ahmet@isletme.local", pin: "" };

describe("profileFormSchema", () => {
  it("accepts a filled-in profile", () => {
    expect(profileFormSchema.safeParse(values).success).toBe(true);
  });

  it("needs a first and last name", () => {
    expect(profileFormSchema.safeParse({ ...values, firstName: " " }).error?.issues[0]?.message).toBe("İsim zorunludur");
    expect(profileFormSchema.safeParse({ ...values, lastName: " " }).error?.issues[0]?.message).toBe("Soyisim zorunludur");
  });

  it("needs a valid phone and e-mail", () => {
    expect(profileFormSchema.safeParse({ ...values, phone: "abc" }).error?.issues[0]?.message).toBe("Geçerli bir telefon numarası giriniz");
    expect(profileFormSchema.safeParse({ ...values, email: "abc" }).error?.issues[0]?.message).toBe("Geçerli bir e-posta giriniz");
  });

  it("lets the pin be empty", () => {
    expect(profileFormSchema.safeParse({ ...values, pin: "" }).success).toBe(true);
  });

  it("rejects a pin that starts with 0 or is not all digits", () => {
    expect(profileFormSchema.safeParse({ ...values, pin: "0123" }).error?.issues[0]?.message).toBe("Pin 0 ile başlayamaz");
    expect(profileFormSchema.safeParse({ ...values, pin: "12a4" }).error?.issues[0]?.message).toBe("Pin yalnızca rakam olmalıdır");
  });

  it("accepts a valid pin", () => {
    expect(profileFormSchema.safeParse({ ...values, pin: "1234" }).success).toBe(true);
  });
});
