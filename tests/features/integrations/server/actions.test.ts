// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { disconnectIntegration, fetchIntegrations, saveIntegration } from "@/features/integrations/server/actions";
import { ApiError } from "@/lib/api-client";

const mocks = vi.hoisted(() => ({ apiFetch: vi.fn(), revalidatePath: vi.fn() }));
vi.mock("@/lib/api-client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api-client")>();
  return { ...actual, apiFetch: mocks.apiFetch };
});
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));

describe("integration actions", () => {
  it("reads the integrations from the API", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue([{ provider: "trendyol" }]);

    await expect(fetchIntegrations()).resolves.toEqual([{ provider: "trendyol" }]);
    expect(mocks.apiFetch).toHaveBeenCalledWith("/integrations");
  });

  it("saves the credentials and refreshes the page", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue({ provider: "trendyol", status: "PENDING" });
    mocks.revalidatePath.mockClear();

    await saveIntegration("trendyol", { apiKey: "k" });

    expect(mocks.apiFetch).toHaveBeenCalledWith("/integrations/trendyol", { method: "PUT", body: { credentials: { apiKey: "k" } } });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/integration-settings");
  });

  it("passes the API's own message on, such as the app not being bought", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new ApiError('Bu özellik için "Trendyol" uygulamasını edinmelisiniz', 403));

    await expect(saveIntegration("trendyol", {})).rejects.toThrow('"Trendyol" uygulamasını edinmelisiniz');
  });

  it("uses a generic message for an outage", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new TypeError("fetch failed"));

    await expect(saveIntegration("trendyol", {})).rejects.toThrow("Bağlantı bilgileri kaydedilemedi");
  });

  it("disconnects and refreshes the page", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue({ provider: "trendyol", status: "DISCONNECTED" });
    mocks.revalidatePath.mockClear();

    await disconnectIntegration("trendyol");

    expect(mocks.apiFetch).toHaveBeenCalledWith("/integrations/trendyol", { method: "DELETE" });
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/integration-settings");
  });
});
