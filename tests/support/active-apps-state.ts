import { APP_KEYS } from "@/features/entitlements/model/app-keys";

/** Every app a restaurant can have: the default in tests, so screens render in full unless a test narrows it. */
export const ALL_APP_KEYS: readonly string[] = Object.values(APP_KEYS);

let active: ReadonlySet<string> = new Set(ALL_APP_KEYS);

/** Narrow (or widen) what the faked <ActiveAppsProvider> reports for the rest of the current test. */
export function setActiveApps(keys: readonly string[]): void {
  active = new Set(keys);
}

export const getActiveApps = (): ReadonlySet<string> => active;

export function resetActiveApps(): void {
  active = new Set(ALL_APP_KEYS);
}
