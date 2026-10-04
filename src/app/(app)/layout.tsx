import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell/app-shell";
import { ShellProvider } from "@/components/shell/ShellContext";
import { ROUTES } from "@/config/routes";
import { ActiveAppsProvider } from "@/features/entitlements/components/active-apps-provider";
import { fetchActiveApps } from "@/features/entitlements/server/active-apps";
import { getSession } from "@/features/auth/server/session";
import { fetchAreas, fetchTables } from "@/features/pos/server/floor-plan-actions";
import { fetchCategories, fetchProducts } from "@/features/pos/server/menu-actions";
import { fetchOpenOrders } from "@/features/pos/server/order-actions";
import { PosProvider } from "@/features/pos/store/pos-provider";

// Providers live here, not in the root layout, so the public auth screens do not pay for them.
export default async function AppLayout({ children }: { children: ReactNode }) {
  // Defence in depth: the proxy already redirects visitors, but this layout must not assume it ran.
  if (!(await getSession())) redirect(ROUTES.login);

  // One shared snapshot for every POS screen below; see PosProvider for how mutations keep it in sync.
  const [areas, tables, categories, products, orders, activeApps] = await Promise.all([
    fetchAreas(),
    fetchTables(),
    fetchCategories(),
    fetchProducts(),
    fetchOpenOrders(),
    fetchActiveApps(),
  ]);

  return (
    <ActiveAppsProvider keys={activeApps}>
      <PosProvider liveSync initial={{ areas, tables, categories, products, orders }}>
        <ShellProvider>
          <AppShell>{children}</AppShell>
        </ShellProvider>
      </PosProvider>
    </ActiveAppsProvider>
  );
}
