import { describe, expect, it } from "vitest";
import { saveUser, USER_ROLES, userFormSchema, userSearchText, type User } from "@/features/users/model/user";

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

describe("saveUser", () => {
  it("adds a user with the next number and no login yet", () => {
    const result = saveUser([], values, () => "new-id");

    expect(result).toEqual([{ id: "new-id", no: 1, ...values, lastLogin: null }]);
  });

  it("numbers after the highest number in use", () => {
    const result = saveUser([{ ...AHMET, no: 5 }], values, () => "new-id");

    expect(result.at(-1)?.no).toBe(6);
  });

  it("refuses a phone number that another user already has", () => {
    expect(() => saveUser([AHMET], { ...values, phone: "0532 111 22 33" }, () => "id")).toThrow("Bu telefon numarası başka bir kullanıcıda kayıtlı");
  });

  it("does not modify the list it is given", () => {
    const list = [AHMET];

    saveUser(list, values, () => "id");

    expect(list).toEqual([AHMET]);
  });
});

describe("userSearchText", () => {
  it("covers the name, e-mail and phone", () => {
    expect(userSearchText(AHMET)).toContain("Ahmet Can");
    expect(userSearchText(AHMET)).toContain("ahmet@example.com");
    expect(userSearchText(AHMET)).toContain("0532 111 22 33");
  });
});
