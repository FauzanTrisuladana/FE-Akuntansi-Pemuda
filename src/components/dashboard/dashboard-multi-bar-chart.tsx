import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import type { RekonsiliasiRecord } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  sistem: {
    label: "Sistem",
    color: "#3b82f6",
  },
  riil: {
    label: "Riil",
    color: "#f59e04",
  },
} satisfies ChartConfig;

export function DashboardMultiBarChart({
  chartData,
  isLoading,
}: {
  chartData?: Array<RekonsiliasiRecord>;
  isLoading?: boolean;
}) {
  const processedData =
    chartData?.map((item) => ({
      tanggal: item.tanggal,
      sistem: item.sistem,
      riil: item.riil,
      verified: item.verified,
    })) || [];

  if (isLoading) {
    return (
      <Card className="h-full shadow-lg border-3 border-slate-200 animate-pulse">
        <CardHeader>
          <CardTitle className="h-6 w-1/2 rounded bg-slate-200" />
        </CardHeader>
        <CardContent className="h-[270px] rounded-lg bg-slate-100" />
      </Card>
    );
  }

  return (
    <Card className="h-full shadow-lg border-3 border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-bold text-slate-900">
          Log Rekonsiliasi Kas (Aplikasi vs Riil)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[270px] w-full">
          <BarChart accessibilityLayer data={processedData} barGap={4}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="tanggal"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.split("-")[2]}
              stroke="#94a3b8"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value / 1000000}jt`}
              stroke="#94a3b8"
            />
            <ChartTooltip
              cursor={{ fill: "transparent" }}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend
              content={<ChartLegendContent />}
              verticalAlign="bottom"
            />
            <Bar
              dataKey="sistem"
              fill="var(--color-sistem)"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="riil"
              fill="var(--color-riil)"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
