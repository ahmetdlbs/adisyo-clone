import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// `server-only` throws outside the Next.js server bundle; tests run server modules directly.
vi.mock("server-only", () => ({}));

// Screens read which App Store apps are active from a provider that `(app)/layout.tsx` fills. Tests have no layout,
// so this stands in for it with every app on; a test narrows it with `setActiveApps` (tests/support). The real
// provider is tested through `vi.importActual` in tests/features/entitlements.
vi.mock("@/features/entitlements/components/active-apps-provider", async () => {
  const { hasAnyApp } = await import("@/features/entitlements/model/app-keys");
  const { getActiveApps } = await import("./tests/support/active-apps-state");
  return {
    ActiveAppsProvider: ({ children }: { children: unknown }) => children,
    useActiveApps: () => getActiveApps(),
    useHasApp: (requirement: readonly string[]) => hasAnyApp(getActiveApps(), requirement),
  };
});

// jsdom has no layout engine and no ResizeObserver; chart containers (recharts) only need one to exist.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("ResizeObserver", ResizeObserverStub);

// Testing Library only auto-cleans when Vitest globals are on; they are off here.
afterEach(async () => {
  cleanup();
  (await import("./tests/support/active-apps-state")).resetActiveApps();
});
