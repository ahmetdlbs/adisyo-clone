"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/config/routes";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { ProfileFormValues } from "../model/profile";

function asError(error: unknown, fallback: string): Error {
  return error instanceof ApiError ? new Error(error.message) : new Error(fallback);
}

/** The profile as the API returns it: the PIN is stored hashed, so only whether one is set comes back. */
type ApiProfile = Omit<ProfileFormValues, "pin"> & { hasPin: boolean };

export interface LoadedProfile {
  /** Form values; `pin` is always blank — it is never sent back. */
  values: ProfileFormValues;
  hasPin: boolean;
}

const toLoaded = ({ hasPin, ...rest }: ApiProfile): LoadedProfile => ({ values: { ...rest, pin: "" }, hasPin });

export async function fetchProfile(): Promise<LoadedProfile> {
  return toLoaded(await apiFetch<ApiProfile>("/profile"));
}

/**
 * Saves the profile. A blank `pin` keeps the current PIN; `removePin` clears it; digits replace it.
 */
export async function updateProfile(values: ProfileFormValues, options: { removePin?: boolean } = {}): Promise<LoadedProfile> {
  try {
    const { pin, ...rest } = values;
    const body = { ...rest, ...(options.removePin ? { pin: "" } : pin !== "" ? { pin } : {}) };
    const profile = await apiFetch<ApiProfile>("/profile", { method: "PATCH", body });
    revalidatePath(ROUTES.profile);
    return toLoaded(profile);
  } catch (error) {
    throw asError(error, "Profil güncellenemedi");
  }
}
