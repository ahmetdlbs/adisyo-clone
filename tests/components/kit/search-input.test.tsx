import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { SearchInput } from "@/components/kit/search-input";

function Controlled({ initial = "", onChange }: { initial?: string; onChange?: (value: string) => void }) {
  const [value, setValue] = useState(initial);
  return (
    <SearchInput
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
      placeholder="Ara..."
    />
  );
}

describe("SearchInput", () => {
  it("is a labelled search box", () => {
    render(<Controlled />);

    expect(screen.getByRole("searchbox", { name: "Ara" })).toHaveAttribute("placeholder", "Ara...");
  });

  it("reports what the user types", async () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);

    await userEvent.type(screen.getByRole("searchbox", { name: "Ara" }), "çay");

    expect(onChange).toHaveBeenLastCalledWith("çay");
  });

  it("offers no clear button while empty", () => {
    render(<Controlled />);

    expect(screen.queryByRole("button", { name: "Aramayı temizle" })).not.toBeInTheDocument();
  });

  it("clears the text and keeps the focus in the box", async () => {
    render(<Controlled initial="çay" />);

    await userEvent.click(screen.getByRole("button", { name: "Aramayı temizle" }));

    const box = screen.getByRole("searchbox", { name: "Ara" });
    expect(box).toHaveValue("");
    expect(box).toHaveFocus();
  });

  it("accepts a custom accessible label", () => {
    render(<SearchInput value="" onValueChange={() => {}} aria-label="Ürün ara" />);

    expect(screen.getByRole("searchbox", { name: "Ürün ara" })).toBeInTheDocument();
  });
});
