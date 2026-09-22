import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { KitchenGroupsScreen } from "@/features/catalog/components/kitchen-groups-screen";

const toast = vi.hoisted(() => ({ success: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeEach(() => toast.success.mockClear());

function setup() {
  render(<KitchenGroupsScreen />);
  return { user: userEvent.setup() };
}

const dialog = () => screen.findByRole("dialog", { name: "Mutfak Grubu Tanımla" });

describe("KitchenGroupsScreen", () => {
  it("shows the heading, the default-status note and the existing group with its stages", () => {
    setup();

    expect(screen.getByRole("heading", { level: 1, name: "Mutfak Grubu Tanımları" })).toBeInTheDocument();
    expect(screen.getByText(/Hazırlanıyor ve Hazırlandı/)).toBeInTheDocument();
    expect(within(screen.getByRole("row", { name: /Mutfak/ })).getByText("Hazırlanıyor › Hazırlandı")).toBeInTheDocument();
  });

  it("adds a group with an optional stage", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni" }));
    const form = within(await dialog());
    await user.type(form.getByRole("textbox", { name: "Grup Adı" }), "Bar");
    await user.click(form.getByRole("checkbox", { name: "Pişirme aşaması" }));
    await user.click(form.getByRole("button", { name: "Ekle" }));

    const row = await screen.findByRole("row", { name: /Bar/ });
    expect(within(row).getByText("Hazırlanıyor › Pişirme › Hazırlandı")).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith("Mutfak grubu eklendi");
  });

  it("requires a name and rejects a duplicate", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni" }));
    await dialog();
    await user.click(screen.getByRole("button", { name: "Ekle" }));
    expect(await screen.findByText("Grup adı zorunludur")).toBeInTheDocument();

    await user.type(screen.getByRole("textbox", { name: "Grup Adı" }), "mutfak");
    await user.click(screen.getByRole("button", { name: "Ekle" }));
    expect(await screen.findByText("Bu mutfak grubu zaten tanımlı")).toBeInTheDocument();
  });

  it("edits a group with its current values prefilled", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Mutfak düzenle" }));
    const form = within(await dialog());
    expect(form.getByRole("textbox", { name: "Grup Adı" })).toHaveValue("Mutfak");
    await user.click(form.getByRole("checkbox", { name: "Paketleme aşaması" }));
    await user.click(form.getByRole("button", { name: "Kaydet" }));

    expect(await screen.findByText("Hazırlanıyor › Paketleme › Hazırlandı")).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith("Mutfak grubu güncellendi");
  });

  it("asks before deleting and then shows the empty message", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Mutfak sil" }));
    await user.click(await screen.findByRole("button", { name: "Sil" }));

    await waitFor(() => expect(screen.getByText("Hiç mutfak grubu kaydı bulunamadı.")).toBeInTheDocument());
  });
});
