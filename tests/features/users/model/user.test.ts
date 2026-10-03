import { describe, expect, it } from "vitest";
import { USER_ROLES, userFormSchema, userSearchText, type User } from "@/features/users/model/user";

const AHMET: User = {
  id: "u1",
  no: 1,
  name: "Ahmet Can",
  email: "ahmet@example.com",
  phone: "0532 111 22 33",
  role: "Yönetici",
  region: "",
  callerId: false,
  blockLogin: false,
  usePin: false,
  lastLogin: null,
};

const values = {
  role: USER_ROLES[0],
  name: "Zeynep Aksoy",
  email: "",
  phone: "0533 444 55 66",
  password: "gizli123",
  region: "",
  callerId: false,
  blockLogin: false,
  usePin: false,
};

describe("userFormSchema", () => {
  it("needs a name, phone and password", () => {
    expect(userFormSchema.safeParse({ ...values, name: " " }).error?.issues[0]?.message).toBe("Ad Soyad zorunludur");
    expect(userFormSchema.safeParse({ ...values, phone: "" }).error?.issues[0]?.message).toBe("Telefon numarası zorunludur");
    expect(userFormSchema.safeParse({ ...values, password: "12" }).error?.issues[0]?.message).toBe("Şifre en az 4 karakter olmalıdır");
  });

  it("does not need an e-mail, but checks its format when given", () => {
    expect(userFormSchema.safeParse({ ...values, email: "" }).success).toBe(true);
    expect(userFormSchema.safeParse({ ...values, email: "not-an-email" }).error?.issues[0]?.message).toBe("Geçerli bir e-posta giriniz");
    expect(userFormSchema.safeParse({ ...values, email: "zeynep@example.com" }).success).toBe(true);
  });

  it("rejects a phone number that is not valid", () => {
    expect(userFormSchema.safeParse({ ...values, phone: "abc" }).error?.issues[0]?.message).toBe("Geçerli bir telefon numarası giriniz");
  });
});

describe("userSearchText", () => {
  it("covers the name, e-mail and phone", () => {
    expect(userSearchText(AHMET)).toContain("Ahmet Can");
    expect(userSearchText(AHMET)).toContain("ahmet@example.com");
    expect(userSearchText(AHMET)).toContain("0532 111 22 33");
  });
});
