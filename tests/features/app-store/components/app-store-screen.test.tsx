import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppStoreScreen } from "@/features/app-store/components/app-store-screen";
import { UNAVAILABLE_MESSAGE } from "@/lib/notify";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeEach(() => toast.info.mockClear());

describe("AppStoreScreen", () => {
  it("starts on the store tab, listing every app", () => {
    render(<AppStoreScreen />);

    expect(screen.getByRole("heading", { level: 1, name: "Uygulama Mağazası" })).toBeInTheDocument();
    expect(screen.getByText("Yemek Sepeti (Deliveryhero)")).toBeInTheDocument();
    expect(screen.getByText("Android Caller ID")).toBeInTheDocument();
  });

  it("switches to only the installed apps", async () => {
    const user = userEvent.setup();
    render(<AppStoreScreen />);

    await user.click(screen.getByRole("tab", { name: /Kurulu Uygulamalarım/ }));

    expect(screen.getByText("Android Caller ID")).toBeInTheDocument();
    expect(screen.queryByText("Yemek Sepeti (Deliveryhero)")).not.toBeInTheDocument();
  });

  it("filters by category", async () => {
    const user = userEvent.setup();
    render(<AppStoreScreen />);

    await user.click(screen.getByRole("button", { name: /Paket Sipariş/ }));

    expect(screen.getByText("Yemek Sepeti (Deliveryhero)")).toBeInTheDocument();
    expect(screen.queryByText("Android Caller ID")).not.toBeInTheDocument();
  });

  it("says a category with nothing in it is empty", async () => {
    const user = userEvent.setup();
    render(<AppStoreScreen />);

    await user.click(screen.getByRole("button", { name: /Otel/ }));

    expect(screen.getByText("Bu kategoride henüz uygulama yok.")).toBeInTheDocument();
  });

  it("searches by app name", async () => {
    const user = userEvent.setup();
    render(<AppStoreScreen />);

    await user.type(screen.getByRole("searchbox", { name: "Uygulama ara" }), "trendyol");

    expect(screen.getByText("Trendyol Yemek")).toBeInTheDocument();
    expect(screen.queryByText("Getir Yemek")).not.toBeInTheDocument();
  });

  it("says installing or managing an app is not available in this demo", async () => {
    const user = userEvent.setup();
    render(<AppStoreScreen />);

    await user.click(screen.getAllByRole("button", { name: "Ekle" })[0]!);
    await user.click(screen.getAllByRole("button", { name: "Yönet" })[0]!);

    expect(toast.info).toHaveBeenCalledTimes(2);
    expect(toast.info).toHaveBeenCalledWith(UNAVAILABLE_MESSAGE);
  });
});
