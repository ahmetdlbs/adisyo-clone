import React from 'react';
import MainLayout from '@/components/MainLayout';

export default function PosLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
}
