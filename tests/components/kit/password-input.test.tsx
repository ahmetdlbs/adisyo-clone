import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasswordInput } from "@/components/kit/password-input";

function setup(props: Partial<React.ComponentProps<typeof PasswordInput>> = {}) {
  render(<PasswordInput aria-label="Şifre" {...props} />);
  return { user: userEvent.setup(), input: screen.getByLabelText("Şifre") };
}

describe("PasswordInput", () => {
  it("hides the typed characters by default", () => {
    const { input } = setup();

    expect(input).toHaveAttribute("type", "password");
    expect(screen.getByRole("button", { name: "Şifreyi göster" })).toHaveAttribute("aria-pressed", "false");
  });

  it("reveals the password when the toggle is pressed and hides it again", async () => {
    const { user, input } = setup();

    await user.click(screen.getByRole("button", { name: "Şifreyi göster" }));
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Şifreyi gizle" })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Şifreyi gizle" }));
    expect(input).toHaveAttribute("type", "password");
  });

  it("never submits the enclosing form when the toggle is pressed", async () => {
    let submitted = false;
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitted = true;
        }}
      >
        <PasswordInput aria-label="Şifre" />
      </form>
    );

    await userEvent.click(screen.getByRole("button", { name: "Şifreyi göster" }));

    expect(submitted).toBe(false);
  });

  it("keeps the typed value when toggling visibility", async () => {
    const { user, input } = setup();

    await user.type(input, "gizli-123");
    await user.click(screen.getByRole("button", { name: "Şifreyi göster" }));

    expect(input).toHaveValue("gizli-123");
  });

  it("passes native attributes through to the input", () => {
    const { input } = setup({ name: "password", autoComplete: "current-password", placeholder: "Şifre" });

    expect(input).toHaveAttribute("name", "password");
    expect(input).toHaveAttribute("autocomplete", "current-password");
    expect(input).toHaveAttribute("placeholder", "Şifre");
  });
});
