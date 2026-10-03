import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfileScreen } from "@/features/profile/components/profile-screen";
import type { ProfileFormValues } from "@/features/profile/model/profile";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

const actions = vi.hoisted(() => ({ updateProfile: vi.fn() }));
vi.mock("@/features/profile/server/actions", () => actions);

beforeEach(() => {
  toast.success.mockClear();
  toast.error.mockClear();
  actions.updateProfile.mockReset().mockResolvedValue({ values: PROFILE, hasPin: false });
});

const PROFILE: ProfileFormValues = { firstName: "Ahmet", lastName: "Can", phone: "0544 307 11 60", email: "ahmet@isletme.local", pin: "" };

describe("ProfileScreen", () => {
  it("shows the profile form pre-filled", () => {
    render(<ProfileScreen initialProfile={PROFILE} />);

    expect(screen.getByRole("heading", { level: 1, name: "Profil" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /İsim/ })).toHaveValue("Ahmet");
    expect(screen.getByRole("textbox", { name: /Email/ })).toHaveValue("ahmet@isletme.local");
  });

  it("updates the profile", async () => {
    const user = userEvent.setup();
    render(<ProfileScreen initialProfile={PROFILE} />);

    await user.clear(screen.getByRole("textbox", { name: /İsim/ }));
    await user.type(screen.getByRole("textbox", { name: /İsim/ }), "Mehmet");
    await user.click(screen.getByRole("button", { name: "Güncelle" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Profil güncellendi"));
    expect(actions.updateProfile).toHaveBeenCalledWith({ ...PROFILE, firstName: "Mehmet" }, { removePin: false });
  });

  it("shows the API's reason on the email field when the address is already used", async () => {
    actions.updateProfile.mockRejectedValue(new Error("Bu e-posta başka bir kullanıcıda kayıtlı"));
    const user = userEvent.setup();
    render(<ProfileScreen initialProfile={PROFILE} />);

    await user.click(screen.getByRole("button", { name: "Güncelle" }));

    expect(await screen.findByText("Bu e-posta başka bir kullanıcıda kayıtlı")).toBeInTheDocument();
  });

  it("says what is invalid", async () => {
    const user = userEvent.setup();
    render(<ProfileScreen initialProfile={PROFILE} />);

    await user.clear(screen.getByRole("textbox", { name: /İsim/ }));
    await user.click(screen.getByRole("button", { name: "Güncelle" }));

    expect(await screen.findByText("İsim zorunludur")).toBeInTheDocument();
    expect(actions.updateProfile).not.toHaveBeenCalled();
  });

  it("switches the active tab, same as the original screen — no other tab ever had its own content either", async () => {
    const user = userEvent.setup();
    render(<ProfileScreen initialProfile={PROFILE} />);

    await user.click(screen.getByRole("tab", { name: "Parola Değişikliği" }));

    expect(screen.getByRole("tab", { name: "Parola Değişikliği", selected: true })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /İsim/ })).toHaveValue("Ahmet");
  });

  describe("PIN", () => {
    it("never shows the stored PIN, only that one is set", () => {
      render(<ProfileScreen initialProfile={PROFILE} hasPin />);

      expect(screen.getByRole("textbox", { name: /Pin Numarası/ })).toHaveValue("");
      expect(screen.getByText(/Bir PIN tanımlı/)).toBeInTheDocument();
    });

    it("sends a new PIN when one is typed", async () => {
      const user = userEvent.setup();
      render(<ProfileScreen initialProfile={PROFILE} hasPin />);

      await user.type(screen.getByRole("textbox", { name: /Pin Numarası/ }), "4321");
      await user.click(screen.getByRole("button", { name: "Güncelle" }));

      await waitFor(() => expect(actions.updateProfile).toHaveBeenCalledWith({ ...PROFILE, pin: "4321" }, { removePin: false }));
    });

    it("asks to remove the PIN through the checkbox", async () => {
      const user = userEvent.setup();
      render(<ProfileScreen initialProfile={PROFILE} hasPin />);

      await user.click(screen.getByRole("checkbox", { name: "PIN'i kaldır" }));
      await user.click(screen.getByRole("button", { name: "Güncelle" }));

      await waitFor(() => expect(actions.updateProfile).toHaveBeenCalledWith(PROFILE, { removePin: true }));
    });

    it("offers no removal when no PIN is set", () => {
      render(<ProfileScreen initialProfile={PROFILE} />);

      expect(screen.queryByRole("checkbox", { name: "PIN'i kaldır" })).not.toBeInTheDocument();
    });
  });
});
