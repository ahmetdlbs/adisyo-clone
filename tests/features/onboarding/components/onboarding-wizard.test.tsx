import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OnboardingWizard } from "@/features/onboarding/components/onboarding-wizard";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

beforeEach(() => push.mockClear());

describe("OnboardingWizard", () => {
  it("starts on step 1 of 3 with the defaults already selected", () => {
    render(<OnboardingWizard />);

    expect(screen.getByRole("heading", { level: 1, name: "Çalışma Ayarlarınız" })).toBeInTheDocument();
    expect(screen.getByText("1/3")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /^Masa Siparişi/ })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /^Paket Sipariş/ })).not.toBeChecked();
    expect(screen.getByRole("checkbox", { name: /^Nakit/ })).toBeChecked();
  });

  it("toggles a work type and a payment type", async () => {
    const user = userEvent.setup();
    render(<OnboardingWizard />);

    await user.click(screen.getByRole("checkbox", { name: /^Paket Sipariş/ }));
    await user.click(screen.getByRole("checkbox", { name: /^Nakit/ }));

    expect(screen.getByRole("checkbox", { name: /^Paket Sipariş/ })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /^Nakit/ })).not.toBeChecked();
  });

  it("has no back button on the first step", () => {
    render(<OnboardingWizard />);

    expect(screen.queryByRole("button", { name: "Geri Dön" })).not.toBeInTheDocument();
  });

  it("moves to step 2 and can come back to step 1", async () => {
    const user = userEvent.setup();
    render(<OnboardingWizard />);

    await user.click(screen.getByRole("button", { name: "Devam Et" }));

    expect(screen.getByRole("heading", { level: 1, name: "İşletme Bilgileriniz" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Her İkisi/ })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Geri Dön" }));

    expect(screen.getByRole("heading", { level: 1, name: "Çalışma Ayarlarınız" })).toBeInTheDocument();
  });

  it("picks one option per single-select group on step 2", async () => {
    const user = userEvent.setup();
    render(<OnboardingWizard />);
    await user.click(screen.getByRole("button", { name: "Devam Et" }));

    await user.click(screen.getByRole("button", { name: /^Mutfak Ekranı/ }));

    expect(screen.getByRole("button", { name: /^Mutfak Ekranı/ })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: /^Her İkisi/ })).toHaveAttribute("aria-pressed", "false");
  });

  it("reaches the finished step and leaves the wizard for the dashboard", async () => {
    const user = userEvent.setup();
    render(<OnboardingWizard />);
    await user.click(screen.getByRole("button", { name: "Devam Et" }));

    await user.click(screen.getByRole("button", { name: "Devam Et" }));

    expect(screen.getByRole("heading", { level: 1, name: "Harika! Her Şey Hazır" })).toBeInTheDocument();
    expect(screen.getByText("3/3")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Adisyo'ya Git/ }));

    expect(push).toHaveBeenCalledWith("/dashboard");
  });
});
