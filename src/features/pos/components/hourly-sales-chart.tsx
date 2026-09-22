"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { formatKurus } from "@/lib/money";
import { hourLabel, type HourlySales } from "../model/stats";

const CHART_CONFIG = { amount: { label: "Satış", color: "var(--chart-sales)" } } satisfies ChartConfig;

const toLira = (amount: number) => String(Math.round(amount / 100));

interface HourlySalesChartProps {
  hours: readonly HourlySales[];
  peakHour: HourlySales | null;
}

/** Sales per hour of today, as a smooth gradient-filled curve. The sentence under it says what the curve shows,
 * for people who cannot see it, and doubles as the number the original's chart only ever surfaced on hover. */
export function HourlySalesChart({ hours, peakHour }: HourlySalesChartProps) {
  const summary = peakHour ? `En yoğun saat: ${hourLabel(peakHour.hour)} (${formatKurus(peakHour.amount)})` : "Bugün henüz satış yapılmadı";

  return (
    <div className="flex flex-col gap-3">
      <div role="img" aria-label={`Saatlik satış grafiği. ${summary}`}>
        <ChartContainer config={CHART_CONFIG} className="aspect-auto h-64 w-full">
          <AreaChart data={[...hours]} margin={{ left: 0, right: 8, top: 8 }}>
            <defs>
              <linearGradient id="hourlySalesFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" style={{ stopColor: "var(--color-amount)" }} stopOpacity={0.35} />
                <stop offset="100%" style={{ stopColor: "var(--color-amount)" }} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="hour" tickFormatter={hourLabel} interval={1} tickLine={false} axisLine={false} />
            <YAxis tickFormatter={toLira} tickLine={false} axisLine={false} width={44} />
            <ChartTooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => hourLabel(payload[0]?.payload.hour ?? 0)}
                  formatter={(value, name) => (
                    <div className="flex w-full justify-between gap-4">
                      <span className="text-muted-foreground">{name}</span>
                      <span className="font-mono font-medium text-foreground tabular-nums">{formatKurus(Number(value))}</span>
                    </div>
                  )}
                />
              }
            />
            <Area type="monotone" dataKey="amount" name="Satış" stroke="var(--color-amount)" strokeWidth={3} fill="url(#hourlySalesFill)" dot={false} activeDot={{ r: 5 }} />
          </AreaChart>
        </ChartContainer>
      </div>
      <p className="text-xs text-muted-foreground">{summary}</p>
    </div>
  );
}
