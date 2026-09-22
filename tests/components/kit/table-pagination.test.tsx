import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TablePagination } from "@/components/kit/table-pagination";

describe("TablePagination", () => {
  it("says which page of how many the list is on", () => {
    render(<TablePagination page={2} pageCount={5} onPageChange={() => {}} />);

    expect(screen.getByRole("navigation", { name: "Sayfalama" })).toHaveTextContent("2 / 5");
  });

  it("asks for the previous and the next page", async () => {
    const onPageChange = vi.fn();
    render(<TablePagination page={2} pageCount={5} onPageChange={onPageChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Önceki sayfa" }));
    await userEvent.click(screen.getByRole("button", { name: "Sonraki sayfa" }));

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
  });

  it("cannot go back from the first page", () => {
    render(<TablePagination page={1} pageCount={3} onPageChange={() => {}} />);

    expect(screen.getByRole("button", { name: "Önceki sayfa" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Sonraki sayfa" })).toBeEnabled();
  });

  it("cannot go forward from the last page", () => {
    render(<TablePagination page={3} pageCount={3} onPageChange={() => {}} />);

    expect(screen.getByRole("button", { name: "Sonraki sayfa" })).toBeDisabled();
  });

  it("shows a single page with both buttons off", () => {
    render(<TablePagination page={1} pageCount={1} onPageChange={() => {}} />);

    expect(screen.getByRole("navigation", { name: "Sayfalama" })).toHaveTextContent("1 / 1");
    expect(screen.getByRole("button", { name: "Önceki sayfa" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Sonraki sayfa" })).toBeDisabled();
  });
});
