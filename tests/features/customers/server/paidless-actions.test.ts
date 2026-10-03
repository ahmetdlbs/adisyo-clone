// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { createPaidless, deletePaidless, updatePaidless } from "@/features/customers/server/paidless-actions";
import { ApiError } from "@/lib/api-client";

const mocks = vi.hoisted(() => ({ apiFetch: vi.fn(), revalidatePath: vi.fn() }));
vi.mock("@/lib/api-client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api-client")>();
  return { ...actual, apiFetch: mocks.apiFetch };
});
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

const VALUES = { firstName: "Ahmet", lastName: "Can", title: "" };

describe("createPaidless", () => {
  it("posts to /paidless and revalidates the paidless page", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue({ id: "p1", no: 10_000_000, ...VALUES });
    mocks.revalidatePath.mockClear();

    const result = await createPaidless(VALUES);

    expect(mocks.apiFetch).toHaveBeenCalledWith("/paidless", { method: "POST", body: VALUES });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/restaurant-paidlesses");
    expect(result).toEqual({ id: "p1", no: 10_000_000, ...VALUES });
  });

  it("throws the API's own message when the name is already listed", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new ApiError("Bu kişi zaten kayıtlı", 409));

    await expect(createPaidless(VALUES)).rejects.toThrow("Bu kişi zaten kayıtlı");
  });

  it("falls back to a generic message for a non-ApiError failure", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new TypeError("fetch failed"));

    await expect(createPaidless(VALUES)).rejects.toThrow("Ödenmez eklenemedi");
  });
});

describe("updatePaidless", () => {
  it("patches /paidless/:id and revalidates the paidless page", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue({ id: "p1", no: 10_000_000, ...VALUES });
    mocks.revalidatePath.mockClear();

    await updatePaidless("p1", VALUES);

    expect(mocks.apiFetch).toHaveBeenCalledWith("/paidless/p1", { method: "PATCH", body: VALUES });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/restaurant-paidlesses");
  });
});

describe("deletePaidless", () => {
  it("deletes /paidless/:id and revalidates the paidless page", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue(undefined);
    mocks.revalidatePath.mockClear();

    await deletePaidless("p1");

    expect(mocks.apiFetch).toHaveBeenCalledWith("/paidless/p1", { method: "DELETE" });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/restaurant-paidlesses");
  });

  it("throws a generic message on failure, without revalidating", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new TypeError("fetch failed"));
    mocks.revalidatePath.mockClear();

    await expect(deletePaidless("p1")).rejects.toThrow("Ödenmez silinemedi");
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });
});
