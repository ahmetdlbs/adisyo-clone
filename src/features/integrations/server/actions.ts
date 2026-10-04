"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/config/routes";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { Integration } from "../model/integration";

function asError(error: unknown, fallback: string): Error {
  return error instanceof ApiError ? new Error(error.message) : new Error(fallback);
}

export async function fetchIntegrations(): Promise<Integration[]> {
  return apiFetch<Integration[]>("/integrations");
}

export async function saveIntegration(provider: string, credentials: Record<string, string>): Promise<Integration> {
  try {
    const integration = await apiFetch<Integration>(`/integrations/${provider}`, { method: "PUT", body: { credentials } });
    revalidatePath(ROUTES.integrationSettings);
    return integration;
  } catch (error) {
    throw asError(error, "Bağlantı bilgileri kaydedilemedi");
  }
}

export async function disconnectIntegration(provider: string): Promise<Integration> {
  try {
    const integration = await apiFetch<Integration>(`/integrations/${provider}`, { method: "DELETE" });
    revalidatePath(ROUTES.integrationSettings);
    return integration;
  } catch (error) {
    throw asError(error, "Bağlantı kaldırılamadı");
  }
}
