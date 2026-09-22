import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppShell } from "@/components/shell/app-shell";
import { ShellProvider } from "@/components/shell/ShellContext";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({ refresh: vi.fn() }),
}));
vi.mock("@/features/auth/server/actions", () => ({ logoutAction: vi.fn() }));

function setup() {
  render(
    <ShellProvider>
      <AppShell>
        <p>Sayfa içeriği</p>
      </AppShell>
    </ShellProvider>
  );
  return { user: userEvent.setup() };
}

describe("AppShell", () => {
  it("renders the page inside the main landmark", () => {
    setup();

    expect(screen.getByRole("main")).toHaveTextContent("Sayfa içeriği");
  });

  it("keeps the navigation drawer closed until the menu button is pressed", () => {
    setup();

    expect(screen.queryByRole("navigation", { name: "Ana menü" })).not.toBeInTheDocument();
  });

  it("opens the navigation drawer from the top bar", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Menüyü aç" }));

    expect(screen.getByRole("navigation", { name: "Ana menü" })).toBeInTheDocument();
  });

  it("closes the drawer again with the close button", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Menüyü aç" }));

    await user.click(screen.getByRole("button", { name: "Kapat" }));

    expect(screen.queryByRole("navigation", { name: "Ana menü" })).not.toBeInTheDocument();
  });
});
