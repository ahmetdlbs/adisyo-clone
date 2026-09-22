import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeaturesScreen } from "@/features/catalog/components/features-screen";

const toast = vi.hoisted(() => ({ success: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeEach(() => toast.success.mockClear());

function setup() {
  render(<FeaturesScreen />);
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
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni Grup Tanımla" }));
    const form = within(await sheet());
    await user.type(form.getByRole("textbox", { name: /Özellik grup ismi/ }), "Soslar");
    await user.type(form.getByRole("textbox", { name: "Özellik adı 1" }), "Ketçap");
    await user.click(form.getByRole("button", { name: "Özellik ekle" }));
    await user.type(form.getByRole("textbox", { name: "Özellik adı 2" }), "Mayonez");
    await user.type(form.getByRole("spinbutton", { name: "Ekstra tutar 2" }), "5");
    await user.click(form.getByRole("button", { name: "Ekle" }));

    const row = await screen.findByRole("row", { name: /Soslar/ });
    expect(within(row).getByText("2")).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith("Özellik grubu eklendi");
  });

  it("reports a missing name and a missing option together", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni Grup Tanımla" }));
    await sheet();
    await user.click(screen.getByRole("button", { name: "Ekle" }));

    expect(await screen.findByText("Özellik grup ismi zorunludur")).toBeInTheDocument();
    expect(screen.getByText("En az bir özellik ekleyin")).toBeInTheDocument();
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

  it("opens an existing group with its options prefilled and lets a row be removed", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Ekstralar düzenle" }));
    const form = within(await sheet());
    expect(form.getByRole("textbox", { name: /Özellik grup ismi/ })).toHaveValue("Ekstralar");
    expect(form.getByRole("textbox", { name: "Özellik adı 1" })).toHaveValue("Ekstra peynir");
    await user.click(form.getByRole("button", { name: "Özellik 1 sil" }));
    await user.click(form.getByRole("button", { name: "Kaydet" }));

    await waitFor(() => expect(within(rowOf("Ekstralar")).getByText("2")).toBeInTheDocument());
    expect(toast.success).toHaveBeenCalledWith("Özellik grubu güncellendi");
  });

  it("asks before deleting a group", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Ekstralar sil" }));
    await user.click(await screen.findByRole("button", { name: "Sil" }));

    await waitFor(() => expect(screen.queryByRole("row", { name: /Ekstralar/ })).not.toBeInTheDocument());
  });
});
