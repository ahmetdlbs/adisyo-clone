"use client";

import React from 'react';
import DashboardView from '@/components/DashboardView';
import { usePosContext } from '@/context/PosContext';

export default function DashboardPage() {
  const { totalOpenOrders } = usePosContext();

  return (
    <DashboardView openOrdersTotal={totalOpenOrders} guestCount={2} />
  );
}
