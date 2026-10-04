import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppStoreScreen } from "@/features/app-store/components/app-store-screen";
import type { AppEntitlement, CatalogApp } from "@/features/app-store/model/app-store";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

const mocks = vi.hoisted(() => ({ purchaseApp: vi.fn() }));
vi.mock("@/features/app-store/server/actions", () => ({ purchaseApp: mocks.purchaseApp }));

function app(overrides: Partial<CatalogApp> = {}): CatalogApp {
  return {
    id: "app-1",
    key: "yemeksepeti-entegrasyonu",
    name: "Yemek Sepeti Entegrasyonu",
    description: "d",
    category: "delivery",
    isCore: false,
    isAvailable: true,
    monthlyPrice: 22500,
    yearlyPrice: 225000,
    ...overrides,
  };
}

const APPS: CatalogApp[] = [
  app({ id: "app-1", category: "delivery", name: "Yemek Sepeti Entegrasyonu" }),
  app({ id: "app-2", category: "hardware", name: "Android Caller ID", monthlyPrice: 7900, yearlyPrice: 79000 }),
  app({ id: "app-3", key: "siparis-masa-yonetimi", category: "operations", name: "Sipariş & Masa Yönetimi", isCore: true, monthlyPrice: 0, yearlyPrice: 0 }),
  app({ id: "app-4", key: "e-fatura", category: "einvoice", name: "E-Fatura Entegrasyonu", isAvailable: false }),
];
APPS[1] = { ...APPS[1]!, key: "android-caller-id" };
const ACTIVE = ["android-caller-id", "siparis-masa-yonetimi"];
const ENTITLEMENTS: readonly AppEntitlement[] = [{ appId: "app-2", status: "ACTIVE", expiresAt: "2026-11-03T00:00:00.000Z" }];

function setup(props: { apps?: readonly CatalogApp[]; activeKeys?: readonly string[]; entitlements?: readonly AppEntitlement[]; needKey?: string } = {}) {
  toast.success.mockClear();
  toast.error.mockClear();
  toast.info.mockClear();
  mocks.purchaseApp.mockReset();

  const user = userEvent.setup();
  render(<AppStoreScreen apps={props.apps ?? APPS} activeKeys={props.activeKeys ?? ACTIVE} entitlements={props.entitlements ?? ENTITLEMENTS} needKey={props.needKey} />);
  return { user };
}

describe("AppStoreScreen", () => {
  it("starts on the store tab, listing every app", () => {
    setup();

    expect(screen.getByRole("heading", { level: 1, name: "Uygulama Mağazası" })).toBeInTheDocument();
    expect(screen.getByText("Yemek Sepeti Entegrasyonu")).toBeInTheDocument();
    expect(screen.getByText("Android Caller ID")).toBeInTheDocument();
  });

  it("switches to only the installed apps (active entitlement or a core app)", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("tab", { name: /Kurulu Uygulamalarım/ }));

    expect(screen.getByText("Android Caller ID")).toBeInTheDocument();
    expect(screen.getByText("Sipariş & Masa Yönetimi")).toBeInTheDocument();
    expect(screen.queryByText("Yemek Sepeti Entegrasyonu")).not.toBeInTheDocument();
  });

  it("filters by category", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: /Paket Sipariş/ }));

    expect(screen.getByText("Yemek Sepeti Entegrasyonu")).toBeInTheDocument();
    expect(screen.queryByText("Android Caller ID")).not.toBeInTheDocument();
  });

  it("says a category with nothing in it is empty", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: /Otel/ }));

    expect(screen.getByText("Bu kategoride henüz uygulama yok.")).toBeInTheDocument();
  });

  it("searches by app name", async () => {
    const { user } = setup();

    await user.type(screen.getByRole("searchbox", { name: "Uygulama ara" }), "caller");

    expect(screen.getByText("Android Caller ID")).toBeInTheDocument();
    expect(screen.queryByText("Yemek Sepeti Entegrasyonu")).not.toBeInTheDocument();
  });

  it("shows the monthly price for a purchasable app but not for a core (free) one", () => {
    setup();

    expect(screen.getAllByText("₺225,00 / ay").length).toBeGreaterThan(0);
    expect(screen.queryByText("₺0,00 / ay")).not.toBeInTheDocument();
  });

  it("buys a not-yet-owned app and shows a success toast", async () => {
    const { user } = setup();
    mocks.purchaseApp.mockResolvedValue({ ok: true, message: "Uygulama eklendi, menünüzde görünüyor" });

    await user.click(screen.getAllByRole("button", { name: /Ekle/ })[0]!);

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Uygulama eklendi, menünüzde görünüyor"));
    expect(mocks.purchaseApp).toHaveBeenCalledWith("app-1");
  });

  it("shows an error toast when the purchase is rejected", async () => {
    const { user } = setup();
    mocks.purchaseApp.mockResolvedValue({ ok: false, message: "Bu uygulama zaten satın alınmış" });

    await user.click(screen.getAllByRole("button", { name: /Ekle/ })[0]!);

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Bu uygulama zaten satın alınmış"));
  });

  it("opens an installed app's own screen, and says Kurulum for an integration", () => {
    setup({ activeKeys: ["yemeksepeti-entegrasyonu", "siparis-masa-yonetimi"] });

    expect(screen.getByRole("link", { name: /Kurulum/ })).toHaveAttribute("href", "/integration-settings");
    expect(screen.getByRole("link", { name: /Aç/ })).toHaveAttribute("href", "/orders");
  });

  it("marks installed apps and shows when a purchase renews", () => {
    setup();

    expect(screen.getAllByText("Kurulu")).toHaveLength(2);
    expect(screen.getByText(/Yenileme: /)).toBeInTheDocument();
  });

  it("lists an app that is not built as Yakında with a disabled button", () => {
    setup();

    expect(screen.getByText("Yakında")).toBeInTheDocument();
    const card = screen.getByText("E-Fatura Entegrasyonu").closest("div.rounded-xl") as HTMLElement;
    expect(within(card).getByRole("button", { name: /Ekle/ })).toBeDisabled();
  });

  it("explains which app a gated screen needed when sent here", () => {
    setup({ needKey: "yemeksepeti-entegrasyonu" });

    expect(screen.getByText(/Yemek Sepeti Entegrasyonu" gerekiyor/)).toBeInTheDocument();
  });

  it("shows no notice when the needed app is already installed", () => {
    setup({ needKey: "android-caller-id" });

    expect(screen.queryByText(/gerekiyor/)).not.toBeInTheDocument();
  });
});
