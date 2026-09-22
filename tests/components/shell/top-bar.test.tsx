import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TopBar } from "@/components/shell/top-bar";

const mocks = vi.hoisted(() => ({ refresh: vi.fn(), toastInfo: vi.fn(), logout: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: mocks.refresh }) }));
vi.mock("sonner", () => ({ toast: { info: mocks.toastInfo } }));
vi.mock("@/features/auth/server/actions", () => ({ logoutAction: mocks.logout }));

// jsdom cannot navigate; cancelling the default action keeps link clicks from logging errors.
const cancelNavigation = (event: Event) => event.preventDefault();
beforeEach(() => {
  mocks.refresh.mockClear();
  mocks.toastInfo.mockClear();
  mocks.logout.mockClear();
  document.addEventListener("click", cancelNavigation);
});
afterEach(() => document.removeEventListener("click", cancelNavigation));

function setup() {
  const onMenuClick = vi.fn();
  render(<TopBar onMenuClick={onMenuClick} />);
  return { onMenuClick, user: userEvent.setup() };
}

describe("TopBar", () => {
  it("opens the navigation drawer from the menu button", async () => {
    const { user, onMenuClick } = setup();

    await user.click(screen.getByRole("button", { name: "Menüyü aç" }));

    expect(onMenuClick).toHaveBeenCalledOnce();
  });

  it("shows who is signed in", () => {
    setup();

    expect(screen.getByRole("button", { name: /84425 - Ahmet/ })).toBeInTheDocument();
  });

  it("refreshes server data without reloading the page", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Sayfayı yenile" }));

    expect(mocks.refresh).toHaveBeenCalledOnce();
  });

  it("tells the user when a feature is not available yet instead of blocking with alert()", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Duyurular" }));

    expect(mocks.toastInfo).toHaveBeenCalledWith("Bu özellik henüz kullanılabilir değil.");
  });

  it("lists account destinations in the user menu, without the social-media entry", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: /84425 - Ahmet/ }));

    expect(await screen.findByRole("menuitem", { name: "Profil" })).toHaveAttribute("href", "/profile");
    expect(screen.getByRole("menuitem", { name: "Restaurant Ayarları" })).toHaveAttribute(
      "href",
      "/restaurant-settings"
    );
    expect(screen.getByRole("menuitem", { name: "Hesap Bilgileri" })).toHaveAttribute("href", "/account");
    expect(screen.queryByRole("menuitem", { name: "Sosyal Medya" })).not.toBeInTheDocument();
  });

  it("has no gift/campaigns or Katıl button", () => {
    setup();

    expect(screen.queryByRole("button", { name: "Kampanyalar" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Katıl" })).not.toBeInTheDocument();
  });

  it("signs the user out from the user menu", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: /84425 - Ahmet/ }));

    await user.click(await screen.findByRole("menuitem", { name: "Çıkış" }));

    expect(mocks.logout).toHaveBeenCalledOnce();
  });
});
