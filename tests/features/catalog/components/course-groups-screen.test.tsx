import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CourseGroupsScreen } from "@/features/catalog/components/course-groups-screen";
import type { CourseGroup } from "@/features/catalog/model/course-group";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

const actions = vi.hoisted(() => ({ createCourseGroup: vi.fn(), updateCourseGroup: vi.fn(), deleteCourseGroup: vi.fn() }));
vi.mock("@/features/catalog/server/course-group-actions", () => actions);

beforeEach(() => {
  toast.success.mockClear();
  toast.error.mockClear();
  Object.values(actions).forEach((mock) => mock.mockReset());
});

const GROUPS: CourseGroup[] = [
  { id: "1", name: "Ara Sıcak" },
  { id: "2", name: "Ana Yemek" },
  { id: "3", name: "Tatlı" },
];

function setup(groups: readonly CourseGroup[] = GROUPS) {
  render(<CourseGroupsScreen groups={groups} />);
  return { user: userEvent.setup() };
}

async function openDialog() {
  return screen.findByRole("dialog", { name: "Marş Grubu Tanımla" });
}

const nameField = (dialog: HTMLElement) => within(dialog).getByRole("textbox", { name: /Grup Adı/ });

describe("CourseGroupsScreen", () => {
  it("shows the page heading and the given groups", () => {
    setup();

    expect(screen.getByRole("heading", { level: 1, name: "Marş Grupları" })).toBeInTheDocument();
    for (const name of ["Ara Sıcak", "Ana Yemek", "Tatlı"]) {
      expect(screen.getByRole("cell", { name })).toBeInTheDocument();
    }
  });

  it("adds a group through the dialog", async () => {
    actions.createCourseGroup.mockResolvedValue({ id: "4", name: "İçecek" });
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni" }));
    await user.type(nameField(await openDialog()), "İçecek");
    await user.click(screen.getByRole("button", { name: "Ekle" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Marş grubu eklendi"));
    expect(actions.createCourseGroup).toHaveBeenCalledWith({ name: "İçecek" });
  });

  it("explains why an empty name cannot be saved and keeps the dialog open", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni" }));
    await openDialog();
    await user.click(screen.getByRole("button", { name: "Ekle" }));

    expect(await screen.findByText("Grup adı zorunludur")).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Marş Grubu Tanımla" })).toBeInTheDocument();
    expect(actions.createCourseGroup).not.toHaveBeenCalled();
  });

  it("shows the API's reason on the field when the name is already used, and keeps the dialog open", async () => {
    actions.createCourseGroup.mockRejectedValue(new Error("Bu marş grubu zaten tanımlı"));
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni" }));
    await user.type(nameField(await openDialog()), "ana yemek");
    await user.click(screen.getByRole("button", { name: "Ekle" }));

    expect(await screen.findByText("Bu marş grubu zaten tanımlı")).toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Marş Grubu Tanımla" })).toBeInTheDocument();
  });

  it("edits a group with its current name prefilled", async () => {
    actions.updateCourseGroup.mockResolvedValue({ id: "2", name: "Ana Yemekler" });
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Ana Yemek düzenle" }));
    const field = nameField(await openDialog());
    expect(field).toHaveValue("Ana Yemek");
    await user.clear(field);
    await user.type(field, "Ana Yemekler");
    await user.click(screen.getByRole("button", { name: "Güncelle" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Marş grubu güncellendi"));
    expect(actions.updateCourseGroup).toHaveBeenCalledWith("2", { name: "Ana Yemekler" });
  });

  it("starts every new dialog with an empty form, even right after an edit was cancelled", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: "Ara Sıcak düzenle" }));
    await openDialog();
    await user.click(screen.getByRole("button", { name: "Vazgeç" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: "Yeni" }));

    expect(nameField(await openDialog())).toHaveValue("");
  });

  it("asks before deleting and calls the API once confirmed", async () => {
    actions.deleteCourseGroup.mockResolvedValue(undefined);
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Tatlı sil" }));
    // The confirmation is modal, so the table behind it is aria-hidden: query by text, not by role.
    expect(screen.getByText("Tatlı", { selector: "td" })).toBeInTheDocument();
    await user.click(await screen.findByRole("button", { name: "Sil" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Marş grubu silindi"));
    expect(actions.deleteCourseGroup).toHaveBeenCalledWith("3");
  });

  it("shows an error toast when deleting fails", async () => {
    actions.deleteCourseGroup.mockRejectedValue(new Error("Marş grubu silinemedi"));
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Tatlı sil" }));
    await user.click(await screen.findByRole("button", { name: "Sil" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Marş grubu silinemedi"));
  });
});
