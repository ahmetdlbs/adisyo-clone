import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PaidlessesScreen } from "@/features/customers/components/paidlesses-screen";
import type { Paidless } from "@/features/customers/model/paidless";
import { UNAVAILABLE_MESSAGE } from "@/lib/notify";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

const actions = vi.hoisted(() => ({ createPaidless: vi.fn(), updatePaidless: vi.fn(), deletePaidless: vi.fn() }));
vi.mock("@/features/customers/server/paidless-actions", () => actions);

beforeEach(() => {
  Object.values(toast).forEach((mock) => mock.mockClear());
  Object.values(actions).forEach((mock) => mock.mockReset());
});

const MEHMET: Paidless = { id: "p1", no: 10000000, firstName: "Mehmet", lastName: "Öz", title: "Müdür" };
const ZEYNEP: Paidless = { id: "p2", no: 10000001, firstName: "Zeynep", lastName: "Aksoy", title: "" };

const setup = (items: Paidless[] = []) => {
  render(<PaidlessesScreen items={items} />);
  return userEvent.setup();
};

const openAdd = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { name: "Ekle" }));
  return within(await screen.findByRole("dialog", { name: "Ödenmez Ekle" }));
};

describe("PaidlessesScreen", () => {
  it("counts the people and lists them with number, name and title", () => {
    setup([MEHMET, ZEYNEP]);

    expect(screen.getByRole("heading", { level: 1, name: "Ödenmezler" })).toBeInTheDocument();
    expect(screen.getByTestId("page-header-description")).toHaveTextContent("Ödenmez Sayısı: 2");
    expect(screen.getByRole("row", { name: /Mehmet Öz/ })).toHaveTextContent("#10000000");
    expect(screen.getByRole("row", { name: /Mehmet Öz/ })).toHaveTextContent("Müdür");
    expect(screen.getByRole("row", { name: /Zeynep Aksoy/ })).toHaveTextContent("-");
  });

  it("says there is nobody yet", () => {
    setup();

    expect(screen.getByText("Hiç ödenmez kaydı bulunamadı.")).toBeInTheDocument();
  });

  it("searches by name or number and says when nothing matched", async () => {
    const user = setup([MEHMET, ZEYNEP]);
    const search = screen.getByRole("searchbox", { name: "Ödenmez Arama" });

    await user.type(search, "zeynep");
    expect(screen.queryByRole("row", { name: /Mehmet/ })).not.toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "#10000000");
    expect(screen.getByRole("row", { name: /Mehmet/ })).toBeInTheDocument();
    expect(screen.queryByRole("row", { name: /Zeynep/ })).not.toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "yok");
    expect(screen.getByText("Arama kriterlerine uygun kayıt bulunamadı.")).toBeInTheDocument();
  });

  it("calls createPaidless with the entered values and shows a success toast", async () => {
    actions.createPaidless.mockResolvedValue(MEHMET);
    const user = setup([MEHMET]);

    const dialog = await openAdd(user);
    await user.type(dialog.getByRole("textbox", { name: /^Ad/ }), "Can");
    await user.type(dialog.getByRole("textbox", { name: "Unvan" }), "Garson");
    await user.click(dialog.getByRole("button", { name: "Ekle" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Ödenmez eklendi"));
    expect(actions.createPaidless).toHaveBeenCalledWith(expect.objectContaining({ firstName: "Can", title: "Garson" }));
  });

  it("asks for a first name, never calling createPaidless", async () => {
    const user = setup();

    const dialog = await openAdd(user);
    await user.click(dialog.getByRole("button", { name: "Ekle" }));

    expect(await screen.findByText("Ad zorunludur")).toBeInTheDocument();
    expect(actions.createPaidless).not.toHaveBeenCalled();
  });

  it("shows the API's reason on the field when the person is already listed", async () => {
    actions.createPaidless.mockRejectedValue(new Error("Bu kişi zaten kayıtlı"));
    const user = setup([MEHMET]);

    const dialog = await openAdd(user);
    await user.type(dialog.getByRole("textbox", { name: /^Ad/ }), "mehmet");
    await user.type(dialog.getByRole("textbox", { name: "Soyad" }), "öz");
    await user.click(dialog.getByRole("button", { name: "Ekle" }));

    expect(await screen.findByText("Bu kişi zaten kayıtlı")).toBeInTheDocument();
  });

  it("edits a person with their values filled in and calls updatePaidless", async () => {
    actions.updatePaidless.mockResolvedValue(MEHMET);
    const user = setup([MEHMET]);

    await user.click(screen.getByRole("button", { name: "Mehmet Öz düzenle" }));
    const dialog = within(await screen.findByRole("dialog", { name: "Ödenmez Ekle" }));
    expect(dialog.getByRole("textbox", { name: "Unvan" })).toHaveValue("Müdür");
    await user.clear(dialog.getByRole("textbox", { name: "Unvan" }));
    await user.type(dialog.getByRole("textbox", { name: "Unvan" }), "Sahip");
    await user.click(dialog.getByRole("button", { name: "Güncelle" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Ödenmez güncellendi"));
    expect(actions.updatePaidless).toHaveBeenCalledWith("p1", expect.objectContaining({ title: "Sahip" }));
  });

  it("deletes a person after confirming", async () => {
    actions.deletePaidless.mockResolvedValue(undefined);
    const user = setup([MEHMET, ZEYNEP]);

    await user.click(screen.getByRole("button", { name: "Mehmet Öz sil" }));
    await user.click(await screen.findByRole("button", { name: "Sil" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Ödenmez silindi"));
    expect(actions.deletePaidless).toHaveBeenCalledWith("p1");
  });

  it("tells the user that download and transfer are not available yet", async () => {
    const user = setup();

    await user.click(screen.getByRole("button", { name: "İndir" }));
    await user.click(screen.getByRole("button", { name: "Kullanıcıları Aktar" }));

    expect(toast.info).toHaveBeenCalledTimes(2);
    expect(toast.info).toHaveBeenCalledWith(UNAVAILABLE_MESSAGE);
  });

  it("pages a long list", async () => {
    const many = Array.from({ length: 11 }, (_, index): Paidless => ({ ...MEHMET, id: `p${index}`, no: 10000000 + index, firstName: `Kişi${index}`, lastName: "" }));
    const user = setup(many);

    expect(screen.getAllByRole("row")).toHaveLength(1 + 10);
    await user.click(screen.getByRole("button", { name: "Sonraki sayfa" }));
    expect(screen.getAllByRole("row")).toHaveLength(1 + 1);
  });
});
