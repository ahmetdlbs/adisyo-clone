import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { KitchenGroupsScreen } from "@/features/catalog/components/kitchen-groups-screen";
import type { KitchenGroup } from "@/features/catalog/model/kitchen-group";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

const actions = vi.hoisted(() => ({ createKitchenGroup: vi.fn(), updateKitchenGroup: vi.fn(), deleteKitchenGroup: vi.fn() }));
vi.mock("@/features/catalog/server/kitchen-group-actions", () => actions);

beforeEach(() => {
  toast.success.mockClear();
  toast.error.mockClear();
  Object.values(actions).forEach((mock) => mock.mockReset());
});

const MUTFAK: KitchenGroup = { id: "1", name: "Mutfak", hasCookingStage: false, hasPackagingStage: false };

function setup(groups: readonly KitchenGroup[] = [MUTFAK]) {
  render(<KitchenGroupsScreen groups={groups} />);
  return { user: userEvent.setup() };
}

const dialog = () => screen.findByRole("dialog", { name: "Mutfak Grubu Tanımla" });

describe("KitchenGroupsScreen", () => {
  it("shows the heading, the default-status note and the given group with its stages", () => {
    setup();

    expect(screen.getByRole("heading", { level: 1, name: "Mutfak Grubu Tanımları" })).toBeInTheDocument();
    expect(screen.getByText(/Hazırlanıyor ve Hazırlandı/)).toBeInTheDocument();
    expect(within(screen.getByRole("row", { name: /Mutfak/ })).getByText("Hazırlanıyor › Hazırlandı")).toBeInTheDocument();
  });

  it("adds a group with an optional stage", async () => {
    actions.createKitchenGroup.mockResolvedValue({ id: "2", name: "Bar", hasCookingStage: true, hasPackagingStage: false });
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni" }));
    const form = within(await dialog());
    await user.type(form.getByRole("textbox", { name: "Grup Adı" }), "Bar");
    await user.click(form.getByRole("checkbox", { name: "Pişirme aşaması" }));
    await user.click(form.getByRole("button", { name: "Ekle" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Mutfak grubu eklendi"));
    expect(actions.createKitchenGroup).toHaveBeenCalledWith({ name: "Bar", hasCookingStage: true, hasPackagingStage: false });
  });

  it("requires a name, and shows the API's reason for a duplicate", async () => {
    actions.createKitchenGroup.mockRejectedValue(new Error("Bu mutfak grubu zaten tanımlı"));
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
    actions.updateKitchenGroup.mockResolvedValue({ ...MUTFAK, hasPackagingStage: true });
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Mutfak düzenle" }));
    const form = within(await dialog());
    expect(form.getByRole("textbox", { name: "Grup Adı" })).toHaveValue("Mutfak");
    await user.click(form.getByRole("checkbox", { name: "Paketleme aşaması" }));
    await user.click(form.getByRole("button", { name: "Kaydet" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Mutfak grubu güncellendi"));
    expect(actions.updateKitchenGroup).toHaveBeenCalledWith("1", { name: "Mutfak", hasCookingStage: false, hasPackagingStage: true });
  });

  it("asks before deleting and calls the API once confirmed", async () => {
    actions.deleteKitchenGroup.mockResolvedValue(undefined);
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Mutfak sil" }));
    await user.click(await screen.findByRole("button", { name: "Sil" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Mutfak grubu silindi"));
    expect(actions.deleteKitchenGroup).toHaveBeenCalledWith("1");
  });
});
