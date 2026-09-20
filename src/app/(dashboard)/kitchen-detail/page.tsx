"use client";

import React from 'react';
import KitchenScreenView from '@/components/KitchenScreenView';
import { useRouter } from 'next/navigation';

export default function KitchenDetailPage() {
  const router = useRouter();
  
  return (
    <KitchenScreenView 
      onBack={() => router.back()} 
      onOpenDrawer={() => {}} 
    />
  );
}
