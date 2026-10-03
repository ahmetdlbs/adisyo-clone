import type { Metadata } from "next";
import { ProfileScreen } from "@/features/profile/components/profile-screen";
import { fetchProfile } from "@/features/profile/server/actions";

export const metadata: Metadata = { title: "Profil" };

export default async function ProfilePage() {
  const { values, hasPin } = await fetchProfile();
  return <ProfileScreen initialProfile={values} hasPin={hasPin} />;
}
