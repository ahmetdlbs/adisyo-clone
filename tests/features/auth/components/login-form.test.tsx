import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { LoginState } from "@/features/auth/model/login";
import { LoginForm } from "@/features/auth/components/login-form";

const loginAction = vi.hoisted(() => vi.fn<(previous: LoginState, formData: FormData) => Promise<LoginState>>());
vi.mock("@/features/auth/server/actions", () => ({ loginAction }));

beforeEach(() => {
  loginAction.mockReset();
  loginAction.mockResolvedValue({});
});

function setup(next = "/dashboard") {
  render(<LoginForm next={next} />);
  return { user: userEvent.setup() };
}

async function submit(user: ReturnType<typeof userEvent.setup>, { username = "", password = "" } = {}) {
  if (username) await user.type(screen.getByLabelText(/Kullanıcı adı/), username);
  if (password) await user.type(screen.getByLabelText("Şifre"), password);
  await user.click(screen.getByRole("button", { name: "Giriş Yap" }));
}

const lastFormData = () => loginAction.mock.calls.at(-1)?.[1] as FormData;

describe("LoginForm", () => {
  it("greets the user and offers the other auth pages", () => {
    setup();

    expect(screen.getByRole("heading", { level: 1, name: "Adisyon Merkezi'ne hoş geldiniz" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Şifremi unuttum" })).toHaveAttribute("href", "/forgot-password");
    expect(screen.getByRole("link", { name: /Şimdi Kaydolun/ })).toHaveAttribute("href", "/register");
  });

  it("sends the typed credentials and the destination to the server action", async () => {
    const { user } = setup("/orders");

    await submit(user, { username: "demo", password: "gizli" });

    await waitFor(() => expect(loginAction).toHaveBeenCalledOnce());
    expect(lastFormData().get("username")).toBe("demo");
    expect(lastFormData().get("password")).toBe("gizli");
    expect(lastFormData().get("next")).toBe("/orders");
  });

  it("shows the wrong-credentials message as an alert", async () => {
    loginAction.mockResolvedValue({ message: "Kullanıcı adı veya şifre hatalı.", username: "demo" });
    const { user } = setup();

    await submit(user, { username: "demo", password: "yanlis" });

    expect(await screen.findByRole("alert")).toHaveTextContent("Kullanıcı adı veya şifre hatalı.");
  });

  it("keeps the typed username after a failed attempt but clears the password", async () => {
    loginAction.mockResolvedValue({ message: "Kullanıcı adı veya şifre hatalı.", username: "demo" });
    const { user } = setup();

    await submit(user, { username: "demo", password: "yanlis" });
    await screen.findByRole("alert");

    expect(screen.getByLabelText(/Kullanıcı adı/)).toHaveValue("demo");
    expect(screen.getByLabelText("Şifre")).toHaveValue("");
  });

  it("marks the offending fields when the server rejects empty input", async () => {
    loginAction.mockResolvedValue({
      fieldErrors: { username: "Boş geçilemez", password: "Lütfen şifrenizi giriniz" },
      username: "",
    });
    const { user } = setup();

    await submit(user);

    expect(await screen.findByText("Boş geçilemez")).toBeInTheDocument();
    expect(screen.getByText("Lütfen şifrenizi giriniz")).toBeInTheDocument();
    expect(screen.getByLabelText(/Kullanıcı adı/)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Şifre")).toHaveAttribute("aria-invalid", "true");
  });

  it("blocks a second submit while the first one is in flight", async () => {
    let finish: (state: LoginState) => void = () => {};
    loginAction.mockReturnValue(new Promise<LoginState>((resolve) => (finish = resolve)));
    const { user } = setup();

    await submit(user, { username: "demo", password: "gizli" });

    expect(screen.getByRole("button", { name: /Giriş Yap/ })).toBeDisabled();
    finish({});
    await waitFor(() => expect(screen.getByRole("button", { name: /Giriş Yap/ })).toBeEnabled());
  });
});
