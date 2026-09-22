"use client";

import type { ReactNode } from "react";
import { NavDrawer } from "./nav-drawer";
import { useShell } from "./ShellContext";
import { TopBar } from "./top-bar";

/** Frame of every signed-in screen: top bar, scrollable page area and the navigation drawer. */
export function AppShell({ children }: { children: ReactNode }) {
  const { isDrawerOpen, openDrawer, closeDrawer } = useShell();

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-canvas">
      <TopBar onMenuClick={openDrawer} />
      <main className="relative z-0 flex-1 overflow-y-auto">{children}</main>
      <NavDrawer open={isDrawerOpen} onOpenChange={(open) => (open ? openDrawer() : closeDrawer())} />
    </div>
  );
}
