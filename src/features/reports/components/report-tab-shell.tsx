"use client";

import type { ReactNode } from "react";
import { PageContainer } from "@/components/kit/page";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface ReportTab {
  id: string;
  label: string;
}

interface ReportTabShellProps {
  title: string;
  tabs: readonly ReportTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: ReactNode;
}

/** Title + tab bar shared by every report screen; the active tab's content is passed as `children`. */
export function ReportTabShell({ title, tabs, activeTab, onTabChange, children }: ReportTabShellProps) {
  return (
    <PageContainer className="max-w-6xl gap-6">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>

      <Tabs value={activeTab} onValueChange={(value) => onTabChange(String(value))}>
        <TabsList variant="line" className="h-auto flex-wrap justify-start">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {children}
    </PageContainer>
  );
}

/** What a tab shows when its report type has no data source anywhere in this demo — never a fabricated zero. */
export function NoReportData() {
  return <div className="rounded-lg border bg-muted/30 p-10 text-center text-sm text-muted-foreground">Bu rapor için örnek veri bulunmuyor.</div>;
}
