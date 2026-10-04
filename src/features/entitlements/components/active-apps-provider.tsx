"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { hasAnyApp, type AppRequirement } from "../model/app-keys";

const ActiveAppsContext = createContext<ReadonlySet<string> | null>(null);

/** Seeded by `(app)/layout.tsx` on every request, so buying an app shows up on the next navigation. */
export function ActiveAppsProvider({ keys, children }: { keys: readonly string[]; children: ReactNode }) {
  const active = useMemo(() => new Set(keys), [keys]);
  return <ActiveAppsContext.Provider value={active}>{children}</ActiveAppsContext.Provider>;
}

export function useActiveApps(): ReadonlySet<string> {
  const active = useContext(ActiveAppsContext);
  if (!active) throw new Error("useActiveApps must be used inside <ActiveAppsProvider>");
  return active;
}

/** True when any of the given apps is active. */
export function useHasApp(requirement: AppRequirement): boolean {
  return hasAnyApp(useActiveApps(), requirement);
}
