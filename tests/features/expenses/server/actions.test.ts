// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { createExpense } from "@/features/expenses/server/actions";

const mocks = vi.hoisted(() => ({ apiFetch: vi.fn(), revalidatePath: vi.fn() }));
vi.mock("@/lib/api-client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api-client")>();
  return { ...actual, apiFetch: mocks.apiFetch };
});
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

const VALUES = { type: "Fatura" as const, paymentMethod: "cash" as const, amount: 5000, occurredAt: "2026-01-01T10:00:00.000Z", note: "" };

describe("createExpense", () => {
  it("posts to /expenses and revalidates the expenses page", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue({ id: "e1", ...VALUES });
    mocks.revalidatePath.mockClear();

    const result = await createExpense(VALUES);

    expect(mocks.apiFetch).toHaveBeenCalledWith("/expenses", { method: "POST", body: VALUES });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/restaurant-expenses");
    expect(result).toEqual({ id: "e1", ...VALUES });
  });

  it("throws a generic message on failure", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new TypeError("fetch failed"));

    await expect(createExpense(VALUES)).rejects.toThrow("Masraf eklenemedi");
  });
});
