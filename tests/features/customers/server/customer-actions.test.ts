// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { createCustomer, deleteCustomer, updateCustomer } from "@/features/customers/server/customer-actions";
import { ApiError } from "@/lib/api-client";

const mocks = vi.hoisted(() => ({ apiFetch: vi.fn(), revalidatePath: vi.fn() }));
vi.mock("@/lib/api-client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api-client")>();
  return { ...actual, apiFetch: mocks.apiFetch };
});
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

const VALUES = { firstName: "Ahmet", lastName: "Can", phone: "0532 000 00 00", phone2: "", balance: 0 };

describe("createCustomer", () => {
  it("posts to /customers and revalidates the customers page", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue({ id: "c1", no: 1, ...VALUES });
    mocks.revalidatePath.mockClear();

    const result = await createCustomer(VALUES);

    expect(mocks.apiFetch).toHaveBeenCalledWith("/customers", { method: "POST", body: VALUES });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/restaurant-customers");
    expect(result).toEqual({ id: "c1", no: 1, ...VALUES });
  });

  it("throws the API's own message when the phone number is taken", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new ApiError("Bu telefon numarası başka bir müşteride kayıtlı", 409));

    await expect(createCustomer(VALUES)).rejects.toThrow("Bu telefon numarası başka bir müşteride kayıtlı");
  });

  it("falls back to a generic message for a non-ApiError failure", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new TypeError("fetch failed"));

    await expect(createCustomer(VALUES)).rejects.toThrow("Müşteri eklenemedi");
  });
});

describe("updateCustomer", () => {
  it("patches /customers/:id and revalidates the customers page", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue({ id: "c1", no: 1, ...VALUES });
    mocks.revalidatePath.mockClear();

    await updateCustomer("c1", VALUES);

    expect(mocks.apiFetch).toHaveBeenCalledWith("/customers/c1", { method: "PATCH", body: VALUES });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/restaurant-customers");
  });

  it("throws a generic message on failure", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new TypeError("fetch failed"));

    await expect(updateCustomer("c1", VALUES)).rejects.toThrow("Müşteri güncellenemedi");
  });
});

describe("deleteCustomer", () => {
  it("deletes /customers/:id and revalidates the customers page", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue(undefined);
    mocks.revalidatePath.mockClear();

    await deleteCustomer("c1");

    expect(mocks.apiFetch).toHaveBeenCalledWith("/customers/c1", { method: "DELETE" });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/restaurant-customers");
  });

  it("throws a generic message on failure, without revalidating", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new TypeError("fetch failed"));
    mocks.revalidatePath.mockClear();

    await expect(deleteCustomer("c1")).rejects.toThrow("Müşteri silinemedi");
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});
