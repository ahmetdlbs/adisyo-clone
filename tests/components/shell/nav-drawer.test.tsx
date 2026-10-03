import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NavDrawer } from "@/components/shell/nav-drawer";

const navigation = vi.hoisted(() => ({ pathname: "/vat-definitions" }));
const auth = vi.hoisted(() => ({ logout: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.pathname }));
vi.mock("@/features/auth/server/actions", () => ({ logoutAction: auth.logout }));

// jsdom cannot navigate; cancelling the default action keeps link clicks from logging errors.
const cancelNavigation = (event: Event) => event.preventDefault();
beforeEach(() => document.addEventListener("click", cancelNavigation));
afterEach(() => document.removeEventListener("click", cancelNavigation));

function setup({ open = true, pathname = "/vat-definitions" } = {}) {
  navigation.pathname = pathname;
  const onOpenChange = vi.fn();
  render(<NavDrawer open={open} onOpenChange={onOpenChange} />);
  return { onOpenChange, user: userEvent.setup() };
}

describe("NavDrawer", () => {
  it("renders nothing while closed", () => {
    setup({ open: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("shows the signed-in identity", () => {
    setup();

    expect(screen.getByText("AHMET - 84425")).toBeInTheDocument();
  });

  it("links top-level entries to their pages", () => {
    setup();

    expect(screen.getByRole("link", { name: "Ana Sayfa" })).toHaveAttribute("href", "/dashboard");
    expect(screen.getByRole("link", { name: "Sipariş" })).toHaveAttribute("href", "/orders");
  });

  it("opens the group that contains the active page", () => {
    setup({ pathname: "/vat-definitions" });

    expect(screen.getByRole("button", { name: /Tanımlamalar/ })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "KDV Tanımlamaları" })).toHaveAttribute("href", "/vat-definitions");
  });

  it("keeps the other groups collapsed", () => {
    setup({ pathname: "/vat-definitions" });

    expect(screen.getByRole("button", { name: /Entegrasyon İşlemleri/ })).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "Menü Operasyonları" })).not.toBeInTheDocument();
  });

  it("expands a collapsed group when its header is pressed", async () => {
    const { user } = setup({ pathname: "/vat-definitions" });

    await user.click(screen.getByRole("button", { name: /Entegrasyon İşlemleri/ }));

    expect(screen.getByRole("link", { name: "Menü Operasyonları" })).toHaveAttribute(
      "href",
      "/integration-menu-operations"
    );
  });

  it("marks only the current page with aria-current", () => {
    setup({ pathname: "/vat-definitions" });

    expect(screen.getByRole("link", { name: "KDV Tanımlamaları" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Ana Sayfa" })).not.toHaveAttribute("aria-current");
  });

  it("treats nested paths as the parent page", () => {
    setup({ pathname: "/kitchen-detail/98012" });

    expect(screen.getByRole("link", { name: "Mutfak" })).toHaveAttribute("aria-current", "page");
  });

  it("renders entries without a page as disabled buttons, not links", () => {
    setup();

    expect(screen.getByRole("button", { name: /Dijital Menü/ })).toBeDisabled();
    expect(screen.queryByRole("link", { name: /Dijital Menü/ })).not.toBeInTheDocument();
  });

  it("shows promotional badges", () => {
    setup();

    expect(screen.getByText("Yepyeni")).toBeInTheDocument();
  });

  it("closes the drawer after a link is followed", async () => {
    const { user, onOpenChange } = setup();

    await user.click(screen.getByRole("link", { name: "Ana Sayfa" }));

    expect(onOpenChange).toHaveBeenCalled();
    expect(onOpenChange.mock.calls.at(-1)?.[0]).toBe(false);
  });

  it("signs the user out from the footer button", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Çıkış Yap" }));

    expect(auth.logout).toHaveBeenCalledOnce();
  });
});
