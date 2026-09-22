import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccountInfoScreen } from "@/features/account/components/account-info-screen";
import { UNAVAILABLE_MESSAGE } from "@/lib/notify";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeEach(() => toast.info.mockClear());

describe("AccountInfoScreen", () => {
  it("shows the current plan and an empty payment history", () => {
    render(<AccountInfoScreen />);

    expect(screen.getByText("Trial paket")).toBeInTheDocument();
    expect(screen.getByText("Kayıtlı ödeme bulunamadı!")).toBeInTheDocument();
  });

  it("says billing actions are not available yet", async () => {
    const user = userEvent.setup();
    render(<AccountInfoScreen />);

    await user.click(screen.getByRole("button", { name: "Süreyi Uzat/Ödeme Yap" }));
    await user.click(screen.getByRole("button", { name: "Düzenle" }));
    await user.click(screen.getByRole("button", { name: "Kartınızı Kaydedin" }));
    await user.click(screen.getByRole("button", { name: "Otomatik Ödeme Talimatı Verin" }));

    expect(toast.info).toHaveBeenCalledTimes(4);
    expect(toast.info).toHaveBeenCalledWith(UNAVAILABLE_MESSAGE);
  });
});
