import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormDialog } from "@/components/kit/form-dialog";

function setup(props: Partial<React.ComponentProps<typeof FormDialog>> = {}) {
  const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault());
  const onOpenChange = vi.fn();
  render(
    <FormDialog
      open
      onOpenChange={onOpenChange}
      title="Birim Tanımla"
      description="Yeni birim bilgilerini giriniz."
      onSubmit={onSubmit}
      {...props}
    >
      <input aria-label="Birim adı" />
    </FormDialog>
  );
  return { onSubmit, onOpenChange, user: userEvent.setup() };
}

describe("FormDialog", () => {
  it("shows the title, description and fields", () => {
    setup();

    expect(screen.getByRole("dialog", { name: "Birim Tanımla" })).toBeInTheDocument();
    expect(screen.getByText("Yeni birim bilgilerini giriniz.")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Birim adı" })).toBeInTheDocument();
  });

  it("renders nothing while closed", () => {
    setup({ open: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("submits the form from the submit button", async () => {
    const { user, onSubmit } = setup();

    await user.click(screen.getByRole("button", { name: "Kaydet" }));

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("submits with Enter from inside a field", async () => {
    const { user, onSubmit } = setup();

    await user.type(screen.getByRole("textbox", { name: "Birim adı" }), "Tam{Enter}");

    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it("uses a custom submit label", () => {
    setup({ submitLabel: "Ekle" });

    expect(screen.getByRole("button", { name: "Ekle" })).toBeInTheDocument();
  });

  it("closes without submitting when cancelled", async () => {
    const { user, onSubmit, onOpenChange } = setup();

    await user.click(screen.getByRole("button", { name: "Vazgeç" }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(onOpenChange.mock.calls[0]?.[0]).toBe(false);
  });

  it("blocks a second submit while one is in flight", () => {
    setup({ isSubmitting: true });

    expect(screen.getByRole("button", { name: /Kaydet/ })).toBeDisabled();
    expect(screen.getByRole("status", { name: "Yükleniyor" })).toBeInTheDocument();
  });
});
