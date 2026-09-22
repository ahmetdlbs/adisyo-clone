import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProfileScreen } from "@/features/profile/components/profile-screen";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeEach(() => {
  toast.success.mockClear();
});

describe("ProfileScreen", () => {
  it("shows the profile form pre-filled", () => {
    render(<ProfileScreen initialProfile={{ firstName: "Ahmet", lastName: "Can", phone: "0544 307 11 60", email: "ahmet@isletme.local", pin: "" }} />);

    expect(screen.getByRole("heading", { level: 1, name: "Profil" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /İsim/ })).toHaveValue("Ahmet");
    expect(screen.getByRole("textbox", { name: /Email/ })).toHaveValue("ahmet@isletme.local");
  });

  it("updates the profile", async () => {
    const user = userEvent.setup();
    render(<ProfileScreen initialProfile={{ firstName: "Ahmet", lastName: "Can", phone: "0544 307 11 60", email: "ahmet@isletme.local", pin: "" }} />);

    await user.clear(screen.getByRole("textbox", { name: /İsim/ }));
    await user.type(screen.getByRole("textbox", { name: /İsim/ }), "Mehmet");
    await user.click(screen.getByRole("button", { name: "Güncelle" }));

    expect(toast.success).toHaveBeenCalledWith("Profil güncellendi");
  });

  it("says what is invalid", async () => {
    const user = userEvent.setup();
    render(<ProfileScreen initialProfile={{ firstName: "Ahmet", lastName: "Can", phone: "0544 307 11 60", email: "ahmet@isletme.local", pin: "" }} />);

    await user.clear(screen.getByRole("textbox", { name: /İsim/ }));
    await user.click(screen.getByRole("button", { name: "Güncelle" }));

    expect(await screen.findByText("İsim zorunludur")).toBeInTheDocument();
  });

  it("switches the active tab, same as the original screen — no other tab ever had its own content either", async () => {
    const user = userEvent.setup();
    render(<ProfileScreen initialProfile={{ firstName: "Ahmet", lastName: "Can", phone: "0544 307 11 60", email: "ahmet@isletme.local", pin: "" }} />);

    await user.click(screen.getByRole("tab", { name: "Parola Değişikliği" }));

    expect(screen.getByRole("tab", { name: "Parola Değişikliği", selected: true })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /İsim/ })).toHaveValue("Ahmet");
  });
});
