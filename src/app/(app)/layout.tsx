import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell/app-shell";
import { ShellProvider } from "@/components/shell/ShellContext";
import { ROUTES } from "@/config/routes";
import { getSession } from "@/features/auth/server/session";
import { PosProvider } from "@/features/pos/store/pos-provider";

// Providers live here, not in the root layout, so the public auth screens do not pay for them.
export default async function AppLayout({ children }: { children: ReactNode }) {
  // Defence in depth: the proxy already redirects visitors, but this layout must not assume it ran.
  if (!(await getSession())) redirect(ROUTES.login);

  return (
    <PosProvider>
      <ShellProvider>
        <AppShell>{children}</AppShell>
      </ShellProvider>
    </PosProvider>
  );
}
