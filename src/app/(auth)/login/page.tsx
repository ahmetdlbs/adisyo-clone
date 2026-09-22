import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { LoginForm } from "@/features/auth/components/login-form";
import { safeRedirectPath } from "@/features/auth/model/access";

export const metadata: Metadata = { title: "Giriş Yap" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;

  // `next` comes from the URL, so it is validated on the server before the form ever sees it.
  return (
    <AuthLayout>
      <LoginForm next={safeRedirectPath(next)} />
    </AuthLayout>
  );
}
