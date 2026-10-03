import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccountInfoScreen } from "@/features/account/components/account-info-screen";
import type { AccountEntitlement, AccountPayment } from "@/features/account/model/account";
import { UNAVAILABLE_MESSAGE } from "@/lib/notify";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeEach(() => toast.info.mockClear());

// Noon UTC keeps the calendar date stable across any realistic local time zone.
const ACTIVE_APP: AccountEntitlement = { status: "ACTIVE", expiresAt: "2026-10-01T12:00:00.000Z" };
const PAYMENT: AccountPayment = { id: "p1", amount: 15000, currency: "TRY", provider: "mock", status: "PAID", createdAt: "2026-09-19T12:00:00.000Z" };

function setup(entitlements: readonly AccountEntitlement[] = [], payments: readonly AccountPayment[] = []) {
  render(<AccountInfoScreen entitlements={entitlements} payments={payments} />);
  return userEvent.setup();
}

describe("AccountInfoScreen", () => {
  it("says plainly when there is no active app, and shows an empty payment history", () => {
    setup();

    expect(screen.getByText("Aktif uygulamanız yok")).toBeInTheDocument();
    expect(screen.getByText("Kayıtlı ödeme bulunamadı!")).toBeInTheDocument();
  });

  it("counts the active apps and shows the soonest renewal", () => {
    setup([ACTIVE_APP, { status: "CANCELLED", expiresAt: "2026-11-01T00:00:00.000Z" }]);

    expect(screen.getByText("1 uygulama aktif")).toBeInTheDocument();
    expect(screen.getByText("01.10.2026")).toBeInTheDocument();
  });

  it("lists a real payment with its amount, status and provider", () => {
    setup([], [PAYMENT]);

    const row = screen.getByRole("row", { name: /mock/ });
    expect(row).toHaveTextContent("Ödendi");
    expect(row).toHaveTextContent("₺150,00");
    expect(row).toHaveTextContent("19.09.2026");
  });

  it("says billing actions are not available yet", async () => {
    const user = setup();

    await user.click(screen.getByRole("button", { name: "Süreyi Uzat/Ödeme Yap" }));
    await user.click(screen.getByRole("button", { name: "Düzenle" }));
    await user.click(screen.getByRole("button", { name: "Kartınızı Kaydedin" }));
    await user.click(screen.getByRole("button", { name: "Otomatik Ödeme Talimatı Verin" }));

    expect(toast.info).toHaveBeenCalledTimes(4);
    expect(toast.info).toHaveBeenCalledWith(UNAVAILABLE_MESSAGE);
  });
});
