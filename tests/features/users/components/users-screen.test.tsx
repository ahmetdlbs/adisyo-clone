import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UsersScreen } from "@/features/users/components/users-screen";
import type { User } from "@/features/users/model/user";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

const actions = vi.hoisted(() => ({ createStaffMember: vi.fn() }));
vi.mock("@/features/users/server/actions", () => actions);

beforeEach(() => {
  toast.success.mockClear();
  actions.createStaffMember.mockReset();
});

const AHMET: User = {
  id: "u1",
  no: 1,
  name: "Ahmet Can",
  email: "ahmet@example.com",
  phone: "0532 111 22 33",
  role: "Yönetici",
  region: "",
  callerId: false,
  blockLogin: false,
  usePin: false,
  lastLogin: "20.09.2026 13:27",
};

function setup(users: User[] = []) {
  render(<UsersScreen users={users} />);
  return userEvent.setup();
}

const openAdd = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { name: "Ekle" }));
  return within(await screen.findByRole("dialog", { name: "Kullanıcı Ekle" }));
};

describe("UsersScreen", () => {
  it("counts the users and lists their fields", () => {
    setup([AHMET]);

    expect(screen.getByRole("heading", { level: 1, name: "Kullanıcılar" })).toBeInTheDocument();
    expect(screen.getByText("Kullanıcı Sayısı : 1")).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /Ahmet Can/ })).toHaveTextContent("Yönetici");
    expect(screen.getByRole("row", { name: /Ahmet Can/ })).toHaveTextContent("20.09.2026 13:27");
  });

  it("shows a placeholder for a user who never signed in", () => {
    setup([{ ...AHMET, lastLogin: null }]);

    expect(screen.getByRole("row", { name: /Ahmet Can/ })).toHaveTextContent("- / -");
  });

  it("calls createStaffMember with the entered values and shows a success toast", async () => {
    actions.createStaffMember.mockResolvedValue(AHMET);
    const user = setup();

    const dialog = await openAdd(user);
    await user.type(dialog.getByRole("textbox", { name: "Ad Soyad" }), "Zeynep Aksoy");
    await user.type(dialog.getByRole("textbox", { name: "Telefon Numarası" }), "0533 444 55 66");
    await user.type(dialog.getByLabelText("Şifre"), "gizli123");
    await user.click(dialog.getByRole("button", { name: "Ekle" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Kullanıcı eklendi"));
    expect(actions.createStaffMember).toHaveBeenCalledWith(expect.objectContaining({ name: "Zeynep Aksoy", phone: "0533 444 55 66" }));
  });

  it("says what is missing, never calling createStaffMember", async () => {
    const user = setup();

    const dialog = await openAdd(user);
    await user.click(dialog.getByRole("button", { name: "Ekle" }));

    expect(await screen.findByText("Ad Soyad zorunludur")).toBeInTheDocument();
    expect(screen.getByText("Telefon numarası zorunludur")).toBeInTheDocument();
    expect(screen.getByText("Şifre en az 4 karakter olmalıdır")).toBeInTheDocument();
    expect(actions.createStaffMember).not.toHaveBeenCalled();
  });

  it("shows the API's reason on the field when the phone number is already used", async () => {
    actions.createStaffMember.mockRejectedValue(new Error("Bu telefon numarası başka bir kullanıcıda kayıtlı"));
    const user = setup([AHMET]);

    const dialog = await openAdd(user);
    await user.type(dialog.getByRole("textbox", { name: "Ad Soyad" }), "Zeynep Aksoy");
    await user.type(dialog.getByRole("textbox", { name: "Telefon Numarası" }), "0532 111 22 33");
    await user.type(dialog.getByLabelText("Şifre"), "gizli123");
    await user.click(dialog.getByRole("button", { name: "Ekle" }));

    expect(await screen.findByText("Bu telefon numarası başka bir kullanıcıda kayıtlı")).toBeInTheDocument();
  });

  it("can turn the login-blocked and pin switches on and includes them in the call", async () => {
    actions.createStaffMember.mockResolvedValue(AHMET);
    const user = setup();

    const dialog = await openAdd(user);
    expect(dialog.getByRole("switch", { name: "Kullanıcı Girişi Engellensin" })).not.toBeChecked();

    await user.click(dialog.getByRole("switch", { name: "Kullanıcı Girişi Engellensin" }));
    await user.click(dialog.getByRole("switch", { name: "Pin Kullanılsın" }));
    await user.type(dialog.getByRole("textbox", { name: "Ad Soyad" }), "Zeynep Aksoy");
    await user.type(dialog.getByRole("textbox", { name: "Telefon Numarası" }), "0533 444 55 66");
    await user.type(dialog.getByLabelText("Şifre"), "gizli123");
    await user.click(dialog.getByRole("button", { name: "Ekle" }));

    await waitFor(() =>
      expect(actions.createStaffMember).toHaveBeenCalledWith(expect.objectContaining({ blockLogin: true, usePin: true }))
    );
  });
});
