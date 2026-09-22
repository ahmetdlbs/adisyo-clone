import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SupportMenu } from "@/features/auth/components/support-menu";

describe("SupportMenu", () => {
  it("offers a phone number that dials when followed", async () => {
    render(<SupportMenu />);

    await userEvent.click(screen.getByRole("button", { name: "Destek İste" }));

    expect(await screen.findByRole("menuitem", { name: "+90 (216) 706 06 24" })).toHaveAttribute(
      "href",
      "tel:+902167060624"
    );
  });

  it("opens remote support in a new tab without leaking the opener", async () => {
    render(<SupportMenu />);

    await userEvent.click(screen.getByRole("button", { name: "Destek İste" }));

    const link = await screen.findByRole("menuitem", { name: "Uzak Bağlantı" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
