// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { fetchActiveApps, requireApp } from "@/features/entitlements/server/active-apps";

const mocks = vi.hoisted(() => ({
  apiFetch: vi.fn(),
  redirect: vi.fn((to: string) => {
    throw new Error(`NEXT_REDIRECT:${to}`);
  }),
}));
vi.mock("@/lib/api-client", () => ({ apiFetch: mocks.apiFetch }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));

describe("fetchActiveApps", () => {
  it("asks the API which apps this restaurant can use right now", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue(["mutfak-ekrani"]);

    await expect(fetchActiveApps()).resolves.toEqual(["mutfak-ekrani"]);
    expect(mocks.apiFetch).toHaveBeenCalledWith("/billing/active-apps");
  });
});

describe("requireApp", () => {
  it("lets the page render when the app is active", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue(["mutfak-ekrani"]);
    mocks.redirect.mockClear();

    await expect(requireApp(["mutfak-ekrani"])).resolves.toBeUndefined();
    expect(mocks.redirect).not.toHaveBeenCalled();
  });

  it("lets the page render when any one of several apps is active", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue(["trendyol-yemek-entegrasyonu"]);

    await expect(requireApp(["yemeksepeti-entegrasyonu", "trendyol-yemek-entegrasyonu"])).resolves.toBeUndefined();
  });

  it("sends a restaurant without the app to the store, naming the app", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue(["siparis-masa-yonetimi"]);

    await expect(requireApp(["mutfak-ekrani"])).rejects.toThrow("NEXT_REDIRECT:/app-store?need=mutfak-ekrani");
  });
});
