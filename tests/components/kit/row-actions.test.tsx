import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RowActions } from "@/components/kit/row-actions";

function setup(props: Partial<React.ComponentProps<typeof RowActions>> = {}) {
  const onEdit = vi.fn();
  const onDelete = vi.fn();
  render(<RowActions name="Öğrenci" onEdit={onEdit} onDelete={onDelete} {...props} />);
  return { onEdit, onDelete, user: userEvent.setup() };
}

describe("RowActions", () => {
  it("edits the row", async () => {
    const { user, onEdit } = setup();

    await user.click(screen.getByRole("button", { name: "Öğrenci düzenle" }));

    expect(onEdit).toHaveBeenCalledOnce();
  });

  it("asks for confirmation instead of deleting immediately", async () => {
    const { user, onDelete } = setup();

    await user.click(screen.getByRole("button", { name: "Öğrenci sil" }));

    expect(await screen.findByRole("alertdialog")).toHaveTextContent("Öğrenci silinsin mi?");
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("deletes once the confirmation is accepted", async () => {
    const { user, onDelete } = setup();
    await user.click(screen.getByRole("button", { name: "Öğrenci sil" }));

    await user.click(await screen.findByRole("button", { name: "Sil" }));

    expect(onDelete).toHaveBeenCalledOnce();
  });

  it("keeps the row when the confirmation is cancelled", async () => {
    const { user, onDelete } = setup();
    await user.click(screen.getByRole("button", { name: "Öğrenci sil" }));

    await user.click(await screen.findByRole("button", { name: "Vazgeç" }));

    expect(onDelete).not.toHaveBeenCalled();
  });

  it("omits the edit button when there is nothing to edit", () => {
    setup({ onEdit: undefined });

    expect(screen.queryByRole("button", { name: "Öğrenci düzenle" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Öğrenci sil" })).toBeInTheDocument();
  });

  it("omits the delete button when deleting is not allowed", () => {
    setup({ onDelete: undefined });

    expect(screen.queryByRole("button", { name: "Öğrenci sil" })).not.toBeInTheDocument();
  });
});
