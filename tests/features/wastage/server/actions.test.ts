// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { createWastage } from "@/features/wastage/server/actions";

const mocks = vi.hoisted(() => ({ apiFetch: vi.fn(), revalidatePath: vi.fn() }));
vi.mock("@/lib/api-client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api-client")>();
  return { ...actual, apiFetch: mocks.apiFetch };
});
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

const VALUES = { productName: "Kola", reason: "Kırıldı", quantity: 1, cost: 1000, occurredAt: "2026-01-01T10:00:00.000Z", responsible: "Ahmet", stockItemId: undefined, stockQuantity: undefined };

describe("createWastage", () => {
  it("posts to /wastage and revalidates the wastage page", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue({ id: "w1", ...VALUES });
    mocks.revalidatePath.mockClear();

    const result = await createWastage(VALUES);

    expect(mocks.apiFetch).toHaveBeenCalledWith("/wastage", { method: "POST", body: VALUES });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/restaurant-wastages");
    expect(result).toEqual({ id: "w1", ...VALUES });
  });

  it("throws a generic message on failure", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new TypeError("fetch failed"));

    await expect(createWastage(VALUES)).rejects.toThrow("Zayi eklenemedi");
  });
});
