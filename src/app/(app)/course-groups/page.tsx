import type { Metadata } from "next";
import { CourseGroupsScreen } from "@/features/catalog/components/course-groups-screen";
import type { CourseGroup } from "@/features/catalog/model/course-group";
import { apiFetch } from "@/lib/api-client";

export const metadata: Metadata = { title: "Marş Grupları" };

export default async function CourseGroupsPage() {
  const groups = await apiFetch<CourseGroup[]>("/course-groups");
  return <CourseGroupsScreen groups={groups} />;
}
