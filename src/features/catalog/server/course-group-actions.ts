"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/config/routes";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { CourseGroup, CourseGroupFormValues } from "../model/course-group";

function asError(error: unknown, fallback: string): Error {
  return error instanceof ApiError ? new Error(error.message) : new Error(fallback);
}

export async function createCourseGroup(values: CourseGroupFormValues): Promise<CourseGroup> {
  try {
    const group = await apiFetch<CourseGroup>("/course-groups", { method: "POST", body: values });
    revalidatePath(ROUTES.courseGroups);
    return group;
  } catch (error) {
    throw asError(error, "Marş grubu eklenemedi");
  }
}

export async function updateCourseGroup(id: string, values: CourseGroupFormValues): Promise<CourseGroup> {
  try {
    const group = await apiFetch<CourseGroup>(`/course-groups/${id}`, { method: "PATCH", body: values });
    revalidatePath(ROUTES.courseGroups);
    return group;
  } catch (error) {
    throw asError(error, "Marş grubu güncellenemedi");
  }
}

export async function deleteCourseGroup(id: string): Promise<void> {
  try {
    await apiFetch(`/course-groups/${id}`, { method: "DELETE" });
  } catch (error) {
    throw asError(error, "Marş grubu silinemedi");
  }
  revalidatePath(ROUTES.courseGroups);
}
