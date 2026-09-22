import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmDialog } from "@/components/kit/confirm-dialog";

function setup(props: Partial<React.ComponentProps<typeof ConfirmDialog>> = {}) {
  const onConfirm = vi.fn();
  const onOpenChange = vi.fn();
  render(
    <ConfirmDialog
      open
      onOpenChange={onOpenChange}
      title="Siparişi sil"
      description="Bu işlem geri alınamaz."
      onConfirm={onConfirm}
      {...props}
    />
  );
  return { onConfirm, onOpenChange, user: userEvent.setup() };
}

describe("ConfirmDialog", () => {
  it("shows the title and description when open", () => {
    setup();

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText("Siparişi sil")).toBeInTheDocument();
    expect(screen.getByText("Bu işlem geri alınamaz.")).toBeInTheDocument();
  });

  it("renders nothing while closed", () => {
    setup({ open: false });

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("uses Turkish default labels", () => {
    setup();

    expect(screen.getByRole("button", { name: "Onayla" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Vazgeç" })).toBeInTheDocument();
  });

  it("accepts custom labels", () => {
    setup({ confirmLabel: "Sil", cancelLabel: "Kalsın" });

    expect(screen.getByRole("button", { name: "Sil" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Kalsın" })).toBeInTheDocument();
  });

  it("confirms and then closes when the confirm button is pressed", async () => {
    const { user, onConfirm, onOpenChange } = setup();

    await user.click(screen.getByRole("button", { name: "Onayla" }));

    expect(onConfirm).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("closes without confirming when cancelled", async () => {
    const { user, onConfirm, onOpenChange } = setup();

    await user.click(screen.getByRole("button", { name: "Vazgeç" }));

    expect(onConfirm).not.toHaveBeenCalled();
    // Base UI passes event details as a second argument, so only the first one is asserted.
    expect(onOpenChange).toHaveBeenCalledOnce();
    expect(onOpenChange.mock.calls[0][0]).toBe(false);
  });

  it("omits the description when none is given", () => {
    setup({ description: undefined });

    expect(screen.queryByText("Bu işlem geri alınamaz.")).not.toBeInTheDocument();
  });
});
