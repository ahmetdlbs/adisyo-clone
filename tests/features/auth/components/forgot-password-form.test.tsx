import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

function setup() {
  render(<ForgotPasswordForm />);
  return { user: userEvent.setup() };
}

const submit = (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole("button", { name: "Şifre Sıfırlama Bağlantısı Gönder" }));

describe("ForgotPasswordForm", () => {
  it("explains what will happen and links back to login", () => {
    setup();

    expect(screen.getByRole("heading", { level: 1, name: "Şifremi Unuttum" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Giriş ekranına dön" })).toHaveAttribute("href", "/login");
  });

  it("asks for the e-mail address when it is left empty", async () => {
    const { user } = setup();

    await submit(user);

    expect(await screen.findByText("E-posta zorunludur")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("rejects something that is not an e-mail address", async () => {
    const { user } = setup();

    await user.type(screen.getByLabelText("E-posta adresiniz"), "ahmet");
    await submit(user);

    expect(await screen.findByText("Geçerli bir e-posta adresi giriniz")).toBeInTheDocument();
  });

  it("confirms with a status message and hides the form after a valid request", async () => {
    const { user } = setup();

    await user.type(screen.getByLabelText("E-posta adresiniz"), "ahmet@lezzet.test");
    await submit(user);

    expect(await screen.findByRole("status")).toHaveTextContent("E-posta gönderildi");
    expect(screen.queryByLabelText("E-posta adresiniz")).not.toBeInTheDocument();
  });
});
