// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { createStaffMember, listStaff, saveGrants } from "@/features/users/server/actions";

const mocks = vi.hoisted(() => ({ apiFetch: vi.fn(), revalidatePath: vi.fn() }));
vi.mock("@/lib/api-client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api-client")>();
  return { ...actual, apiFetch: mocks.apiFetch };
});
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

const API_STAFF_MEMBER = {
  id: "s1",
  no: 1,
  name: "Ahmet Can",
  email: "",
  phone: "0532 000 00 00",
  role: "WAITER" as const,
  region: "",
  callerId: false,
  blockLogin: false,
  usePin: false,
  lastLogin: null,
};

describe("listStaff", () => {
  it("fetches /staff and translates the English role into its Turkish label", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue([API_STAFF_MEMBER]);

    const result = await listStaff();

    expect(mocks.apiFetch).toHaveBeenCalledWith("/staff");
    expect(result).toEqual([{ ...API_STAFF_MEMBER, role: "Garson" }]);
  });
});

describe("createStaffMember", () => {
  const values = {
    role: "Garson" as const,
    name: "Ahmet Can",
    email: "",
    phone: "0532 000 00 00",
    password: "demo1234",
    region: "",
    callerId: false,
    blockLogin: false,
    usePin: false,
  };

  it("posts to /staff with the Turkish role translated to the API's enum, and revalidates", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue(API_STAFF_MEMBER);
    mocks.revalidatePath.mockClear();

    const result = await createStaffMember(values);

    expect(mocks.apiFetch).toHaveBeenCalledWith("/staff", { method: "POST", body: { ...values, role: "WAITER" } });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/users");
    expect(result.role).toBe("Garson");
  });

  it("throws the API's own message when the phone number is taken", async () => {
    const { ApiError } = await import("@/lib/api-client");
    mocks.apiFetch.mockReset().mockRejectedValue(new ApiError("Bu telefon numarası başka bir kullanıcıda kayıtlı", 409));

    await expect(createStaffMember(values)).rejects.toThrow("Bu telefon numarası başka bir kullanıcıda kayıtlı");
  });

  it("falls back to a generic message for a non-ApiError failure", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new TypeError("fetch failed"));

    await expect(createStaffMember(values)).rejects.toThrow("Kullanıcı eklenemedi");
  });
});

describe("saveGrants", () => {
  it("puts the whole grid to /rights and revalidates the rights page", async () => {
    const grants = { table_area: { Garson: true } };
    mocks.apiFetch.mockReset().mockResolvedValue(grants);
    mocks.revalidatePath.mockClear();

    const result = await saveGrants(grants);

    expect(mocks.apiFetch).toHaveBeenCalledWith("/rights", { method: "PUT", body: { grants } });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/rights");
    expect(result).toEqual(grants);
  });

  it("throws a generic message on failure", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new TypeError("fetch failed"));

    await expect(saveGrants({})).rejects.toThrow("Yetkiler kaydedilemedi");
  });
});
