import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// The real provider, not the all-apps stand-in from vitest.setup.ts.
vi.unmock("@/features/entitlements/components/active-apps-provider");

const real = () => import("@/features/entitlements/components/active-apps-provider");

describe("ActiveAppsProvider", () => {
  it("tells screens which apps are active", async () => {
    const { ActiveAppsProvider, useHasApp } = await real();
    function Probe() {
      return <p>{useHasApp(["mutfak-ekrani"]) ? "kitchen on" : "kitchen off"}</p>;
    }

    render(
      <ActiveAppsProvider keys={["mutfak-ekrani"]}>
        <Probe />
      </ActiveAppsProvider>
    );

    expect(screen.getByText("kitchen on")).toBeInTheDocument();
  });

  it("reports an app that is not in the list as off", async () => {
    const { ActiveAppsProvider, useHasApp } = await real();
    function Probe() {
      return <p>{useHasApp(["mutfak-ekrani"]) ? "kitchen on" : "kitchen off"}</p>;
    }

    render(
      <ActiveAppsProvider keys={["siparis-masa-yonetimi"]}>
        <Probe />
      </ActiveAppsProvider>
    );

    expect(screen.getByText("kitchen off")).toBeInTheDocument();
  });

  it("fails loudly when used outside the provider instead of showing everything", async () => {
    const { useActiveApps } = await real();
    function Probe() {
      useActiveApps();
      return null;
    }
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Probe />)).toThrow("inside <ActiveAppsProvider>");
    spy.mockRestore();
  });
});
