import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeaturesScreen } from "@/features/catalog/components/features-screen";
import type { FeatureGroup } from "@/features/catalog/model/feature-group";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

const actions = vi.hoisted(() => ({ createFeatureGroup: vi.fn(), updateFeatureGroup: vi.fn(), deleteFeatureGroup: vi.fn() }));
vi.mock("@/features/catalog/server/feature-group-actions", () => actions);

beforeEach(() => {
  toast.success.mockClear();
  toast.error.mockClear();
  Object.values(actions).forEach((mock) => mock.mockReset());
});

const PISIRME: FeatureGroup = {
  id: "1",
  name: "Pişirme",
  selectionType: "single",
  useRecipeProduct: false,
  isRequired: true,
  options: [
    { id: "o1", name: "Az Pişmiş", price: 0, isDefault: false },
    { id: "o2", name: "Orta", price: 0, isDefault: true },
    { id: "o3", name: "İyi Pişmiş", price: 0, isDefault: false },
  ],
};
const EKSTRALAR: FeatureGroup = {
  id: "2",
  name: "Ekstralar",
  selectionType: "multiple",
  useRecipeProduct: false,
  isRequired: false,
  options: [
    { id: "o4", name: "Ekstra peynir", price: 5, isDefault: false },
    { id: "o5", name: "Ekstra sos", price: 3, isDefault: false },
    { id: "o6", name: "Ekstra et", price: 20, isDefault: false },
  ],
};

function setup(groups: readonly FeatureGroup[] = [PISIRME, EKSTRALAR]) {
  render(<FeaturesScreen groups={groups} />);
  return { user: userEvent.setup() };
}

const sheet = () => screen.findByRole("dialog", { name: "Özellik Grubu Tanımla" });
const rowOf = (name: string) => screen.getByRole("row", { name: new RegExp(name) });

describe("FeaturesScreen", () => {
  it("lists the groups with their selection type and option count", () => {
    setup();

    expect(screen.getByRole("heading", { level: 1, name: "Özellikler" })).toBeInTheDocument();
    expect(within(rowOf("Pişirme")).getByText("Tekli Seçim")).toBeInTheDocument();
    expect(within(rowOf("Pişirme")).getByText("3")).toBeInTheDocument();
    expect(within(rowOf("Ekstralar")).getByText("Çoklu Seçim")).toBeInTheDocument();
  });

  it("filters the list as the user searches, in Turkish case rules", async () => {
    const { user } = setup();

    await user.type(screen.getByRole("searchbox", { name: "Ara" }), "PİŞ");

    expect(screen.getByRole("row", { name: /Pişirme/ })).toBeInTheDocument();
    expect(screen.queryByRole("row", { name: /Ekstralar/ })).not.toBeInTheDocument();
  });

  it("says so when nothing matches", async () => {
    const { user } = setup();

    await user.type(screen.getByRole("searchbox", { name: "Ara" }), "zzz");

    expect(screen.getByText("Kayıt bulunamadı.")).toBeInTheDocument();
  });

  it("adds a group with several options through the side panel", async () => {
    actions.createFeatureGroup.mockResolvedValue({ ...EKSTRALAR, id: "3", name: "Soslar" });
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni Grup Tanımla" }));
    const form = within(await sheet());
    await user.type(form.getByRole("textbox", { name: /Özellik grup ismi/ }), "Soslar");
    await user.type(form.getByRole("textbox", { name: "Özellik adı 1" }), "Ketçap");
    await user.click(form.getByRole("button", { name: "Özellik ekle" }));
    await user.type(form.getByRole("textbox", { name: "Özellik adı 2" }), "Mayonez");
    await user.type(form.getByRole("spinbutton", { name: "Ekstra tutar 2" }), "5");
    await user.click(form.getByRole("button", { name: "Ekle" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Özellik grubu eklendi"));
    expect(actions.createFeatureGroup).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Soslar",
        options: [
          expect.objectContaining({ name: "Ketçap", price: 0 }),
          expect.objectContaining({ name: "Mayonez", price: 5 }),
        ],
      })
    );
  });

  it("reports a missing name and a missing option together", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni Grup Tanımla" }));
    await sheet();
    await user.click(screen.getByRole("button", { name: "Ekle" }));

    expect(await screen.findByText("Özellik grup ismi zorunludur")).toBeInTheDocument();
    expect(screen.getByText("En az bir özellik ekleyin")).toBeInTheDocument();
    expect(actions.createFeatureGroup).not.toHaveBeenCalled();
  });

  it("flags a repeated option name on its own row", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni Grup Tanımla" }));
    const form = within(await sheet());
    await user.type(form.getByRole("textbox", { name: /Özellik grup ismi/ }), "Soslar");
    await user.type(form.getByRole("textbox", { name: "Özellik adı 1" }), "Ketçap");
    await user.click(form.getByRole("button", { name: "Özellik ekle" }));
    await user.type(form.getByRole("textbox", { name: "Özellik adı 2" }), "ketçap");
    await user.click(form.getByRole("button", { name: "Ekle" }));

    expect(await screen.findByText("Bu özellik zaten eklendi")).toBeInTheDocument();
  });

  it("shows the API's reason on the name field when the group name is already used", async () => {
    actions.createFeatureGroup.mockRejectedValue(new Error("Bu özellik grubu zaten tanımlı"));
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni Grup Tanımla" }));
    const form = within(await sheet());
    await user.type(form.getByRole("textbox", { name: /Özellik grup ismi/ }), "pişirme");
    await user.type(form.getByRole("textbox", { name: "Özellik adı 1" }), "Az Pişmiş");
    await user.click(form.getByRole("button", { name: "Ekle" }));

    expect(await screen.findByText("Bu özellik grubu zaten tanımlı")).toBeInTheDocument();
  });

  it("opens an existing group with its options prefilled and lets a row be removed", async () => {
    actions.updateFeatureGroup.mockResolvedValue({ ...EKSTRALAR, options: EKSTRALAR.options.slice(1) });
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Ekstralar düzenle" }));
    const form = within(await sheet());
    expect(form.getByRole("textbox", { name: /Özellik grup ismi/ })).toHaveValue("Ekstralar");
    expect(form.getByRole("textbox", { name: "Özellik adı 1" })).toHaveValue("Ekstra peynir");
    await user.click(form.getByRole("button", { name: "Özellik 1 sil" }));
    await user.click(form.getByRole("button", { name: "Kaydet" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Özellik grubu güncellendi"));
    expect(actions.updateFeatureGroup).toHaveBeenCalledWith(
      "2",
      expect.objectContaining({
        options: [expect.objectContaining({ name: "Ekstra sos" }), expect.objectContaining({ name: "Ekstra et" })],
      })
    );
  });

  it("asks before deleting a group", async () => {
    actions.deleteFeatureGroup.mockResolvedValue(undefined);
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Ekstralar sil" }));
    await user.click(await screen.findByRole("button", { name: "Sil" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Özellik grubu silindi"));
    expect(actions.deleteFeatureGroup).toHaveBeenCalledWith("2");
  });
});
