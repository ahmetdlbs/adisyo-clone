"use client";

import React from 'react';
import TableAreaDefinitionView from '@/components/TableAreaDefinitionView';
import { usePosContext } from '@/context/PosContext';
import { useShell } from '@/components/shell/ShellContext';
import { useRouter } from 'next/navigation';

export default function TableAreaDefinitionPage() {
  const { tables, setActiveTableId, setActiveOrderType } = usePosContext();
  const { openDrawer } = useShell();
  const router = useRouter();

  return (
    <TableAreaDefinitionView
      tables={tables}
      onOpenDrawer={openDrawer}
      onSelectTable={(tbl) => {
        setActiveTableId(tbl.id);
        setActiveOrderType("table");
        router.push("/orders");
      }}
    />
  );
}
