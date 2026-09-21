"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { useShell } from '@/components/shell/ShellContext';
import TopHeader from '@/components/TopHeader';
import SideDrawer from '@/components/SideDrawer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isDrawerOpen, openDrawer, closeDrawer } = useShell();
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#edf0f5]">
      {/* Top Header */}
      <TopHeader onToggleMenu={openDrawer} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative z-0">
        {children}
      </main>

      {/* Original Side Drawer */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
      />
    </div>
  );
}
