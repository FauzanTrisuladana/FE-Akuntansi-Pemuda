import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import type { SaldoDailyRecord } from "./types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  pemasukan: {
    label: "Pemasukan",
    color: "#22c55e",
  },
  pengeluaran: {
    label: "Pengeluaran",
    color: "#ef4444",
  },
} satisfies ChartConfig;

export function DashboardBarChart({
  chartData,
  isLoading,
}: {
  chartData?: Array<SaldoDailyRecord>;
  isLoading?: boolean;
}) {
  const processedData =
    chartData?.map((item) => ({
      hari: item.tanggal,
      pemasukan: item.pemasukan,
      pengeluaran: item.pengeluaran,
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
          Perbandingan Pemasukan & Pengeluaran Harian
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[270px] w-full">
          <BarChart accessibilityLayer data={processedData} barGap={4}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="hari"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
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
            <Bar
              dataKey="pemasukan"
              fill="var(--color-pemasukan)"
              radius={[4, 4, 0, 0]}
              barSize={24}
            />
            <Bar
              dataKey="pengeluaran"
              fill="var(--color-pengeluaran)"
              radius={[4, 4, 0, 0]}
              barSize={24}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
