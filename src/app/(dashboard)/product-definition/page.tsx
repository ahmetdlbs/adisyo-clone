"use client";

import React, { useState } from 'react';
import ProductDefinitionView from '@/components/ProductDefinitionView';
import { INITIAL_PRODUCTS } from '@/data/posData';

export default function ProductDefinitionPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <ProductDefinitionView 
      products={INITIAL_PRODUCTS} 
      onOpenDrawer={() => setDrawerOpen(true)} 
    />
  );
}
