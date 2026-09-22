import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReferralScreen } from "@/features/referral/components/referral-screen";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeEach(() => {
  toast.success.mockClear();
  toast.error.mockClear();
});

describe("ReferralScreen", () => {
  it("has a heading and shows the referral link", () => {
    render(<ReferralScreen referralCode="AHMET123" />);

    expect(screen.getByRole("heading", { level: 1, name: "Tavsiye Et ve Kazan!" })).toBeInTheDocument();
    expect(screen.getByText("https://adisyo.com/tr/kayit?ref=AHMET123")).toBeInTheDocument();
  });

  it("copies the link to the clipboard and confirms it", async () => {
    const copyToClipboard = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ReferralScreen referralCode="AHMET123" copyToClipboard={copyToClipboard} />);

    await user.click(screen.getByRole("button", { name: "Bağlantıyı Kopyala" }));

    expect(copyToClipboard).toHaveBeenCalledWith("https://adisyo.com/tr/kayit?ref=AHMET123");
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Bağlantı kopyalandı"));
  });

  it("says so when the clipboard is not available", async () => {
    const copyToClipboard = vi.fn().mockRejectedValue(new Error("denied"));
    const user = userEvent.setup();
    render(<ReferralScreen referralCode="AHMET123" copyToClipboard={copyToClipboard} />);

    await user.click(screen.getByRole("button", { name: "Bağlantıyı Kopyala" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Bağlantı kopyalanamadı"));
  });

  it("shows the click, sign-up and reward stats", () => {
    render(<ReferralScreen referralCode="AHMET123" stats={{ clicks: 42, signups: 3, rewardMonths: 3 }} />);

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("3 Ay")).toBeInTheDocument();
  });
});
