import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormSheet } from "@/components/kit/form-sheet";

function setup(props: Partial<React.ComponentProps<typeof FormSheet>> = {}) {
  const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault());
  const onOpenChange = vi.fn();
  render(
    <FormSheet
      open
      onOpenChange={onOpenChange}
      title="Özellik Grubu"
      description="Grup ve özelliklerini düzenleyin."
      onSubmit={onSubmit}
      {...props}
    >
      <input aria-label="Grup adı" />
    </FormSheet>
  );
  return { onSubmit, onOpenChange, user: userEvent.setup() };
}

describe("FormSheet", () => {
  it("shows the title, description and fields in a side panel", () => {
    setup();

    expect(screen.getByRole("dialog", { name: "Özellik Grubu" })).toBeInTheDocument();
    expect(screen.getByText("Grup ve özelliklerini düzenleyin.")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Grup adı" })).toBeInTheDocument();
  });

  it("renders nothing while closed", () => {
    setup({ open: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("submits the form from the footer button and with Enter", async () => {
    const { user, onSubmit } = setup();

    await user.click(screen.getByRole("button", { name: "Kaydet" }));
    await user.type(screen.getByRole("textbox", { name: "Grup adı" }), "x{Enter}");

    expect(onSubmit).toHaveBeenCalledTimes(2);
  });

  it("uses custom labels", () => {
    setup({ submitLabel: "Ekle", cancelLabel: "İptal" });

    expect(screen.getByRole("button", { name: "Ekle" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "İptal" })).toBeInTheDocument();
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
  });
});
