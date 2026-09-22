import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthLayout } from "@/features/auth/components/auth-layout";

describe("AuthLayout", () => {
  it("shows the form column with the brand link and support menu, next to the aside", () => {
    render(
      <AuthLayout aside={<div>Yan panel</div>}>
        <p>Form içeriği</p>
      </AuthLayout>
    );

    expect(screen.getByText("Form içeriği")).toBeInTheDocument();
    expect(screen.getByText("Yan panel")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Adisyo" })).toHaveAttribute("href", "https://adisyo.com");
    expect(screen.getByRole("button", { name: "Destek İste" })).toBeInTheDocument();
  });

  it("opens the brand link safely in a new tab", () => {
    render(
      <AuthLayout aside={null}>
        <p>Form</p>
      </AuthLayout>
    );

    const link = screen.getByRole("link", { name: "Adisyo" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
