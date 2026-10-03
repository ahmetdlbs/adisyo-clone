import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegisterForm } from "@/features/auth/components/register-form";

const router = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock("next/navigation", () => ({ useRouter: () => router }));

beforeEach(() => router.push.mockClear());

function setup() {
  render(<RegisterForm />);
  return { user: userEvent.setup() };
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/Restoran Adı/), "Lezzet Durağı");
  await user.type(screen.getByLabelText(/İsim Soyisim/), "Ahmet Yılmaz");
  await user.type(screen.getByLabelText(/Mail Adresiniz/), "ahmet@lezzet.test");
  await user.type(screen.getByLabelText(/Cep Telefonu/), "532 111 22 33");
  await user.type(screen.getByLabelText("Şifre"), "Sifre1234");
  await user.type(screen.getByLabelText("Şifre Tekrar"), "Sifre1234");
  await user.click(screen.getByRole("checkbox", { name: /okudum, kabul ediyorum/ }));
}

const submit = (user: ReturnType<typeof userEvent.setup>) => user.click(screen.getByRole("button", { name: "Kayıt Ol" }));

describe("RegisterForm", () => {
  it("greets the visitor and links back to login", () => {
    setup();

    expect(screen.getByRole("heading", { level: 1, name: "Adisyon Merkezi'ne hoş geldiniz" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Giriş Yap" })).toHaveAttribute("href", "/login");
  });

  it("does not continue while required fields are empty, and says what is missing", async () => {
    const { user } = setup();

    await submit(user);

    expect(await screen.findByText("Restoran adı en az 2 karakter olmalıdır")).toBeInTheDocument();
    expect(screen.getByText("Ad soyad zorunludur")).toBeInTheDocument();
    expect(screen.getByText("E-posta zorunludur")).toBeInTheDocument();
    expect(screen.getByText("Geçerli bir telefon numarası giriniz")).toBeInTheDocument();
    expect(screen.getByText("Şifre en az 8 karakter olmalıdır")).toBeInTheDocument();
    expect(screen.getByText("Devam etmek için sözleşmeyi kabul etmelisiniz")).toBeInTheDocument();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("catches a password confirmation that does not match", async () => {
    const { user } = setup();
    await fillValidForm(user);
    await user.clear(screen.getByLabelText("Şifre Tekrar"));
    await user.type(screen.getByLabelText("Şifre Tekrar"), "Baska1234");

    await submit(user);

    expect(await screen.findByText("Şifreler eşleşmiyor")).toBeInTheDocument();
    expect(router.push).not.toHaveBeenCalled();
  });

  it("continues to onboarding once everything is valid", async () => {
    const { user } = setup();
    await fillValidForm(user);

    await submit(user);

    await waitFor(() => expect(router.push).toHaveBeenCalledExactlyOnceWith("/onboarding"));
  });

  it("can reveal the typed password", async () => {
    const { user } = setup();

    await user.click(screen.getAllByRole("button", { name: "Şifreyi göster" })[0]!);

    expect(screen.getByLabelText("Şifre")).toHaveAttribute("type", "text");
  });
});
