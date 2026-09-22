"use client";

import Link from "next/link";
import { Pie, PieChart } from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { ROUTES } from "@/config/routes";
import type { Occupancy } from "../model/stats";

const CHART_CONFIG = {
  occupied: { label: "Dolu", color: "var(--chart-sales)" },
  free: { label: "Boş", color: "var(--muted)" },
} satisfies ChartConfig;

/** Share of tables in use, as a ring with the same numbers spelled out beside it. */
export function OccupancyCard({ occupancy }: { occupancy: Occupancy }) {
  const { occupied, free, total, percent } = occupancy;

  if (total === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-2 text-center text-xs text-muted-foreground">
        <span>Tanımlı masa yok</span>
        <Link href={ROUTES.tableAreaDefinition} className="font-medium text-primary hover:underline">
          Masa / Bölge Tanımla
        </Link>
      </div>
    );
  }

  const data = [
    { name: "occupied", value: occupied, fill: "var(--color-occupied)" },
    { name: "free", value: free, fill: "var(--color-free)" },
  ];

  return (
    <div className="flex h-40 items-center justify-center gap-8">
      <div role="img" aria-label={`Masa doluluğu %${percent}`} className="relative size-28">
        <ChartContainer config={CHART_CONFIG} className="aspect-square size-full">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={-270} strokeWidth={0} isAnimationActive={false} />
          </PieChart>
        </ChartContainer>
        <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-bold text-foreground">%{percent}</span>
          <span className="text-[9px] text-muted-foreground">Dolu</span>
        </div>
      </div>
      <ul className="flex flex-col gap-2 text-xs">
        <Legend swatchClassName="bg-chart-sales" text={`Dolu Masalar: ${occupied} adet (%${percent})`} />
        <Legend swatchClassName="bg-muted" text={`Boş Masalar: ${free} adet (%${100 - percent})`} />
      </ul>
    </div>
  );
}

function Legend({ swatchClassName, text }: { swatchClassName: string; text: string }) {
  return (
    <li className="flex items-center gap-2 text-foreground">
      <span aria-hidden="true" className={`size-3 rounded-full ${swatchClassName}`} />
      {text}
    </li>
  );
}
