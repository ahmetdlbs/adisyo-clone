// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { purchaseApp } from "@/features/app-store/server/actions";
import { ApiError } from "@/lib/api-client";

const mocks = vi.hoisted(() => ({ apiFetch: vi.fn(), revalidatePath: vi.fn() }));
vi.mock("@/lib/api-client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api-client")>();
  return { ...actual, apiFetch: mocks.apiFetch };
});
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

describe("purchaseApp", () => {
  it("checks out the app monthly and refreshes the whole signed-in layout on success", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue({ paymentId: "p1", entitlements: [] });
    mocks.revalidatePath.mockClear();

    const result = await purchaseApp("app-1");

    expect(mocks.apiFetch).toHaveBeenCalledWith("/billing/checkout", {
      method: "POST",
      body: { appIds: ["app-1"], period: "MONTHLY" },
    });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/", "layout");
    expect(result).toEqual({ ok: true, message: "Uygulama eklendi, menünüzde görünüyor" });
  });

  it("returns the API's own message on failure, without revalidating", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new ApiError("Bu uygulama zaten satın alınmış", 409));
    mocks.revalidatePath.mockClear();

    const result = await purchaseApp("app-1");

    expect(result).toEqual({ ok: false, message: "Bu uygulama zaten satın alınmış" });
    expect(mocks.revalidatePath).not.toHaveBeenCalled();
  });

  it("falls back to a generic message for a non-ApiError failure", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new TypeError("fetch failed"));

    const result = await purchaseApp("app-1");

    expect(result).toEqual({ ok: false, message: "Satın alma işlemi tamamlanamadı" });
  });
});
