import "server-only";
import { redirect } from "next/navigation";
import { ROUTES } from "@/config/routes";
import { apiFetch } from "@/lib/api-client";
import { hasAnyApp, type AppRequirement } from "../model/app-keys";

/** Keys of the apps this restaurant can use right now (core apps, plus every unexpired purchase). */
export async function fetchActiveApps(): Promise<string[]> {
  return apiFetch<string[]>("/billing/active-apps");
}

/**
 * Page guard: a screen that belongs to a store app sends a restaurant that does not have it to the store, which
 * says which app is missing. Hiding the menu entry is not enough — someone can still type the address.
 */
export async function requireApp(requirement: AppRequirement): Promise<void> {
  const active = new Set(await fetchActiveApps());
  if (hasAnyApp(active, requirement)) return;
  redirect(`${ROUTES.appStore}?need=${encodeURIComponent(requirement[0] ?? "")}`);
}
